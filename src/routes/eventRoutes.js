const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas protegidas: requieren token
router.post('/', authMiddleware, eventController.createEvent);
router.put('/', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);
router.post('/:id/enrollment', authMiddleware, eventController.enrollUser);
router.delete('/:id/enrollment', authMiddleware, eventController.unenrollUser);

// Rutas públicas (opcional)
router.get('/', eventController.getAllEvents);

module.exports = router;

