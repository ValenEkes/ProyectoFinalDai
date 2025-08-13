const db = require('../config/config');

exports.getPaginatedEvents = async (limit, offset) => {
  const query = `
    SELECT * FROM events
    ORDER BY fecha
    LIMIT $1 OFFSET $2
  `;
  const result = await db.query(query, [limit, offset]);
  return result.rows;
};

exports.getPaginatedEventsWithFilters = async (limit, offset, filters) => {
  let baseQuery = `SELECT * FROM events WHERE 1=1`;
  const values = [];
  let paramIndex = 1;

  if (filters.name) {
    baseQuery += ` AND LOWER(nombre) LIKE LOWER($${paramIndex++})`;
    values.push(`%${filters.name}%`);
  }
  if (filters.startdate) {
    baseQuery += ` AND fecha >= $${paramIndex++}`;
    values.push(filters.startdate);
  }

  baseQuery += ` ORDER BY fecha LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  values.push(limit, offset);

  const result = await db.query(baseQuery, values);
  return result.rows;
};

exports.insertEvent = async (data) => {
  const query = `
    INSERT INTO events (nombre, descripcion, maxima_asistencia, max_capacity, precio, duracion_minutos, id_evento_locacion, fecha, id_creator_user)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *;
  `;
  const values = [
    data.name, data.description, data.max_assistance, data.max_capacity,
    data.price, data.duration_in_minutes, data.id_event_location, data.date, data.id_creator_user
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

exports.getEventById = async (id) => {
  const result = await db.query(`SELECT * FROM events WHERE id = $1`, [id]);
  return result.rows[0];
};

exports.updateEvent = async (id, data) => {
  const query = `
    UPDATE events
    SET nombre=$1, descripcion=$2, maxima_asistencia=$3, max_capacity=$4, precio=$5, duracion_minutos=$6, id_evento_locacion=$7, fecha=$8
    WHERE id=$9
    RETURNING *;
  `;
  const values = [
    data.name, data.description, data.max_assistance, data.max_capacity,
    data.price, data.duration_in_minutes, data.id_event_location, data.date, id
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

exports.deleteEvent = async (id) => {
  await db.query(`DELETE FROM events WHERE id = $1`, [id]);
};

exports.eventHasRegistrations = async (id) => {
  const result = await db.query(`SELECT COUNT(*) FROM event_registrations WHERE id_event = $1`, [id]);
  return parseInt(result.rows[0].count) > 0;
};
