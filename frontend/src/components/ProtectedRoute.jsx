// Componente de ruta protegida por rol.
//
// Protege cualquier página que requiera autenticación o un rol específico.
// Si el usuario no tiene token (sesión no iniciada) o su rol no coincide
// con el requerido, redirige a "/" en lugar de renderizar los hijos.
//
// Uso: <ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>
// El token y el rol se leen de localStorage donde los guarda LoginPage tras el login.
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    // Sin token: sesión no iniciada → redirige al login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Con token pero rol incorrecto: acceso denegado → redirige al login
    // Ej: un SOCORRISTA que intenta acceder a "/admin"
    if (requiredRole && rol !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
