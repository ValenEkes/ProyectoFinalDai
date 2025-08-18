
const db = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.register = async (req, res) => {
  try {
    const { primer_nombre, ultimo_nombre, email, contraseña } = req.body;

    
    if (!primer_nombre || !ultimo_nombre || !email || !contraseña) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos', token: '' });
    }

    
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado', token: '' });
    }

    
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    
    const newUser = await db.query(
      'INSERT INTO users (primer_nombre, ultimo_nombre, email, contraseña) VALUES ($1, $2, $3, $4) RETURNING *',
      [primer_nombre, ultimo_nombre, email, hashedPassword]
    );

    const user = newUser.rows[0];

    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        primer_nombre: user.primer_nombre,
        ultimo_nombre: user.ultimo_nombre
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', token: '' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos', token: '' });
    }

    
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'El email es inválido', token: '' });
    }

    const user = result.rows[0];

    
    const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta', token: '' });
    }

    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        primer_nombre: user.primer_nombre,
        ultimo_nombre: user.ultimo_nombre
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', token: '' });
  }
};
