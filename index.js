require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./src/config/config');
const Routes = require('./src/routes/routes');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenido desde el backend');
});

app.post('/api/user/register', [
  body('primer_nombre').isLength({ min: 3 }).withMessage('El campo primer_nombre debe tener al menos 3 letras'),
  body('ultimo_nombre').isLength({ min: 3 }).withMessage('El campo ultimo_nombre debe tener al menos 3 letras'),
  body('username').isEmail().withMessage('El email es invalido'),
  body('contraseña').isLength({ min: 3 }).withMessage('La contraseña debe tener al menos 3 letras'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, token: '' });
  }

  const { primer_nombre, ultimo_nombre, username, contraseña } = req.body;

  try {
    const userExist = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'El usuario ya existe', token: '' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    await db.query(
      'INSERT INTO users (primer_nombre, ultimo_nombre, username, contraseña) VALUES ($1, $2, $3, $4)',
      [primer_nombre, ultimo_nombre, username, hashedPassword]
    );

    return res.status(201).json({ success: true, message: 'Usuario creado correctamente', token: '' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error del servidor', token: '' });
  }
});

app.post('/api/user/login', [
  body('username').isEmail().withMessage('El email es invalido'),
  body('contraseña').exists().withMessage('La contraseña es requerida'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, token: '' });
  }

  const { username, contraseña } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario o clave inválida.', token: '' });
    }

    const user = userResult.rows[0];

    const isValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Usuario o clave inválida.', token: '' });
    }

    const token = jwt.sign(
      { id: user.id, primer_nombre: user.primer_nombre, ultimo_nombre: user.ultimo_nombre },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    return res.status(200).json({ success: true, message: '', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error del servidor', token: '' });
  }
});

app.use('/api/event', Routes);

db.query('SELECT NOW()')
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch((err) => console.error('Error de conexión a PostgreSQL:', err));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
