import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setMensajeError("Por favor completa email y contraseña");
      activarShake();
      return;
    }

    setCargando(true);
    setMensajeError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      // Guardamos todos los datos del usuario para uso futuro
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("rol", response.data.rol);
      localStorage.setItem("nombre", response.data.nombre || "");
      localStorage.setItem("apellidos", response.data.apellidos || "");
      localStorage.setItem("usuarioId", response.data.usuarioId || "");
      localStorage.setItem("email", email);
      localStorage.setItem("fotoPerfil", response.data.fotoPerfil || "");

      if (response.data.rol === "ADMIN") {
        navigate("/admin");
      } else if (response.data.rol === "SOCORRISTA") {
        navigate("/socorrista");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        setMensajeError("Credenciales incorrectas");
      } else {
        setMensajeError("Error de conexión con el servidor");
      }
      activarShake();
    } finally {
      setCargando(false);
    }
  };

  const activarShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-bg bg-1"></div>
      <div className="login-bg bg-2"></div>
      <div className="login-bg bg-3"></div>
      <div className="login-bg bg-4"></div>
      <div className="login-bg bg-5"></div>
      <div className="login-bg bg-6"></div>
      <div className="login-overlay"></div>

      <div className={`login-card ${shake ? "shake" : ""}`}>
        <div className="login-logo">PiscinasApp</div>

        <h2>Bienvenido de nuevo</h2>
        <p className="login-subtitle">
          Accede al sistema de gestión inteligente de piscinas
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setMensajeError(""); }}
          onKeyDown={handleKeyDown}
          autoComplete="email"
          autoFocus
          disabled={cargando}
        />

        <div className="login-password-wrapper">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setMensajeError(""); }}
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
            disabled={cargando}
          />
          <button
            type="button"
            className="login-eye-btn"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            tabIndex={-1}
          >
            {mostrarPassword ? (
              // ojo abierto
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              // ojo cerrado
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
          </button>
        </div>

        {mensajeError && (
          <div className="login-error">{mensajeError}</div>
        )}

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={cargando}
        >
          {cargando ? (
            <span className="login-spinner"></span>
          ) : (
            "Entrar"
          )}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
