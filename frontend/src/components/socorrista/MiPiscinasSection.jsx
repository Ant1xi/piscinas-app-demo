import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMisPiscinas, getHorarios } from "../../api/piscinaApi";
import { getFileUrl } from "../../config";

// L=1,M=2,X=3,J=4,V=5,S=6,D=0  (getDay() returns 0=Sun)
const DIA_MAP = { 0: "D", 1: "L", 2: "M", 3: "X", 4: "J", 5: "V", 6: "S" };

function obtenerHorarioHoy(horarios) {
  if (!horarios || horarios.length === 0) return null;
  const diaHoy = DIA_MAP[new Date().getDay()];
  const tramosHoy = horarios.filter(h => h.activo && h.diasSemana.includes(diaHoy));
  if (tramosHoy.length === 0) return "Cerrado hoy";
  return tramosHoy
    .sort((a, b) => a.horaApertura.localeCompare(b.horaApertura))
    .map(t => `${t.horaApertura}–${t.horaCierre}`)
    .join(" / ");
}

function MiPiscinasSection() {
  const [piscinas, setPiscinas] = useState([]);
  const [horariosPorId, setHorariosPorId] = useState({});
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { cargarPiscinas(); }, []);

  const cargarPiscinas = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await getMisPiscinas();
      const lista = res.data;
      setPiscinas(lista);

      const ids = lista.map(p => p.id || p.piscinaId).filter(Boolean);
      const resultados = await Promise.all(
        ids.map(id => getHorarios(id).then(r => ({ id, horarios: r.data })).catch(() => ({ id, horarios: [] })))
      );
      const mapa = {};
      resultados.forEach(({ id, horarios }) => { mapa[id] = horarios; });
      setHorariosPorId(mapa);
    } catch {
      setError("No se pudieron cargar tus piscinas asignadas.");
    } finally {
      setCargando(false);
    }
  };

  const obtenerImagenPiscina = (rutaImagen) => {
    if (!rutaImagen) return "/login-backgrounds/piscina1.jpg";
    if (rutaImagen.startsWith("http")) return rutaImagen;
    return getFileUrl(rutaImagen);
  };

  const horarioDisplay = (p) => {
    const id = p.id || p.piscinaId;
    const horarioHoy = obtenerHorarioHoy(horariosPorId[id]);
    if (horarioHoy) return horarioHoy;
    // fallback al horario genérico de la piscina
    if (p.horaApertura && p.horaCierre) return `${p.horaApertura}–${p.horaCierre}`;
    return "--:--";
  };

  return (
    <div className="soc-piscinas">
      <div className="soc-section-title">
        <h2>Mis piscinas</h2>
        <p>Piscinas a las que estás asignado como socorrista.</p>
      </div>

      {cargando && <div className="soc-empty">Cargando piscinas...</div>}
      {error && <div className="soc-error">{error}</div>}
      {!cargando && !error && piscinas.length === 0 && (
        <div className="soc-empty">No tienes piscinas asignadas todavía.</div>
      )}

      <div className="soc-piscinas-grid">
        {piscinas.map((p) => (
          <div
            key={p.id || p.piscinaId}
            className="soc-piscina-card"
            onClick={() => navigate(`/socorrista/piscinas/${p.id || p.piscinaId}`)}
          >
            <div
              className="soc-piscina-img"
              style={{ backgroundImage: `url(${obtenerImagenPiscina(p.rutaImagen)})` }}
            >
              <div className="soc-piscina-overlay"></div>
              <h3>{p.nombre || p.piscinaNombre}</h3>
            </div>
            <div className="soc-piscina-body">
              <span className="soc-piscina-urb">{p.urbanizacionNombre || ""}</span>
              <span className="soc-piscina-horario">{horarioDisplay(p)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiPiscinasSection;
