import api from "./axiosConfig";

export const getIncidencias = () => api.get("/incidencias");

export const getIncidenciasPiscina = (piscinaId) =>
  api.get(`/incidencias/piscina/${piscinaId}`);

export const crearIncidencia = (datos) => api.post("/incidencias", datos);

export const ponerEnRevision = (id) => api.patch(`/incidencias/${id}/revision`);

export const cerrarIncidencia = (id, notaCierre) =>
  api.patch(`/incidencias/${id}/cerrar`, { notaCierre });
