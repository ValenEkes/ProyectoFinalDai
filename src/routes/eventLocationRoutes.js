// routes/eventLocationRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const eventLocationController = require('../controllers/eventLocationController');

router.use(authMiddleware); // todas las rutas requieren autenticación

router.get('/', eventLocationController.getAll);
router.get('/:id', eventLocationController.getById);
router.post('/', eventLocationController.create);
router.put('/:id', eventLocationController.update);
router.delete('/:id', eventLocationController.remove);

// Rutas protegidas: requieren token
router.post('/', authMiddleware, eventController.createEvent);
router.put('/', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);
router.post('/:id/enrollment', authMiddleware, eventController.enrollUser);
router.delete('/:id/enrollment', authMiddleware, eventController.unenrollUser);

// Rutas públicas (opcional)
router.get('/', eventController.getAllEvents);

module.exports = router;
