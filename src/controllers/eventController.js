
const eventService = require('../servicios/servicios');
const db= require('../config/config')

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

    
    if (!name || name.trim().length < 3 || !description || description.trim().length < 3) {
      return res.status(400).json({ error: 'Nombre y descripción deben tener al menos 3 letras' });
    }

    if (max_assistance > max_capacity) {
      return res.status(400).json({ error: 'La asistencia máxima no puede superar la capacidad máxima' });
    }

    if (price < 0 || duration_in_minutes < 0) {
      return res.status(400).json({ error: 'El precio y la duración no pueden ser menores a cero' });
    }

    const newEvent = await eventService.createEvent({
      nombre: name,
      descripcion: description,
      maxima_asistencia: max_assistance,
      maxima_capacidad: max_capacity,
      precio: price,
      duracion_minutos: duration_in_minutes,
      id_evento_locacion: id_event_location,
      fecha: date,
      id_creator_user: req.user.id
    });

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error al crear evento:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const eventId = req.body.id;
    if (!eventId) {
      return res.status(400).json({ error: 'ID del evento requerido' });
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

    
    if (!name || name.trim().length < 3 || !description || description.trim().length < 3) {
      return res.status(400).json({ error: 'Nombre y descripción deben tener al menos 3 letras' });
    }

    if (max_assistance > max_capacity) {
      return res.status(400).json({ error: 'La asistencia máxima no puede superar la capacidad máxima' });
    }

    if (price < 0 || duration_in_minutes < 0) {
      return res.status(400).json({ error: 'El precio y la duración no pueden ser menores a cero' });
    }

    const event = await eventService.getEventById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (event.id_creator_user !== req.user.id) {
      return res.status(404).json({ error: 'No puedes modificar un evento que no es tuyo' });
    }

    const updated = await eventService.updateEvent(eventId, {
      nombre: name,
      descripcion: description,
      maxima_asistencia: max_assistance,
      maxima_capacidad: max_capacity,
      precio: price,
      duracion_minutos: duration_in_minutes,
      id_evento_locacion: id_event_location,
      fecha: date
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


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

exports.enrollUser = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id; // viene del middleware
  const now = new Date();

  try {
    // 1. Verificar que el evento exista
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    const event = eventResult.rows[0];

    // 2. Validaciones
    if (!event.enabled_for_enrollment) {
      return res.status(400).json({ error: 'El evento no está habilitado para inscripción' });
    }

    const startDate = new Date(event.start_date);
    if (startDate <= now) {
      return res.status(400).json({ error: 'No se puede inscribir a un evento pasado o que inicia hoy' });
    }

    // 3. Verificar capacidad máxima
    const countResult = await db.query(
      'SELECT COUNT(*) FROM enrollments WHERE event_id = $1',
      [eventId]
    );
    if (parseInt(countResult.rows[0].count) >= event.max_assistance) {
      return res.status(400).json({ error: 'Capacidad máxima alcanzada' });
    }

    // 4. Verificar que el usuario no esté ya inscripto
    const userResult = await db.query(
      'SELECT * FROM enrollments WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );
    if (userResult.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya está inscripto en el evento' });
    }

    // 5. Insertar inscripción
    await db.query(
      'INSERT INTO enrollments (event_id, user_id, registration_date_time) VALUES ($1, $2, $3)',
      [eventId, userId, now]
    );

    return res.status(201).json({ message: 'Usuario inscripto correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Cancelar inscripción de un usuario
exports.unenrollUser = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  const now = new Date();

  try {
    // 1. Verificar que el evento exista
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    const event = eventResult.rows[0];

    // 2. Validar que el evento aún no pasó
    const startDate = new Date(event.start_date);
    if (startDate <= now) {
      return res.status(400).json({ error: 'No se puede desinscribir de un evento pasado o que inicia hoy' });
    }

    // 3. Verificar si el usuario está inscripto
    const enrollmentResult = await db.query(
      'SELECT * FROM enrollments WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );
    if (enrollmentResult.rows.length === 0) {
      return res.status(400).json({ error: 'El usuario no está inscripto en el evento' });
    }

    // 4. Eliminar inscripción
    await db.query(
      'DELETE FROM enrollments WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    return res.status(200).json({ message: 'Usuario desinscripto correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};