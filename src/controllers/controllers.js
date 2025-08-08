const eventService = require('../servicios/servicios');

exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      name: req.query.name || null,
      startdate: req.query.startdate || null,
      tag: req.query.tag || null
    };

    const result = await eventService.getEvents(page, limit, filters);
    return res.json(result); // return evita que el código siga
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return res.status(500).json({ error: error.message || 'Error al obtener eventos' });
  }
};

