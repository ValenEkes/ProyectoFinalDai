const db = require('../config/config');

// Crear evento
exports.createEvent = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      id_evento_categoria,
      id_evento_locacion,
      duracion_minutos,
      precio,
      maxima_asistencia,
      enabled_for_enrollment,
      fecha
    } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !id_evento_categoria || !id_evento_locacion || !duracion_minutos || !precio || !maxima_asistencia || !fecha) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Convertir fecha a string ISO para PostgreSQL
    const fechaJS = new Date(fecha);
    if (isNaN(fechaJS.getTime())) {
      return res.status(400).json({ error: 'Fecha inválida' });
    }
    const fechaISO = fechaJS.toISOString(); // string plano

    // id_creator_user viene del token
    const id_creator_user = req.user.id;

    const result = await db.query(
      `INSERT INTO events 
        (nombre, descripcion, id_evento_categoria, id_evento_locacion, duracion_minutos, precio, maxima_asistencia, id_creator_user, enabled_for_enrollment, fecha)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        nombre,
        descripcion || '',
        id_evento_categoria,
        id_evento_locacion,
        duracion_minutos,
        precio,
        maxima_asistencia,
        id_creator_user,
        enabled_for_enrollment ?? true,
        fechaISO
      ]
    );

    res.status(201).json({ message: 'Evento creado correctamente', event: result.rows[0] });
  } catch (error) {
    console.error('CREATE EVENT ERROR:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar evento
exports.updateEvent = async (req, res) => {
  try {
    const {
      id,
      nombre,
      descripcion,
      id_evento_categoria,
      id_evento_locacion,
      duracion_minutos,
      precio,
      maxima_asistencia,
      enabled_for_enrollment,
      fecha
    } = req.body;

    if (!id) return res.status(400).json({ error: 'ID del evento requerido' });
    if (!nombre || !id_evento_categoria || !id_evento_locacion || !duracion_minutos || !precio || !maxima_asistencia || !fecha) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const fechaJS = new Date(fecha);
    if (isNaN(fechaJS.getTime())) {
      return res.status(400).json({ error: 'Fecha inválida' });
    }
    const fechaISO = fechaJS.toISOString();

    const result = await db.query(
      `UPDATE events 
       SET nombre=$1, descripcion=$2, id_evento_categoria=$3, id_evento_locacion=$4, duracion_minutos=$5, precio=$6, maxima_asistencia=$7, enabled_for_enrollment=$8, fecha=$9
       WHERE id=$10
       RETURNING *`,
      [
        nombre,
        descripcion || '',
        id_evento_categoria,
        id_evento_locacion,
        duracion_minutos,
        precio,
        maxima_asistencia,
        enabled_for_enrollment ?? true,
        fechaISO,
        id
      ]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    res.json({ message: 'Evento actualizado correctamente', event: result.rows[0] });
  } catch (error) {
    console.error('UPDATE EVENT ERROR:', error);
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
    console.error('DELETE EVENT ERROR:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Listar todos los eventos
exports.getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY fecha ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET EVENTS ERROR:', error);
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

    if (new Date(event.fecha) <= now) {
      return res.status(400).json({ error: 'No se puede inscribir a un evento pasado o que inicia hoy' });
    }

    const countResult = await db.query('SELECT COUNT(*) FROM event_enrollments WHERE id_event = $1', [eventId]);
    if (parseInt(countResult.rows[0].count) >= event.maxima_asistencia) {
      return res.status(400).json({ error: 'Capacidad máxima alcanzada' });
    }

    const userResult = await db.query('SELECT * FROM event_enrollments WHERE id_event=$1 AND id_user=$2', [eventId, userId]);
    if (userResult.rows.length > 0) return res.status(400).json({ error: 'El usuario ya está inscripto en el evento' });

    await db.query(
      'INSERT INTO event_enrollments (id_event, id_user, registration_date_time) VALUES ($1, $2, $3)',
      [eventId, userId, now]
    );

    res.status(201).json({ message: 'Usuario inscripto correctamente' });
  } catch (error) {
    console.error('ENROLL USER ERROR:', error);
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

    if (new Date(event.fecha) <= now) {
      return res.status(400).json({ error: 'No se puede desinscribir de un evento pasado o que inicia hoy' });
    }

    const enrollmentResult = await db.query('SELECT * FROM event_enrollments WHERE id_event=$1 AND id_user=$2', [eventId, userId]);
    if (enrollmentResult.rows.length === 0) return res.status(400).json({ error: 'El usuario no está inscripto en el evento' });

    await db.query('DELETE FROM event_enrollments WHERE id_event=$1 AND id_user=$2', [eventId, userId]);

    res.json({ message: 'Usuario desinscripto correctamente' });
  } catch (error) {
    console.error('UNENROLL USER ERROR:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
