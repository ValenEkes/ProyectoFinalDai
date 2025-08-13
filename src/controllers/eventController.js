// src/controllers/eventController.js
const eventService = require('../servicios/servicios');

// GET → Listar eventos
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      name: req.query.name || null,
      startdate: req.query.startdate || null,
      tag: req.query.tag || null
    };

    const result = await eventService.getEvents(page, limit, filters);
    return res.json(result);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

// POST → Crear evento
exports.createEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const {
      name,
      description,
      max_assistance,
      max_capacity,
      price,
      duration_in_minutes,
      id_event_location,
      date
    } = req.body;

    // Validaciones de negocio
    if (!name || name.length < 3 || !description || description.length < 3) {
      return res.status(400).json({ error: 'Nombre y descripción deben tener al menos 3 letras' });
    }

    if (max_assistance > max_capacity) {
      return res.status(400).json({ error: 'La asistencia máxima no puede superar la capacidad máxima' });
    }

    if (price < 0 || duration_in_minutes < 0) {
      return res.status(400).json({ error: 'El precio y la duración no pueden ser menores a cero' });
    }

    const newEvent = await eventService.createEvent({
      name,
      description,
      max_assistance,
      max_capacity,
      price,
      duration_in_minutes,
      id_event_location,
      date,
      id_creator_user: req.user.id
    });

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error al crear evento:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT → Actualizar evento
exports.updateEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const eventId = req.body.id;
    const event = await eventService.getEventById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (event.id_creator_user !== req.user.id) {
      return res.status(404).json({ error: 'No puedes modificar un evento que no es tuyo' });
    }

    const updated = await eventService.updateEvent(eventId, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE → Eliminar evento
exports.deleteEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const eventId = req.params.id;
    const event = await eventService.getEventById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (event.id_creator_user !== req.user.id) {
      return res.status(404).json({ error: 'No puedes eliminar un evento que no es tuyo' });
    }

    const hasRegistrations = await eventService.checkEventRegistrations(eventId);
    if (hasRegistrations) {
      return res.status(400).json({ error: 'No se puede eliminar, hay usuarios registrados' });
    }

    await eventService.deleteEvent(eventId);
    return res.status(200).json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
