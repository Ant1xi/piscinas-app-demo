import api from "./axiosConfig";

// --- Accesos de vecinos ---
export const registrarEntrada = (datos) => api.post("/accesos/entrada", datos);

export const registrarSalida = (datos) => api.patch("/accesos/salida", datos);

export const getPersonasDentro = (piscinaId) =>
  api.get(`/accesos/piscina/${piscinaId}/dentro`);

export const getCountDentro = (piscinaId) =>
  api.get(`/accesos/piscina/${piscinaId}/dentro/count`);

export const getEntradasHoy = (piscinaId) =>
  api.get(`/accesos/piscina/${piscinaId}/hoy/count`);

export const getUltimosAccesos = (piscinaId, limit = 10) =>
  api.get(`/accesos/piscina/${piscinaId}/ultimos?limit=${limit}`);

// --- Invitados ---
export const getInvitadosActivos = (piscinaId) =>
  api.get(`/registro-invitados/piscina/${piscinaId}/activos`);

export const registrarEntradaInvitados = (datos) =>
  api.post("/registro-invitados/entrada", datos);

export const registrarSalidaInvitados = (datos) =>
  api.patch("/registro-invitados/salida", datos);
