require('dotenv').config()

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Bienvenido desde el backend');
});

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD
});

pool.connect()
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch((err) => console.error('Error de conexión a PostgreSQL:', err));

  app.get('/api/event/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    try {
      const query = `
        SELECT 
          e.id,
          e.nombre,
          e.descripcion,
          e.fecha,
          e.duracion_minutos,
          e.precio,
          e.inscripcion_activada,
          e.maxima_asistencia,
          json_build_object(
            'id', u.id,
            'nombre', u.nombre,
            'email', u.email
          ) AS usuario,
          json_build_object(
            'id', l.id,
            'direccion', l.direccion,
            'ciudad', l.ciudad,
            'provincia', l.provincia
          ) AS ubicacion
        FROM events e
        JOIN users u ON e.id_creator_user = u.id
        JOIN locations l ON e.id_evento_locacion = l.id
        ORDER BY e.fecha
        LIMIT $1 OFFSET $2
      `;
  
      const result = await pool.query(query, [limit, offset]);
  
      res.json({
        pagina: page,
        por_pagina: limit,
        eventos: result.rows
      });
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      res.status(500).json({ error: 'Error al obtener eventos' });
    }
  });
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});