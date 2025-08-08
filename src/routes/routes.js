// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/controllers');

// URL → controlador
router.get('/', eventController.getAllEvents);

module.exports = router;
