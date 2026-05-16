import api from "./axiosConfig";

export const getPiscinas = () => api.get("/piscinas");

export const getPiscina = (id) => api.get(`/piscinas/${id}`);

export const crearPiscina = (datos) => api.post("/piscinas", datos);

export const actualizarPiscina = (id, datos) => api.put(`/piscinas/${id}`, datos);

export const eliminarPiscina = (id) => api.delete(`/piscinas/${id}`);

export const subirImagenPiscina = (id, formData) =>
  api.post(`/piscinas/${id}/imagen`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Piscinas asignadas al socorrista autenticado
export const getMisPiscinas = () => api.get("/socorrista-piscina/mis-piscinas");

// Horarios por piscina
export const getHorarios = (piscinaId) => api.get(`/piscinas/${piscinaId}/horarios`);
export const crearHorario = (piscinaId, datos) => api.post(`/piscinas/${piscinaId}/horarios`, datos);
export const actualizarHorario = (piscinaId, horarioId, datos) => api.put(`/piscinas/${piscinaId}/horarios/${horarioId}`, datos);
export const eliminarHorario = (piscinaId, horarioId) => api.delete(`/piscinas/${piscinaId}/horarios/${horarioId}`);
