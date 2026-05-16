import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./AdminDashboard.css";

import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardHeader from "../../components/admin/DashboardHeader";
import AppMessage from "../../components/admin/AppMessage";
import PiscinasSection from "../../components/admin/PiscinasSection";
import UrbanizacionesSection from "../../components/admin/UrbanizacionesSection";
import UrbanizacionModal from "../../components/admin/UrbanizacionModal";
import PiscinaModal from "../../components/admin/PiscinaModal";
import SocorristasGlobalSection from "../../components/admin/SocorristasGlobalSection";
import IncidenciasGlobalSection from "../../components/admin/IncidenciasGlobalSection";
import AuditoriaSection from "../../components/admin/AuditoriaSection";
import PerfilSection from "../../components/admin/PerfilSection";

function AdminDashboard() {
  const [seccionActiva, setSeccionActiva] = useState("piscinas");
  const [mensaje, setMensaje] = useState(null);

  const [piscinas, setPiscinas] = useState([]);
  const [urbanizaciones, setUrbanizaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [incidencias, setIncidencias] = useState([]);

  const [busquedaPiscina, setBusquedaPiscina] = useState("");
  const [busquedaUrbanizacion, setBusquedaUrbanizacion] = useState("");

  const [mostrarModalUrbanizacion, setMostrarModalUrbanizacion] = useState(false);
  const [mostrarModalPiscina, setMostrarModalPiscina] = useState(false);

  useEffect(() => {
    cargarPiscinas();
    cargarUrbanizaciones();
    cargarUsuarios();
    cargarIncidencias();
  }, []);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3500);
  };

  const cargarPiscinas = async () => {
    try {
      const res = await api.get("/piscinas");
      setPiscinas(res.data);
    } catch {
      mostrarMensaje("error", "Error al cargar piscinas");
    }
  };

  const cargarUrbanizaciones = async () => {
    try {
      const res = await api.get("/urbanizaciones");
      setUrbanizaciones(res.data);
    } catch {
      mostrarMensaje("error", "Error al cargar urbanizaciones");
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch {
      mostrarMensaje("error", "Error al cargar usuarios");
    }
  };

  const cargarIncidencias = async () => {
    try {
      const res = await api.get("/incidencias");
      setIncidencias(res.data);
    } catch {
      mostrarMensaje("error", "Error al cargar incidencias");
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-container">
      {mensaje && <AppMessage tipo={mensaje.tipo} texto={mensaje.texto} />}

      <AdminSidebar
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        cerrarSesion={cerrarSesion}
      />

      <main className="main">
        {seccionActiva === "piscinas" && (
          <>
            <DashboardHeader
              titulo="Piscinas"
              busqueda={busquedaPiscina}
              setBusqueda={setBusquedaPiscina}
              placeholder="Buscar piscina..."
              botonSecundarioTexto="Gestionar urbanizaciones"
              onBotonSecundario={() => setSeccionActiva("urbanizaciones")}
              botonPrincipalTexto="+ Nueva piscina"
              onBotonPrincipal={() => setMostrarModalPiscina(true)}
            />
            <PiscinasSection piscinas={piscinas} busqueda={busquedaPiscina} />
          </>
        )}

        {seccionActiva === "urbanizaciones" && (
          <>
            <DashboardHeader
              titulo="Urbanizaciones"
              busqueda={busquedaUrbanizacion}
              setBusqueda={setBusquedaUrbanizacion}
              placeholder="Buscar urbanización..."
              botonPrincipalTexto="+ Nueva urbanización"
              onBotonPrincipal={() => setMostrarModalUrbanizacion(true)}
            />
            <UrbanizacionesSection
              urbanizaciones={urbanizaciones}
              busqueda={busquedaUrbanizacion}
              recargarUrbanizaciones={cargarUrbanizaciones}
              mostrarMensaje={mostrarMensaje}
            />
          </>
        )}

        {seccionActiva === "socorristas" && (
          <>
            <DashboardHeader
              titulo="Socorristas"
              busqueda=""
              setBusqueda={() => {}}
              placeholder="Buscar socorrista..."
            />
            <SocorristasGlobalSection
              usuarios={usuarios}
              recargarUsuarios={cargarUsuarios}
              mostrarMensaje={mostrarMensaje}
            />
          </>
        )}

        {seccionActiva === "incidencias" && (
          <>
            <DashboardHeader
              titulo="Incidencias"
              busqueda=""
              setBusqueda={() => {}}
              placeholder="Buscar incidencia..."
            />
            <IncidenciasGlobalSection incidencias={incidencias} />
          </>
        )}

        {seccionActiva === "auditoria" && (
          <>
            <DashboardHeader
              titulo="Auditoría"
              busqueda=""
              setBusqueda={() => {}}
              placeholder="Buscar log..."
            />
            <AuditoriaSection />
          </>
        )}

        {seccionActiva === "perfil" && (
          <>
            <DashboardHeader titulo="Mi perfil" sinBusqueda />
            <PerfilSection mostrarMensaje={mostrarMensaje} />
          </>
        )}
      </main>

      {mostrarModalUrbanizacion && (
        <UrbanizacionModal
          cerrar={() => setMostrarModalUrbanizacion(false)}
          recargarUrbanizaciones={cargarUrbanizaciones}
          mostrarMensaje={mostrarMensaje}
        />
      )}

      {mostrarModalPiscina && (
        <PiscinaModal
          cerrar={() => setMostrarModalPiscina(false)}
          urbanizaciones={urbanizaciones}
          recargarPiscinas={cargarPiscinas}
          mostrarMensaje={mostrarMensaje}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
