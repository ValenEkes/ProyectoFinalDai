
const db = require('../config/config');


exports.getEvents = async (page, limit, filters) => {
  const offset = (page - 1) * limit;
  const values = [];
  let where = [];

  if (filters.name) {
    values.push(`%${filters.name}%`);
    where.push(`nombre ILIKE $${values.length}`);
  }
  if (filters.startdate) {
    values.push(filters.startdate);
    where.push(`fecha >= $${values.length}`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const query = `
    SELECT *
    FROM events
    ${whereClause}
    ORDER BY fecha ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const result = await db.query(query, values);
  return { page, limit, total: result.rows.length, events: result.rows };
};


exports.getEventById = async (id) => {
  const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
  return result.rows[0] || null;
};


exports.createEvent = async (eventData) => {
  const {
    nombre,
    descripcion,
    maxima_asistencia,
    maxima_capacidad,
    precio,
    duracion_minutos,
    id_evento_locacion,
    fecha,
    id_creator_user
  } = eventData;

  const query = `
    INSERT INTO events
    (nombre, descripcion, maxima_asistencia, maxima_capacidad, precio, duracion_minutos, id_evento_locacion, fecha, id_creator_user)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `;

  const values = [
    nombre,
    descripcion,
    maxima_asistencia,
    maxima_capacidad,
    precio,
    duracion_minutos,
    id_evento_locacion,
    fecha,
    id_creator_user
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};


exports.updateEvent = async (id, eventData) => {
  const {
    nombre,
    descripcion,
    maxima_asistencia,
    maxima_capacidad,
    precio,
    duracion_minutos,
    id_evento_locacion,
    fecha
  } = eventData;

  const query = `
    UPDATE events
    SET nombre=$1, descripcion=$2, maxima_asistencia=$3, maxima_capacidad=$4,
        precio=$5, duracion_minutos=$6, id_evento_locacion=$7, fecha=$8
    WHERE id=$9
    RETURNING *
  `;

  const values = [
    nombre,
    descripcion,
    maxima_asistencia,
    maxima_capacidad,
    precio,
    duracion_minutos,
    id_evento_locacion,
    fecha,
    id
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};


exports.checkEventRegistrations = async (eventId) => {
  const result = await db.query(
    'SELECT COUNT(*) FROM event_enrollments WHERE id_event = $1',
    [eventId]
  );
  return parseInt(result.rows[0].count) > 0;
};


exports.deleteEvent = async (id) => {
  await db.query('DELETE FROM events WHERE id = $1', [id]);
};
