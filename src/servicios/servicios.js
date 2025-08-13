// src/servicios/servicios.js
const db = require('../config/config');

// Obtener lista de eventos con paginación y filtros
exports.getEvents = async (page, limit, filters) => {
  const offset = (page - 1) * limit;
  const values = [];
  let where = [];

  if (filters.name) {
    values.push(`%${filters.name}%`);
    where.push(`name ILIKE $${values.length}`);
  }
  if (filters.startdate) {
    values.push(filters.startdate);
    where.push(`date >= $${values.length}`);
  }
  if (filters.tag) {
    values.push(`%${filters.tag}%`);
    where.push(`tags ILIKE $${values.length}`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const query = `
    SELECT *
    FROM events
    ${whereClause}
    ORDER BY date ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const result = await db.query(query, values);
  return { page, limit, total: result.rows.length, events: result.rows };
};

// Obtener un evento por ID
exports.getEventById = async (id) => {
  const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// Crear un evento
exports.createEvent = async (eventData) => {
  const {
    name,
    description,
    max_assistance,
    max_capacity,
    price,
    duration_in_minutes,
    id_event_location,
    date,
    id_creator_user
  } = eventData;

  const query = `
    INSERT INTO events
    (name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location, date, id_creator_user)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `;

  const values = [
    name,
    description,
    max_assistance,
    max_capacity,
    price,
    duration_in_minutes,
    id_event_location,
    date,
    id_creator_user
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

// Actualizar un evento
exports.updateEvent = async (id, eventData) => {
  const {
    name,
    description,
    max_assistance,
    max_capacity,
    price,
    duration_in_minutes,
    id_event_location,
    date
  } = eventData;

  const query = `
    UPDATE events
    SET name=$1, description=$2, max_assistance=$3, max_capacity=$4,
        price=$5, duration_in_minutes=$6, id_event_location=$7, date=$8
    WHERE id=$9
    RETURNING *
  `;

  const values = [
    name,
    description,
    max_assistance,
    max_capacity,
    price,
    duration_in_minutes,
    id_event_location,
    date,
    id
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

// Verificar si un evento tiene registros en event_registrations
exports.checkEventRegistrations = async (eventId) => {
  const result = await db.query(
    'SELECT COUNT(*) FROM event_registrations WHERE id_event = $1',
    [eventId]
  );
  return parseInt(result.rows[0].count) > 0;
};

// Eliminar un evento
exports.deleteEvent = async (id) => {
  await db.query('DELETE FROM events WHERE id = $1', [id]);
};
