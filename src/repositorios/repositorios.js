const db = require('../config/config');

exports.getPaginatedEvents = async (limit, offset) => {
  const query = `
    SELECT 
      e.id,
      e.nombre,
      e.descripcion,
      e.fecha,
      e.duracion_minutos,
      e.precio,
      e.inscripcion_activada,
      e.maxima_asistencia,
      json_build_object(
        'id', u.id,
        'nombre', u.primer_nombre,
        'apellido', u.ultimo_nombre,
        'email', u.username
      ) AS usuario,
      json_build_object(
        'id', el.id,
        'direccion', el.direccion,
        'ciudad', el.nombre
      ) AS ubicacion
    FROM events e
    JOIN users u ON e.id_creator_user = u.id
    JOIN event_locations el ON e.id_evento_locacion = el.id
    ORDER BY e.fecha
    LIMIT $1 OFFSET $2
  `;

  const result = await db.query(query, [limit, offset]);
  return result.rows;
};

exports.getPaginatedEventsWithFilters = async (limit, offset, filters) => {
  let baseQuery = `
    SELECT e.*, u.*, el.*, t.*
    FROM events e
    JOIN users u ON e.id_creator_user = u.id
    JOIN event_locations el ON e.id_evento_locacion = el.id
    LEFT JOIN event_tags et ON e.id = et.id_event
    LEFT JOIN tags t ON et.id_tag = t.id
    WHERE 1=1
  `;

  const values = [];
  let paramIndex = 1;

  if (filters.name) {
    baseQuery += ` AND LOWER(e.nombre) LIKE LOWER($${paramIndex++})`;
    values.push(`%${filters.name}%`);
  }

  if (filters.startdate) {
    baseQuery += ` AND e.fecha >= $${paramIndex++}`;
    values.push(filters.startdate);
  }

  if (filters.tag) {
    baseQuery += ` AND LOWER(t.name) LIKE LOWER($${paramIndex++})`;
    values.push(`%${filters.tag}%`);
  }

  baseQuery += ` ORDER BY e.fecha LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  values.push(limit, offset);

  const result = await db.query(baseQuery, values);
  return result.rows;
};
