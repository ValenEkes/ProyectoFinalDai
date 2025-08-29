const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear evento
router.post('/create', authMiddleware, eventController.createEvent);

// Actualizar evento
router.put('/:id', authMiddleware, eventController.updateEvent); // Agregué el :id, es necesario
router.delete('/:id', authMiddleware, eventController.deleteEvent);

// Inscribirse a un evento
router.post('/:id/enrollment', authMiddleware, eventController.enrollUser);

// Desinscribirse de un evento
router.delete('/:id/enrollment', authMiddleware, eventController.unenrollUser);

// Listar todos los eventos
router.get('/', eventController.getAllEvents);

module.exports = router;