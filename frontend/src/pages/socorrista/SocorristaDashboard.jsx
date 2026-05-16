// Panel principal del socorrista.
// Gestiona la navegación entre las 3 secciones:
// - Mis Piscinas: lista de piscinas asignadas
// - Mi Área: calendario personal e histórico de horas
// - Mi Perfil: datos personales y foto de perfil
import { useState } from "react";
import MiPiscinasSection from "../../components/socorrista/MiPiscinasSection";
import MiAreaSection from "../../components/socorrista/MiAreaSection";
import MiPerfilSection from "../../components/socorrista/MiPerfilSection";
import AvatarUsuario from "../../components/ui/AvatarUsuario";
import "./SocorristaDashboard.css";

function SocorristaDashboard() {
  const [seccion, setSeccion] = useState("piscinas");
  const [fotoPerfil, setFotoPerfil] = useState(localStorage.getItem("fotoPerfil") || "");

  const nombre = localStorage.getItem("nombre") || "Socorrista";
  const apellidos = localStorage.getItem("apellidos") || "";

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="soc-app">
      <header className="soc-header">
        <div className="soc-header-logo">PiscinasApp</div>
        <div className="soc-header-user">
          <AvatarUsuario usuario={{ nombre, fotoPerfil }} size={32} />
          <span className="soc-header-nombre">{nombre} {apellidos}</span>
          <button className="soc-header-logout" onClick={cerrarSesion}>Salir</button>
        </div>
      </header>

      <main className="soc-main">
        {seccion === "piscinas" && <MiPiscinasSection />}
        {seccion === "area" && <MiAreaSection />}
        {seccion === "perfil" && <MiPerfilSection onFotoActualizada={setFotoPerfil} />}
      </main>

      <nav className="soc-bottom-nav">
        <button
          className={seccion === "piscinas" ? "soc-nav-btn active" : "soc-nav-btn"}
          onClick={() => setSeccion("piscinas")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Mis Piscinas
        </button>

        <button
          className={seccion === "area" ? "soc-nav-btn active" : "soc-nav-btn"}
          onClick={() => setSeccion("area")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Mi Área
        </button>

        <button
          className={seccion === "perfil" ? "soc-nav-btn active" : "soc-nav-btn"}
          onClick={() => setSeccion("perfil")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Mi Perfil
        </button>
      </nav>
    </div>
  );
}

export default SocorristaDashboard;
