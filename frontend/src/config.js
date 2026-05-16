// Configuración centralizada de URLs del backend.
// Los valores se leen de variables de entorno de Vite (VITE_API_URL, VITE_FILE_URL)
// con fallback al servidor local de desarrollo si no están definidas.

const stripTrailingSlash = (url) => (url || "").replace(/\/+$/, "");

export const API_URL = stripTrailingSlash(
    import.meta.env.VITE_API_URL || "http://localhost:8080/api"
);

export const FILE_URL = stripTrailingSlash(
    import.meta.env.VITE_FILE_URL || "http://localhost:8080"
);

// Helper para construir URLs absolutas de archivos servidos por el backend
// (imágenes de piscinas, fotos de perfil, etc).
// Acepta tanto "uploads/piscinas/x.jpg" como "/uploads/piscinas/x.jpg".
export const getFileUrl = (ruta) => {
    if (!ruta) return null;
    const limpia = ruta.startsWith("/") ? ruta.slice(1) : ruta;
    return `${FILE_URL}/${limpia}`;
};
