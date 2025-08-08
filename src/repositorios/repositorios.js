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
        'nombre', u.nombre,
        'email', u.email
      ) AS usuario,
      json_build_object(
        'id', l.id,
        'direccion', l.direccion,
        'ciudad', l.ciudad,
        'provincia', l.provincia
      ) AS ubicacion
    FROM events e
    JOIN users u ON e.id_creator_user = u.id
    JOIN locations l ON e.id_evento_locacion = l.id
    ORDER BY e.fecha
    LIMIT $1 OFFSET $2
  `;
  const result = await db.query(query, [limit, offset]);
  return result.rows;
};
