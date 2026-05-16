// Tab "Mi turno" del detalle de piscina.
// Muestra el turno del socorrista para hoy en esta piscina
// y el calendario de turnos completo en modo solo lectura.
import { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import CalendarioTurnosTab from "../../admin/CalendarioTurnosTab";

function calcularHoras(horaInicio, horaFin) {
  if (!horaInicio || !horaFin) return 0;
  const [h1, m1] = horaInicio.split(":").map(Number);
  const [h2, m2] = horaFin.split(":").map(Number);
  return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
}

function MiTurnoTab({ piscina, mostrarMensaje }) {
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [cargando, setCargando] = useState(false);
  const usuarioId = localStorage.getItem("usuarioId");

  useEffect(() => {
    if (piscina) cargarTurnoHoy();
  }, [piscina]);

  const cargarTurnoHoy = async () => {
    setCargando(true);
    try {
      const hoy = new Date().toISOString().split("T")[0];
      const res = await api.get(`/turnos/piscina/${piscina.id}?desde=${hoy}&hasta=${hoy}`);
      const misTurnos = res.data.filter(
        (t) => String(t.socorristaId) === String(usuarioId) || String(t.usuarioId) === String(usuarioId)
      );
      setTurnosHoy(misTurnos);
    } catch {
      setTurnosHoy([]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <div className="soc-turno-seccion">
        <h2>Mi turno hoy</h2>
        <p>
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {cargando ? (
          <div className="soc-empty">Cargando turno...</div>
        ) : turnosHoy.length === 0 ? (
          <div className="soc-turno-vacio">
            <div className="soc-turno-vacio-icon">📅</div>
            <h3>No tienes turno asignado hoy</h3>
            <p>en esta piscina.</p>
          </div>
        ) : (
          turnosHoy.map((t) => {
            const horas = calcularHoras(t.horaInicio, t.horaFin);
            return (
              <div key={t.id} className="soc-turno-card">
                <div className="soc-turno-horario">
                  <span>{t.horaInicio}</span>
                  <div className="soc-turno-linea" />
                  <span>{t.horaFin}</span>
                </div>
                <div className="soc-turno-datos">
                  <strong>{piscina.nombre}</strong>
                  <span>{horas.toFixed(1)} horas de turno</span>
                  <span className="soc-turno-estado">{t.estado || "PROGRAMADO"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="soc-turno-seccion">
        <h2>Turnos de la piscina</h2>
        <p>Vista de solo lectura — navega por el mes para ver todos los turnos asignados.</p>
        <CalendarioTurnosTab
          piscina={piscina}
          mostrarMensaje={mostrarMensaje}
          soloLectura={true}
        />
      </div>
    </>
  );
}

export default MiTurnoTab;
