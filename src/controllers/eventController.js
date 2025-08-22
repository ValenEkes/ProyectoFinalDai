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
