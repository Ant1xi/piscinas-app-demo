import api from "./axiosConfig";

// --- Localización ---
export const getComunidades = () => api.get("/comunidades-autonomas");

export const getProvincias = (comunidadId) =>
  api.get(`/provincias?comunidadId=${comunidadId}`);

export const getMunicipios = (provinciaId) =>
  api.get(`/municipios/provincia/${provinciaId}`);

// --- Urbanizaciones ---
export const getUrbanizaciones = () => api.get("/urbanizaciones");

export const crearUrbanizacion = (datos) => api.post("/urbanizaciones", datos);

// --- Estructura de piscina (calles / bloques / viviendas / personas) ---
export const getCallesPiscina = (piscinaId) =>
  api.get(`/calles/piscina/${piscinaId}`);

export const getBloquesPiscina = (piscinaId) =>
  api.get(`/bloques/piscina/${piscinaId}`);

export const getViviendasCalle = (calleId) =>
  api.get(`/viviendas/calle/${calleId}`);

export const getViviendasBloque = (bloqueId) =>
  api.get(`/viviendas/bloque/${bloqueId}`);

export const getPersonasVivienda = (viviendaId) =>
  api.get(`/personas/vivienda/${viviendaId}`);

export const buscarPersonas = (piscinaId, texto) =>
  api.get(`/personas/buscar?piscinaId=${piscinaId}&texto=${encodeURIComponent(texto)}`);

// --- Auditoría ---
export const getAuditLog = (page = 0, size = 50) =>
  api.get(`/audit-log?page=${page}&size=${size}`);
