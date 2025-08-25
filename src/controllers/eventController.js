const db = require('../config/config');

// Crear evento
exports.createEvent = async (req, res) => {
  try {
    const { title, description, start_date, max_assistance, enabled_for_enrollment } = req.body;

    if (!title || !start_date || !max_assistance) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const result = await db.query(
      'INSERT INTO events (title, description, start_date, max_assistance, enabled_for_enrollment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description || '', start_date, max_assistance, enabled_for_enrollment || false]
    );

    res.status(201).json({ message: 'Evento creado correctamente', event: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar evento
exports.updateEvent = async (req, res) => {
  try {
    const { id, title, description, start_date, max_assistance, enabled_for_enrollment } = req.body;
    if (!id) return res.status(400).json({ error: 'ID del evento requerido' });

    const result = await db.query(
      'UPDATE events SET title=$1, description=$2, start_date=$3, max_assistance=$4, enabled_for_enrollment=$5 WHERE id=$6 RETURNING *',
      [title, description, start_date, max_assistance, enabled_for_enrollment, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    res.json({ message: 'Evento actualizado correctamente', event: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar evento
exports.deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query('DELETE FROM events WHERE id=$1 RETURNING *', [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Listar todos los eventos
exports.getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY start_date ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Inscribir usuario en evento
exports.enrollUser = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  const now = new Date();

  try {
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    const event = eventResult.rows[0];

    if (!event.enabled_for_enrollment) {
      return res.status(400).json({ error: 'El evento no está habilitado para inscripción' });
    }

    if (new Date(event.start_date) <= now) {
      return res.status(400).json({ error: 'No se puede inscribir a un evento pasado o que inicia hoy' });
    }

    const countResult = await db.query('SELECT COUNT(*) FROM enrollments WHERE event_id = $1', [eventId]);
    if (parseInt(countResult.rows[0].count) >= event.max_assistance) {
      return res.status(400).json({ error: 'Capacidad máxima alcanzada' });
    }

    const userResult = await db.query('SELECT * FROM enrollments WHERE event_id=$1 AND user_id=$2', [eventId, userId]);
    if (userResult.rows.length > 0) return res.status(400).json({ error: 'El usuario ya está inscripto en el evento' });

    await db.query(
      'INSERT INTO enrollments (event_id, user_id, registration_date_time) VALUES ($1, $2, $3)',
      [eventId, userId, now]
    );

    res.status(201).json({ message: 'Usuario inscripto correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Desinscribir usuario de evento
exports.unenrollUser = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  const now = new Date();

  try {
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    const event = eventResult.rows[0];

    if (new Date(event.start_date) <= now) {
      return res.status(400).json({ error: 'No se puede desinscribir de un evento pasado o que inicia hoy' });
    }

    const enrollmentResult = await db.query('SELECT * FROM enrollments WHERE event_id=$1 AND user_id=$2', [eventId, userId]);
    if (enrollmentResult.rows.length === 0) return res.status(400).json({ error: 'El usuario no está inscripto en el evento' });

    await db.query('DELETE FROM enrollments WHERE event_id=$1 AND user_id=$2', [eventId, userId]);

    res.json({ message: 'Usuario desinscripto correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
// Obtener todos los event-locations (paginado)
exports.getAllLocations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const result = await db.query(
      'SELECT * FROM event_locations WHERE user_id = $1 LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Obtener un event-location por ID
exports.getLocationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM event_locations WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Crear un event-location
exports.createLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address } = req.body;

    const result = await db.query(
      'INSERT INTO event_locations (name, address, user_id) VALUES ($1, $2, $3) RETURNING *',
      [name, address, userId]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Actualizar un event-location
exports.updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, address } = req.body;

    const result = await db.query(
      'UPDATE event_locations SET name = $1, address = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, address, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Eliminar un event-location
exports.removeLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM event_locations WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
    }

    res.status(200).json({ success: true, message: 'Ubicación eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};