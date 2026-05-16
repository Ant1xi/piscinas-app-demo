import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { getFileUrl } from "../../config";
import { getHorarios } from "../../api/piscinaApi";
import "./AdminPiscinaDetalle.css";

import SocorristasPiscinaTab from "../../components/admin/SocorristasPiscinaTab";
import CalendarioTurnosTab from "../../components/admin/CalendarioTurnosTab";
import EditarPiscinaModal from "../../components/admin/EditarPiscinaModal";
import IncidenciasPiscinaTab from "../../components/admin/IncidenciasPiscinaTab";
import OperativaTab from "../../components/admin/OperativaTab";
import AppMessage from "../../components/admin/AppMessage";
import HorariosPiscinaSection from "../../components/admin/HorariosPiscinaSection";

const IcoPool = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12c2-4 4-6 6-6s4 4 6 4 4-4 6-4"/>
    <path d="M2 18c2-4 4-6 6-6s4 4 6 4 4-4 6-4"/>
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

const IcoWarn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IcoPeople = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const IcoInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function AdminPiscinaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [piscina, setPiscina] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [tabActiva, setTabActiva] = useState("operativa");
  const [mensaje, setMensaje] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [incidenciasAbiertas, setIncidenciasAbiertas] = useState(0);

  useEffect(() => { cargarPiscina(); }, [id]);
  useEffect(() => { cargarContadorIncidencias(); }, [id]);
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
    } catch (error) {
      mostrarMensaje("error", "Error al cargar la piscina");
      console.error(error.response?.data || error.message);
    }
  };

  const cargarContadorIncidencias = async () => {
    try {
      const res = await api.get(`/incidencias/piscina/${id}`);
      setIncidenciasAbiertas(res.data.filter(i => i.estado === "ABIERTA").length);
    } catch { /* silently fail */ }
  };

  const obtenerImagenPiscina = (rutaImagen) => {
    if (!rutaImagen) return "/login-backgrounds/piscina1.jpg";
    if (rutaImagen.startsWith("http")) return rutaImagen;
    return getFileUrl(rutaImagen);
  };

  const desactivarPiscina = async () => {
    if (!window.confirm(`¿Seguro que quieres desactivar "${piscina.nombre}"?`)) return;
    try {
      await api.put(`/piscinas/${id}`, { ...piscina, activa: false });
      await cargarPiscina();
      mostrarMensaje("success", "Piscina desactivada correctamente");
    } catch (error) {
      mostrarMensaje("error", error.response?.data?.message || error.response?.data?.mensaje || "No se pudo desactivar la piscina");
    }
  };

  const activarPiscina = async () => {
    try {
      await api.put(`/piscinas/${id}`, { ...piscina, activa: true });
      await cargarPiscina();
      mostrarMensaje("success", "Piscina activada correctamente");
    } catch (error) {
      mostrarMensaje("error", error.response?.data?.message || "No se pudo activar la piscina");
    }
  };

  const eliminarPiscina = async () => {
    const texto = prompt(`Para eliminar esta piscina escribe exactamente: ELIMINAR ${piscina.nombre}`);
    if (texto === null) return;
    if (texto.trim() !== `ELIMINAR ${piscina.nombre}`) {
      mostrarMensaje("error", "Eliminación cancelada. El texto no coincide.");
      return;
    }
    try {
      await api.delete(`/piscinas/${id}`);
      mostrarMensaje("success", "Piscina eliminada correctamente");
      setTimeout(() => navigate("/admin"), 900);
    } catch (error) {
      mostrarMensaje("error", error.response?.data?.message || error.response?.data?.mensaje || "No se pudo eliminar la piscina");
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

  if (!piscina) return <div className="detalle-loading">Cargando piscina...</div>;

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
            <button className="piscina-back-btn" onClick={() => navigate("/admin")}>← Volver</button>
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
          <div className="piscina-header-actions">
            <button className="phdr-btn" onClick={() => setMostrarModalEditar(true)}>Editar</button>
            {piscina.activa ? (
              <button className="phdr-btn phdr-btn-amber" onClick={desactivarPiscina}>Desactivar</button>
            ) : (
              <button className="phdr-btn phdr-btn-green" onClick={activarPiscina}>Activar</button>
            )}
            <button className="phdr-btn phdr-btn-red" onClick={eliminarPiscina}>Eliminar</button>
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
            className={`piscina-nav-item${tabActiva === "calendario" ? " active" : ""}`}
            onClick={() => setTabActiva("calendario")}
          >
            <IcoCal /><span>Calendario</span>
          </button>
          <button
            className={`piscina-nav-item${tabActiva === "incidencias" ? " active" : ""}`}
            onClick={() => setTabActiva("incidencias")}
          >
            <IcoWarn /><span>Incidencias</span>
            {incidenciasAbiertas > 0 && <em className="piscina-nav-badge">{incidenciasAbiertas}</em>}
          </button>
          <button
            className={`piscina-nav-item${tabActiva === "socorristas" ? " active" : ""}`}
            onClick={() => setTabActiva("socorristas")}
          >
            <IcoPeople /><span>Socorristas</span>
          </button>
          <button
            className={`piscina-nav-item${tabActiva === "datos" ? " active" : ""}`}
            onClick={() => setTabActiva("datos")}
          >
            <IcoInfo /><span>Datos</span>
          </button>
        </nav>

        <main className="piscina-content">
          {tabActiva === "operativa" && (
            <OperativaTab piscina={piscina} mostrarMensaje={mostrarMensaje} />
          )}

          {tabActiva === "calendario" && (
            <CalendarioTurnosTab piscina={piscina} mostrarMensaje={mostrarMensaje} />
          )}

          {tabActiva === "incidencias" && (
            <IncidenciasPiscinaTab
              piscina={piscina}
              mostrarMensaje={mostrarMensaje}
              puedeGestionarEstado={true}
            />
          )}

          {tabActiva === "socorristas" && (
            <SocorristasPiscinaTab piscinaId={piscina.id} mostrarMensaje={mostrarMensaje} />
          )}

          {tabActiva === "datos" && (
            <>
              <div className="detalle-section-title">
                <div>
                  <h2>Datos de piscina</h2>
                  <p>Información principal registrada en el sistema.</p>
                </div>
                <span className={piscina.activa ? "estado-pill activa" : "estado-pill inactiva"}>
                  {piscina.activa ? "Activa" : "Inactiva"}
                </span>
              </div>

              <div className="readonly-form">
                <div className="form-group">
                  <label>Nombre</label>
                  <input value={piscina.nombre || ""} readOnly />
                </div>
                <div className="form-group">
                  <label>Urbanización</label>
                  <input value={piscina.urbanizacionNombre || ""} readOnly />
                </div>
                <div className="form-group">
                  <label>Municipio</label>
                  <input value={piscina.municipioNombre || ""} readOnly />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hora apertura</label>
                    <input value={piscina.horaApertura || ""} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Hora cierre</label>
                    <input value={piscina.horaCierre || ""} readOnly />
                  </div>
                </div>
                <div className="form-group">
                  <label>Máximo de invitados por vivienda</label>
                  <input value={piscina.maxInvitadosPorVivienda ?? 0} readOnly />
                </div>
                <div className="form-group">
                  <label>Tipo de estructura</label>
                  <input value={piscina.tipoUrbanizacion || "No indicado"} readOnly />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea value={piscina.descripcion || ""} readOnly />
                </div>
                {piscina.googleMapsUrl && (
                  <a href={piscina.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="maps-link">
                    📍 Ver ubicación en Google Maps
                  </a>
                )}
              </div>

              <HorariosPiscinaSection piscinaId={piscina.id} mostrarMensaje={mostrarMensaje} />
            </>
          )}
        </main>
      </div>

      {mostrarModalEditar && (
        <EditarPiscinaModal
          piscina={piscina}
          cerrar={() => setMostrarModalEditar(false)}
          recargarPiscina={cargarPiscina}
          mostrarMensaje={mostrarMensaje}
        />
      )}
    </div>
  );
}

export default AdminPiscinaDetalle;
