const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// No ponemos paréntesis después de login, pasamos la función
router.post('/login', authController.login);

// Si tenés registro en otro método
// router.post('/register', authController.register);

module.exports = router;
