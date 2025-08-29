const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const eventLocationController = require('../controllers/eventLocationController'); // Importa el controlador correcto

// Todas estas rutas requieren autenticación
router.get('/', authMiddleware, eventLocationController.getAllLocations);
router.get('/:id', authMiddleware, eventLocationController.getLocationById);
router.post('/', authMiddleware, eventLocationController.createLocation);
router.put('/:id', authMiddleware, eventLocationController.updateLocation);
router.delete('/:id', authMiddleware, eventLocationController.removeLocation);

module.exports = router;