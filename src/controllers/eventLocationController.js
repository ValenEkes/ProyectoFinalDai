const db = require('../config/config');

// Obtener todos los event-locations del usuario autenticado
exports.getAllLocations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      'SELECT * FROM event_locations WHERE id_creator_user = $1 LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Obtener un event-location por ID del usuario autenticado
exports.getLocationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM event_locations WHERE id = $1 AND id_creator_user = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      // 404 si el ID no existe o no pertenece al usuario
      return res.status(404).json({ success: false, message: 'Ubicación no encontrada o no pertenece al usuario' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Crear un event-location con validaciones de negocio
exports.createLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, direccion, capacidad_max, id_locations, latitud, longitud } = req.body;

    // AÑADE ESTA LÍNEA DE VALIDACIÓN
    if (id_locations === undefined || id_locations === null) {
      return res.status(400).json({ success: false, message: 'El campo id_locations es requerido' });
    }

    // Validaciones de negocio
    if (!nombre || nombre.length < 3) {
      return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 3 letras' });
    }
    if (!direccion || direccion.length < 3) {
      return res.status(400).json({ success: false, message: 'La dirección debe tener al menos 3 letras' });
    }
    if (capacidad_max === undefined || capacidad_max <= 0) {
      return res.status(400).json({ success: false, message: 'La capacidad debe ser mayor que 0' });
    }

    const result = await db.query(
      'INSERT INTO event_locations (id_locations, nombre, direccion, capacidad_max, id_creator_user, latitud, longitud) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id_locations, nombre, direccion, capacidad_max, userId, latitud, longitud]
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
    const { nombre, direccion, capacidad_max } = req.body;

    // Puedes agregar validaciones de negocio aquí si es necesario
    const result = await db.query(
      'UPDATE event_locations SET nombre = COALESCE($1, nombre), direccion = COALESCE($2, direccion), capacidad_max = COALESCE($3, capacidad_max) WHERE id = $4 AND id_creator_user = $5 RETURNING *',
      [nombre, direccion, capacidad_max, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ubicación no encontrada o no pertenece al usuario' });
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
      'DELETE FROM event_locations WHERE id = $1 AND id_creator_user = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ubicación no encontrada o no pertenece al usuario' });
    }

    res.status(200).json({ success: true, message: 'Ubicación eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};