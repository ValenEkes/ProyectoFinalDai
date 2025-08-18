
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, eventController.createEvent);


router.put('/', authMiddleware, eventController.updateEvent);


router.delete('/:id', authMiddleware, eventController.deleteEvent);


router.get('/', eventController.getAllEvents);

module.exports = router;
