// Instancia Axios configurada para la API de PiscinasApp.
// Centraliza la URL base y gestiona el ciclo de vida del token JWT.
import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
    baseURL: API_URL,
});

// INTERCEPTOR DE REQUEST
// Añade automáticamente "Authorization: Bearer <token>" a cada petición saliente.
// Los componentes no necesitan gestionar la cabecera: solo llaman a la función de API.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// INTERCEPTOR DE RESPONSE
// Captura el error 401 (token expirado o firma inválida).
// Limpia todo el localStorage (token, rol, nombre, usuarioId…) y redirige al login
// para forzar una nueva autenticación, evitando peticiones en bucle con un token inválido.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;
