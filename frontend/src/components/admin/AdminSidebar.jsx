import { useState } from "react";
import AvatarUsuario from "../ui/AvatarUsuario";

const ICONOS = {
  piscinas: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  urbanizaciones: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="13" rx="2"/>
      <path d="M8 22V12m8 10V12M3 9l9-7 9 7"/>
    </svg>
  ),
  socorristas: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  incidencias: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  auditoria: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  perfil: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

const IcoLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

function AdminSidebar({ seccionActiva, setSeccionActiva, cerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const nombre = localStorage.getItem("nombre") || "A";
  const apellidos = localStorage.getItem("apellidos") || "";
  const fotoPerfil = localStorage.getItem("fotoPerfil") || null;

  const items = [
    { id: "piscinas",       label: "Piscinas" },
    { id: "urbanizaciones", label: "Urbanizaciones" },
    { id: "socorristas",    label: "Socorristas" },
    { id: "incidencias",    label: "Incidencias" },
    { id: "auditoria",      label: "Auditoría" },
    { id: "perfil",         label: "Mi perfil" },
  ];

  const navegarA = (id) => {
    setSeccionActiva(id);
    setMenuAbierto(false);
  };

  return (
    <>
      {/* ── ESCRITORIO: sidebar vertical clásica ── */}
      <aside className="sidebar">
        <h2>PiscinasApp</h2>

        <div className="sidebar-avatar">
          <AvatarUsuario usuario={{ nombre, fotoPerfil }} size={36} />
          <span className="sidebar-avatar-name">{nombre} {apellidos}</span>
        </div>

        <nav>
          {items.map((item) => (
            <p
              key={item.id}
              className={seccionActiva === item.id ? "active" : ""}
              onClick={() => setSeccionActiva(item.id)}
            >
              <span className="sidebar-icon">{ICONOS[item.id]}</span>
              {item.label}
            </p>
          ))}
        </nav>

        <button className="logout" onClick={cerrarSesion}>
          <IcoLogout />
          Cerrar sesión
        </button>
      </aside>

      {/* ── MÓVIL: barra superior con hamburguesa ── */}
      <div className="sidebar-mobile-bar">
        <span className="sidebar-mobile-logo">PiscinasApp</span>
        <button
          className="sidebar-hamburguesa"
          onClick={() => setMenuAbierto(v => !v)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        >
          {menuAbierto ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Backdrop semitransparente — cierra el menú al pulsar fuera */}
      <div
        className={`sidebar-mobile-backdrop${menuAbierto ? " sidebar-mobile-backdrop--visible" : ""}`}
        onClick={() => setMenuAbierto(false)}
      />

      {/* Panel de navegación deslizante */}
      <div className={`sidebar-mobile-menu${menuAbierto ? " sidebar-mobile-menu--open" : ""}`}>
        <div className="sidebar-mobile-head">
          <AvatarUsuario usuario={{ nombre, fotoPerfil }} size={40} />
          <span className="sidebar-mobile-head-name">{nombre} {apellidos}</span>
        </div>

        <nav className="sidebar-mobile-nav">
          {items.map((item) => (
            <button
              key={item.id}
              className={`sidebar-mobile-item${seccionActiva === item.id ? " active" : ""}`}
              onClick={() => navegarA(item.id)}
            >
              <span className="sidebar-icon">{ICONOS[item.id]}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="sidebar-mobile-logout" onClick={cerrarSesion}>
          <IcoLogout />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default AdminSidebar;
