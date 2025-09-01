require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./src/config/config');


// Inicializar app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares base
app.use(cors());
app.use(express.json());

// ================== Auth Middleware ==================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Token no enviado' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = {
      id: payload.id,
      primer_nombre: payload.primer_nombre,
      ultimo_nombre: payload.ultimo_nombre,
    };
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
}

// ================== Rutas ==================
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const eventEnrollmentRoutes = require('./src/routes/eventEnrollmentRoutes');

let eventLocationRoutes = null;
try {
  eventLocationRoutes = require('./src/routes/eventLocationRoutes');
} catch (err) {
  console.warn('[WARN] No se encontró ./src/routes/eventLocationRoutes. Se omite /api/event-location.');
}

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/event-location', eventLocationRoutes);

// Ruta pública
app.get('/', (req, res) => {
  res.send('Bienvenido desde el backend');
});

// ================== REGISTER MANUAL ==================
app.post(
  '/api/user/register',
  [
    body('primer_nombre').isLength({ min: 3 }).withMessage('El campo primer_nombre debe tener al menos 3 letras'),
    body('ultimo_nombre').isLength({ min: 3 }).withMessage('El campo ultimo_nombre debe tener al menos 3 letras'),
    body('username').isLength({ min: 3 }).withMessage('El username es requerido'),
    body('contraseña').isLength({ min: 3 }).withMessage('La contraseña debe tener al menos 3 letras'),
  ],
  async (req, res) => {
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
        'INSERT INTO users (primer_nombre, ultimo_nombre, username, "contraseña") VALUES ($1, $2, $3, $4)',
        [primer_nombre, ultimo_nombre, username, hashedPassword]
      );

      return res.status(201).json({ success: true, message: 'Usuario creado correctamente', token: '' });
    } catch (err) {
      console.error('REGISTER ERROR:', err);
      return res.status(500).json({ success: false, message: 'Error del servidor', token: '' });
    }
  }
);

// ================== LOGIN MANUAL ==================
app.post(
  '/api/user/login',
  [
    body('username').isLength({ min: 3 }).withMessage('El username es requerido'),
    body('contraseña').exists().withMessage('La contraseña es requerida'),
  ],
  async (req, res) => {
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
      const isValid = await bcrypt.compare(contraseña, user['contraseña']);
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
      console.error('LOGIN ERROR:', err);
      return res.status(500).json({ success: false, message: 'Error del servidor', token: '' });
    }
  }
);

// ================== DELETE USER (Borrar Usuario) ==================
app.delete('/api/user/delete', authMiddleware, async (req, res) => {
  const userId = req.user.id;  // El ID del usuario proviene del token

  try {
    // Verificar si el usuario existe
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Eliminar las inscripciones del usuario en eventos (si hay alguna)
    await db.query('DELETE FROM event_enrollments WHERE id_user = $1', [userId]);

    // Eliminar el usuario de la tabla "users"
    await db.query('DELETE FROM users WHERE id = $1', [userId]);

    return res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// ================== CONEXIÓN ==================
db.query('SELECT NOW()')
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch((err) => console.error('Error de conexión a PostgreSQL:', err));

// ================== LEVANTAR SERVIDOR ==================
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
