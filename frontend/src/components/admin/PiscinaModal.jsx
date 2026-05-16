import { useState } from "react";
import api from "../../api/axiosConfig";

const DIAS_ORDEN = ["L", "M", "X", "J", "V", "S", "D"];

function PiscinaModal({ cerrar, urbanizaciones, recargarPiscinas, mostrarMensaje }) {
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    const [form, setForm] = useState({
        urbanizacionId: "",
        nombre: "",
        descripcion: "",
        maxInvitadosPorVivienda: 0,
        activa: true
    });

    const [imagen, setImagen] = useState(null);

    const [tramos, setTramos] = useState([
        { nombre: "Horario principal", diasSemana: "LMXJVSD", horaApertura: "", horaCierre: "" }
    ]);

    const formularioValido =
        form.urbanizacionId &&
        form.nombre.trim() &&
        form.descripcion.trim() &&
        form.maxInvitadosPorVivienda !== "" &&
        Number(form.maxInvitadosPorVivienda) >= 0 &&
        imagen;

    const añadirTramo = () => {
        setTramos([...tramos, { nombre: "", diasSemana: "LMXJVSD", horaApertura: "", horaCierre: "" }]);
    };

    const eliminarTramo = (idx) => {
        setTramos(tramos.filter((_, i) => i !== idx));
    };

    const actualizarTramo = (idx, campo, valor) => {
        setTramos(tramos.map((t, i) => i === idx ? { ...t, [campo]: valor } : t));
    };

    const toggleDia = (idx, dia) => {
        setTramos(tramos.map((t, i) => {
            if (i !== idx) return t;
            const tiene = t.diasSemana.includes(dia);
            const nuevo = tiene ? t.diasSemana.replace(dia, "") : t.diasSemana + dia;
            const ordenado = DIAS_ORDEN.filter(d => nuevo.includes(d)).join("");
            return { ...t, diasSemana: ordenado };
        }));
    };

    const setDiasTramo = (idx, dias) => {
        setTramos(tramos.map((t, i) => i === idx ? { ...t, diasSemana: dias } : t));
    };

    const crearPiscina = async () => {
        if (!formularioValido) {
            setError("Debes rellenar todos los campos y seleccionar una imagen.");
            return;
        }
        setGuardando(true);
        try {
            const res = await api.post("/piscinas", {
                urbanizacionId: Number(form.urbanizacionId),
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                maxInvitadosPorVivienda: Number(form.maxInvitadosPorVivienda),
                rutaImagen: null,
                activa: form.activa
            });
            const piscinaId = res.data.id;

            if (imagen) {
                const fd = new FormData();
                fd.append("file", imagen);
                await api.post(`/piscinas/${piscinaId}/imagen`, fd, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            const tramosValidos = tramos.filter(t => t.horaApertura && t.horaCierre && t.diasSemana);
            await Promise.all(
                tramosValidos.map(t => api.post(`/piscinas/${piscinaId}/horarios`, {
                    nombre: t.nombre || "Horario principal",
                    diasSemana: t.diasSemana,
                    horaApertura: t.horaApertura,
                    horaCierre: t.horaCierre,
                    activo: true
                }))
            );

            await recargarPiscinas();
            cerrar();
            mostrarMensaje("success", "Piscina creada correctamente");
        } catch (err) {
            const texto = err.response?.data?.message || err.response?.data?.mensaje || "Error al crear la piscina";
            setError(texto);
            mostrarMensaje("error", texto);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal modal-large">
                <h2>Nueva piscina</h2>
                <p>Asigna la piscina a una urbanización existente.</p>

                {urbanizaciones.length === 0 ? (
                    <div className="warning-box">
                        Antes de crear una piscina debes crear al menos una urbanización.
                    </div>
                ) : (
                    <>
                        <select
                            value={form.urbanizacionId}
                            onChange={(e) => { setForm({ ...form, urbanizacionId: e.target.value }); setError(""); }}
                        >
                            <option value="">Selecciona urbanización</option>
                            {urbanizaciones.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.nombre} {u.municipioNombre ? `· ${u.municipioNombre}` : ""}
                                </option>
                            ))}
                        </select>

                        <input
                            placeholder="Nombre de la piscina"
                            value={form.nombre}
                            onChange={(e) => { setForm({ ...form, nombre: e.target.value }); setError(""); }}
                        />

                        <input
                            placeholder="Descripción"
                            value={form.descripcion}
                            onChange={(e) => { setForm({ ...form, descripcion: e.target.value }); setError(""); }}
                        />

                        <label className="file-label">Máximo de invitados por vivienda</label>
                        <input
                            type="number"
                            min="0"
                            value={form.maxInvitadosPorVivienda}
                            onChange={(e) => { setForm({ ...form, maxInvitadosPorVivienda: e.target.value }); setError(""); }}
                        />

                        <label className="file-label">Imagen de la piscina</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => { setImagen(e.target.files[0]); setError(""); }}
                        />

                        <div className="modal-section">
                            <div className="modal-section-header">
                                <span>Horarios semanales</span>
                                <button type="button" onClick={añadirTramo} className="btn-añadir-tramo">
                                    + Añadir tramo
                                </button>
                            </div>

                            {tramos.length === 0 && (
                                <div className="tramos-empty">
                                    Sin horario configurado. Añade al menos un tramo.
                                </div>
                            )}

                            {tramos.map((tramo, idx) => (
                                <div key={idx} className="tramo-editor">
                                    <div className="tramo-row">
                                        <input
                                            placeholder="Nombre del tramo (ej: Turno mañana)"
                                            value={tramo.nombre}
                                            onChange={e => actualizarTramo(idx, "nombre", e.target.value)}
                                        />
                                        <button type="button" onClick={() => eliminarTramo(idx)} className="btn-tramo-eliminar">✕</button>
                                    </div>

                                    <div className="tramo-dias">
                                        <div className="dias-chips">
                                            {DIAS_ORDEN.map(dia => (
                                                <button
                                                    key={dia}
                                                    type="button"
                                                    className={`dia-chip-btn${tramo.diasSemana.includes(dia) ? " activo" : ""}`}
                                                    onClick={() => toggleDia(idx, dia)}
                                                >
                                                    {dia}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="dias-atajos">
                                            <button type="button" onClick={() => setDiasTramo(idx, "LMXJV")}>Lun–Vie</button>
                                            <button type="button" onClick={() => setDiasTramo(idx, "SD")}>Fin de semana</button>
                                            <button type="button" onClick={() => setDiasTramo(idx, "LMXJVSD")}>Todos</button>
                                        </div>
                                    </div>

                                    <div className="tramo-horas">
                                        <div className="tramo-hora-group">
                                            <label>Apertura</label>
                                            <input
                                                type="time"
                                                value={tramo.horaApertura}
                                                onChange={e => actualizarTramo(idx, "horaApertura", e.target.value)}
                                            />
                                        </div>
                                        <span className="tramo-guion">—</span>
                                        <div className="tramo-hora-group">
                                            <label>Cierre</label>
                                            <input
                                                type="time"
                                                value={tramo.horaCierre}
                                                onChange={e => actualizarTramo(idx, "horaCierre", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {error && <div className="form-error">{error}</div>}

                <div className="modal-actions">
                    <button className="modal-cancel" onClick={cerrar} disabled={guardando}>Cancelar</button>
                    {urbanizaciones.length > 0 && (
                        <button className="modal-save" onClick={crearPiscina} disabled={!formularioValido || guardando}>
                            {guardando ? "Guardando..." : "Guardar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PiscinaModal;
