const eventRepository = require('../repositorios/repositorios');

exports.getEvents = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const events = await eventRepository.getPaginatedEvents(limit, offset);
  return {
    pagina: page,
    por_pagina: limit,
    eventos: events
  };
};
exports.getEvents = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const events = await eventRepository.getPaginatedEvents(limit, offset, filters);
  return {
    pagina: page,
    por_pagina: limit,
    eventos: events
  };
};
