import { useEffect, useState } from "react";
import { getHorarios, crearHorario, actualizarHorario, eliminarHorario } from "../../api/piscinaApi";

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

const VACIO = { nombre: "", diasSemana: [], horaApertura: "", horaCierre: "" };

function HorariosPiscinaSection({ piscinaId, mostrarMensaje }) {
  const [horarios, setHorarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); }, [piscinaId]);

  const cargar = async () => {
    try {
      const res = await getHorarios(piscinaId);
      setHorarios(res.data);
    } catch {
      mostrarMensaje("error", "No se pudieron cargar los horarios");
    }
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm(VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (h) => {
    setEditando(h);
    setForm({
      nombre: h.nombre,
      diasSemana: h.diasSemana.split(""),
      horaApertura: h.horaApertura,
      horaCierre: h.horaCierre,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => { setModalAbierto(false); setEditando(null); };

  const toggleDia = (dia) => {
    setForm(f => ({
      ...f,
      diasSemana: f.diasSemana.includes(dia)
        ? f.diasSemana.filter(d => d !== dia)
        : [...f.diasSemana, dia],
    }));
  };

  const setDiasAtajo = (str) => setForm(f => ({ ...f, diasSemana: str.split("") }));

  const guardar = async () => {
    if (!form.nombre.trim()) { mostrarMensaje("error", "El nombre es obligatorio"); return; }
    if (form.diasSemana.length === 0) { mostrarMensaje("error", "Selecciona al menos un día"); return; }
    if (!form.horaApertura || !form.horaCierre) { mostrarMensaje("error", "Las horas son obligatorias"); return; }
    setGuardando(true);
    const payload = {
      nombre: form.nombre.trim(),
      diasSemana: DIAS.filter(d => form.diasSemana.includes(d)).join(""),
      horaApertura: form.horaApertura,
      horaCierre: form.horaCierre,
    };
    try {
      if (editando) {
        await actualizarHorario(piscinaId, editando.id, payload);
        mostrarMensaje("success", "Horario actualizado");
      } else {
        await crearHorario(piscinaId, payload);
        mostrarMensaje("success", "Horario creado");
      }
      await cargar();
      cerrarModal();
    } catch (e) {
      mostrarMensaje("error", e.response?.data?.message || "Error al guardar el horario");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tramo horario?")) return;
    try {
      await eliminarHorario(piscinaId, id);
      mostrarMensaje("success", "Horario eliminado");
      await cargar();
    } catch {
      mostrarMensaje("error", "No se pudo eliminar el horario");
    }
  };

  return (
    <div className="horarios-section">
      <div className="horarios-header">
        <h3>Horarios</h3>
        <button className="btn-primary-sm" onClick={abrirCrear}>+ Añadir tramo</button>
      </div>

      {horarios.length === 0 && (
        <div className="horarios-empty">No hay horarios configurados para esta piscina.</div>
      )}

      {horarios.map(h => (
        <div key={h.id} className="horario-card">
          <div className="horario-dias">
            {DIAS.map(dia => (
              <span key={dia} className={`dia-chip${h.diasSemana.includes(dia) ? " activo" : ""}`}>
                {dia}
              </span>
            ))}
          </div>
          <div className="horario-info">
            <strong>{h.nombre}</strong>
            <span>{h.horaApertura} — {h.horaCierre}</span>
          </div>
          <div className="horario-acciones">
            <button className="btn-ghost-sm" onClick={() => abrirEditar(h)}>Editar</button>
            <button className="btn-ghost-sm btn-danger-sm" onClick={() => eliminar(h.id)}>Eliminar</button>
          </div>
        </div>
      ))}

      {modalAbierto && (
        <div className="modal-backdrop" onClick={cerrarModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editando ? "Editar tramo" : "Nuevo tramo horario"}</h2>

            <div className="form-group">
              <label>Nombre del tramo</label>
              <input
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Turno mañana, Horario fin de semana..."
              />
            </div>

            <div className="form-group">
              <label>Días de la semana</label>
              <div className="dias-selector">
                {DIAS.map(dia => (
                  <button
                    key={dia}
                    type="button"
                    className={`dia-btn${form.diasSemana.includes(dia) ? " activo" : ""}`}
                    onClick={() => toggleDia(dia)}
                  >
                    {dia}
                  </button>
                ))}
              </div>
              <div className="dias-atajos">
                <button type="button" onClick={() => setDiasAtajo("LMXJV")}>L–V</button>
                <button type="button" onClick={() => setDiasAtajo("SD")}>Fin de semana</button>
                <button type="button" onClick={() => setDiasAtajo("LMXJVSD")}>Todos</button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hora apertura</label>
                <input
                  type="time"
                  value={form.horaApertura}
                  onChange={e => setForm(f => ({ ...f, horaApertura: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Hora cierre</label>
                <input
                  type="time"
                  value={form.horaCierre}
                  onChange={e => setForm(f => ({ ...f, horaCierre: e.target.value }))}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={cerrarModal} disabled={guardando}>Cancelar</button>
              <button className="modal-confirm" onClick={guardar} disabled={guardando}>
                {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear tramo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HorariosPiscinaSection;
