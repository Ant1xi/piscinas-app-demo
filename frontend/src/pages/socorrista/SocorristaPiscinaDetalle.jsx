// Vista de una piscina específica para el socorrista.
// Sidebar con 3 tabs: Operativa, Incidencias, Mi Turno.
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { getFileUrl } from "../../config";
import { getHorarios } from "../../api/piscinaApi";
import AppMessage from "../../components/admin/AppMessage";
import OperativaTab from "../../components/socorrista/piscina/OperativaTab";
import IncidenciasSocTab from "../../components/socorrista/piscina/IncidenciasSocTab";
import MiTurnoTab from "../../components/socorrista/piscina/MiTurnoTab";
import "./SocorristaPiscinaDetalle.css";

const IcoPool = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12c2-4 4-6 6-6s4 4 6 4 4-4 6-4"/>
    <path d="M2 18c2-4 4-6 6-6s4 4 6 4 4-4 6-4"/>
  </svg>
);

const IcoWarn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IcoCal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

function SocorristaPiscinaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [piscina, setPiscina] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [tabActiva, setTabActiva] = useState("operativa");
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => { cargarPiscina(); }, [id]);
  useEffect(() => {
    getHorarios(id).then(r => setHorarios(r.data)).catch(() => setHorarios([]));
  }, [id]);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3500);
  };

  const cargarPiscina = async () => {
    try {
      const res = await api.get(`/piscinas/${id}`);
      setPiscina(res.data);
    } catch {
      mostrarMensaje("error", "Error al cargar la piscina");
    }
  };

  const obtenerHorarioHoy = (hrs) => {
    const diasMap = { 0: "D", 1: "L", 2: "M", 3: "X", 4: "J", 5: "V", 6: "S" };
    const diaHoy = diasMap[new Date().getDay()];
    const tramosHoy = (hrs || [])
      .filter(h => h.activo && h.diasSemana.includes(diaHoy))
      .sort((a, b) => a.horaApertura.localeCompare(b.horaApertura));
    if (tramosHoy.length === 0) return "Cerrado hoy";
    return tramosHoy.map(t => `${t.horaApertura}–${t.horaCierre}`).join(" / ");
  };

  const obtenerImagenPiscina = (rutaImagen) => {
    if (!rutaImagen) return "/login-backgrounds/piscina1.jpg";
    if (rutaImagen.startsWith("http")) return rutaImagen;
    return getFileUrl(rutaImagen);
  };

  if (!piscina) return <div className="detalle-loading">Cargando...</div>;

  return (
    <div className="detalle-page">
      {mensaje && <AppMessage tipo={mensaje.tipo} texto={mensaje.texto} />}

      <header
        className="piscina-header"
        style={{ backgroundImage: `url(${obtenerImagenPiscina(piscina.rutaImagen)})` }}
      >
        <div className="piscina-header-overlay" />
        <div className="piscina-header-content">
          <div className="piscina-header-left">
            <button className="piscina-back-btn" onClick={() => navigate("/socorrista")}>← Volver</button>
            <div className="piscina-header-info">
              <span className="piscina-header-badge">{piscina.urbanizacionNombre || "Sin urbanización"}</span>
              <strong>{piscina.nombre}</strong>
              <span>{piscina.municipioNombre || "—"} · {obtenerHorarioHoy(horarios)}</span>
              {piscina.googleMapsUrl && (
                <a href={piscina.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="piscina-header-maps">
                  📍 Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="piscina-layout">
        <nav className="piscina-sidebar">
          <button
            className={`piscina-nav-item${tabActiva === "operativa" ? " active" : ""}`}
            onClick={() => setTabActiva("operativa")}
          >
            <IcoPool /><span>Operativa</span>
          </button>
          <button
            className={`piscina-nav-item${tabActiva === "incidencias" ? " active" : ""}`}
            onClick={() => setTabActiva("incidencias")}
          >
            <IcoWarn /><span>Incidencias</span>
          </button>
          <button
            className={`piscina-nav-item${tabActiva === "turno" ? " active" : ""}`}
            onClick={() => setTabActiva("turno")}
          >
            <IcoCal /><span>Mi turno</span>
          </button>
        </nav>

        <main className="piscina-content">
          {tabActiva === "operativa" && (
            <OperativaTab piscina={piscina} mostrarMensaje={mostrarMensaje} />
          )}
          {tabActiva === "incidencias" && (
            <IncidenciasSocTab piscina={piscina} mostrarMensaje={mostrarMensaje} />
          )}
          {tabActiva === "turno" && (
            <MiTurnoTab piscina={piscina} mostrarMensaje={mostrarMensaje} />
          )}
        </main>
      </div>
    </div>
  );
}

export default SocorristaPiscinaDetalle;
