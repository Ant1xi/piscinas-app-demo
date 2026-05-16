import api from "./axiosConfig";

export const getTurnosPiscina = (piscinaId, desde, hasta) =>
  api.get(`/turnos/piscina/${piscinaId}?desde=${desde}&hasta=${hasta}`);

// Turnos del socorrista autenticado
export const getMisTurnos = (desde, hasta) =>
  api.get(`/turnos/mis-turnos?desde=${desde}&hasta=${hasta}`);

export const getTurnosSocorrista = (socorristaId, desde, hasta) =>
  api.get(`/turnos/socorrista/${socorristaId}?desde=${desde}&hasta=${hasta}`);

export const crearTurno = (datos) => api.post("/turnos", datos);

export const eliminarTurno = (id) => api.delete(`/turnos/${id}`);
