import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Panel admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPiscinaDetalle from "./pages/admin/AdminPiscinaDetalle";

// Panel socorrista
import SocorristaDashboard from "./pages/socorrista/SocorristaDashboard";
import SocorristaPiscinaDetalle from "./pages/socorrista/SocorristaPiscinaDetalle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Inicio / Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Panel Administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/piscinas/:id"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPiscinaDetalle />
            </ProtectedRoute>
          }
        />

        {/* Panel Socorrista */}
        <Route
          path="/socorrista"
          element={
            <ProtectedRoute requiredRole="SOCORRISTA">
              <SocorristaDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/socorrista/piscinas/:id"
          element={
            <ProtectedRoute requiredRole="SOCORRISTA">
              <SocorristaPiscinaDetalle />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
