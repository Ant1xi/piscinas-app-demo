import api from "./axiosConfig";

export const getUsuarios = () => api.get("/usuarios");

export const crearUsuario = (datos) => api.post("/usuarios", datos);

export const actualizarUsuario = (id, datos) => api.put(`/usuarios/${id}`, datos);

export const cambiarPassword = (id, nuevaPassword) =>
  api.patch(`/usuarios/${id}/password`, { nuevaPassword });

export const activarUsuario = (id) => api.patch(`/usuarios/${id}/activar`);

export const desactivarUsuario = (id) => api.patch(`/usuarios/${id}/desactivar`);

// --- Asignaciones socorrista-piscina ---
export const getSocorristasPiscina = (piscinaId) =>
  api.get(`/socorrista-piscina/piscina/${piscinaId}/socorristas`);

export const asignarSocorrista = (socorristaId, piscinaId) =>
  api.post("/socorrista-piscina/asignar", { socorristaId, piscinaId });

export const quitarSocorrista = (asignacionId) =>
  api.patch(`/socorrista-piscina/desactivar/${asignacionId}`);
