const express = require('express');
const router = express.Router();
const db = require('../config/config');
const authMiddleware = require('../middlewares/authMiddleware'); // usamos el mismo que ya tenés

// ================== POST: Inscribirse a un evento ==================
router.post('/:id/enrollment', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  try {
    // 1. Verificar si el evento existe
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    const event = eventResult.rows[0];

    // 2. Validaciones según consigna
    const today = new Date();
    const eventDate = new Date(event.start_date);

    if (!event.enabled_for_enrollment) {
      return res.status(400).json({ success: false, message: 'El evento no está habilitado para inscripción' });
    }
    if (eventDate <= today) {
      return res.status(400).json({ success: false, message: 'No se puede inscribir a un evento pasado o que empieza hoy' });
    }

    // capacidad máxima
    const countResult = await db.query('SELECT COUNT(*) FROM event_enrollments WHERE id_event = $1', [eventId]);
    const currentCount = parseInt(countResult.rows[0].count, 10);
    if (currentCount >= event.max_assistance) {
      return res.status(400).json({ success: false, message: 'El evento ya alcanzó la capacidad máxima' });
    }

    // ya registrado
    const alreadyEnrolled = await db.query(
      'SELECT * FROM event_enrollments WHERE id_event = $1 AND id_user = $2',
      [eventId, userId]
    );
    if (alreadyEnrolled.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya estás registrado en este evento' });
    }

    // 3. Insertar inscripción
    await db.query(
      'INSERT INTO event_enrollments (id_event, id_user, "Registro_tiempo") VALUES ($1, $2, NOW())',
      [eventId, userId]
    );

    return res.status(201).json({ success: true, message: 'Inscripción realizada con éxito' });
  } catch (err) {
    console.error('ENROLLMENT ERROR:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// ================== DELETE: Borrarse de un evento ==================
router.delete('/:id/enrollment', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  try {
    // 1. Verificar si el evento existe
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    const event = eventResult.rows[0];

    const today = new Date();
    const eventDate = new Date(event.start_date);
    if (eventDate <= today) {
      return res.status(400).json({ success: false, message: 'No se puede cancelar inscripción a un evento pasado o que empieza hoy' });
    }

    // 2. Verificar si está inscrito
    const enrollment = await db.query(
      'SELECT * FROM event_enrollments WHERE id_event = $1 AND id_user = $2',
      [eventId, userId]
    );
    if (enrollment.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No estás inscrito en este evento' });
    }

    // 3. Eliminar inscripción
    await db.query('DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2', [eventId, userId]);

    return res.status(200).json({ success: true, message: 'Inscripción eliminada con éxito' });
  } catch (err) {
    console.error('UNENROLL ERROR:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;
