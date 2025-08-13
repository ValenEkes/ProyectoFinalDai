// src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST → Crear evento (necesita autenticación)
router.post('/', authMiddleware, eventController.createEvent);

// PUT → Actualizar evento (necesita autenticación)
router.put('/', authMiddleware, eventController.updateEvent);

// DELETE → Eliminar evento (necesita autenticación)
router.delete('/:id', authMiddleware, eventController.deleteEvent);

// GET → Listar eventos (no necesita autenticación)
router.get('/', eventController.getAllEvents);

module.exports = router;
