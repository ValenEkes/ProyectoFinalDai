require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Routes = require('./src/routes/routes');
const db = require('./src/config/config');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Ruta base
app.get('/', (req, res) => {
  res.send('Bienvenido desde el backend');
});

// API de eventos
app.use('/api/event', Routes);

// Verificar conexión
db.query('SELECT NOW()')
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch((err) => console.error('Error de conexión a PostgreSQL:', err));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
