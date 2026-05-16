import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { getFileUrl } from "../../config";

const DIAS_ORDEN = ["L", "M", "X", "J", "V", "S", "D"];

function EditarPiscinaModal({ piscina, cerrar, recargarPiscina, mostrarMensaje }) {
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    const [form, setForm] = useState({
        urbanizacionId: piscina.urbanizacionId,
        nombre: piscina.nombre || "",
        descripcion: piscina.descripcion || "",
        maxInvitadosPorVivienda: piscina.maxInvitadosPorVivienda ?? 0,
        activa: piscina.activa
    });

    const [imagenNueva, setImagenNueva] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);

    const [tramos, setTramos] = useState([]);
    const [tramosOriginales, setTramosOriginales] = useState([]);

    useEffect(() => {
        return () => { if (imagenPreview) URL.revokeObjectURL(imagenPreview); };
    }, [imagenPreview]);

    useEffect(() => {
        if (piscina?.id) {
            api.get(`/piscinas/${piscina.id}/horarios`)
                .then(r => {
                    const datos = r.data || [];
                    setTramos(datos.map(h => ({ ...h, diasSemana: h.diasSemana || "" })));
                    setTramosOriginales(datos);
                })
                .catch(() => { setTramos([]); setTramosOriginales([]); });
        }
    }, [piscina]);

    const formularioValido =
        form.nombre.trim() &&
        form.descripcion.trim() &&
        form.maxInvitadosPorVivienda !== "" &&
        Number(form.maxInvitadosPorVivienda) >= 0;

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

    const obtenerImagen = (ruta) => {
        if (!ruta) return "/login-backgrounds/piscina1.jpg";
        if (ruta.startsWith("http")) return ruta;
        return getFileUrl(ruta);
    };

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (imagenPreview) URL.revokeObjectURL(imagenPreview);
        setImagenNueva(file);
        setImagenPreview(URL.createObjectURL(file));
        setError("");
    };

    const guardarCambios = async () => {
        if (!formularioValido) {
            setError("Debes rellenar todos los campos correctamente.");
            return;
        }
        setGuardando(true);
        try {
            await api.put(`/piscinas/${piscina.id}`, {
                urbanizacionId: Number(form.urbanizacionId),
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                horaApertura: piscina.horaApertura || null,
                horaCierre: piscina.horaCierre || null,
                maxInvitadosPorVivienda: Number(form.maxInvitadosPorVivienda),
                rutaImagen: piscina.rutaImagen,
                activa: form.activa
            });

            const idsOriginales = tramosOriginales.map(t => t.id);
            const idsActuales = tramos.filter(t => t.id).map(t => t.id);
            const eliminados = idsOriginales.filter(id => !idsActuales.includes(id));

            await Promise.all([
                ...eliminados.map(id => api.delete(`/piscinas/${piscina.id}/horarios/${id}`)),
                ...tramos
                    .filter(t => t.horaApertura && t.horaCierre && t.diasSemana)
                    .map(t => t.id
                        ? api.put(`/piscinas/${piscina.id}/horarios/${t.id}`, {
                            nombre: t.nombre || "Horario principal",
                            diasSemana: t.diasSemana,
                            horaApertura: t.horaApertura,
                            horaCierre: t.horaCierre,
                            activo: t.activo ?? true
                        })
                        : api.post(`/piscinas/${piscina.id}/horarios`, {
                            nombre: t.nombre || "Horario principal",
                            diasSemana: t.diasSemana,
                            horaApertura: t.horaApertura,
                            horaCierre: t.horaCierre,
                            activo: true
                        })
                    )
            ]);

            if (imagenNueva) {
                const fd = new FormData();
                fd.append("file", imagenNueva);
                await api.post(`/piscinas/${piscina.id}/imagen`, fd, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            await recargarPiscina();
            cerrar();
            mostrarMensaje("success", "Piscina actualizada correctamente");
        } catch (err) {
            const texto = err.response?.data?.message || err.response?.data?.mensaje || "Error al actualizar la piscina";
            setError(texto);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal modal-large">
                <h2>Editar piscina</h2>
                <p>Modifica los datos principales de la piscina.</p>

                <div>
                    <label className="file-label">Imagen de la piscina</label>
                    <div className="modal-img-picker">
                        <img
                            className="modal-img-preview"
                            src={imagenPreview || obtenerImagen(piscina.rutaImagen)}
                            alt="Imagen de la piscina"
                        />
                        <label className="btn-cambiar-img" htmlFor="input-img-piscina-editar">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 1v10M4 5l4-4 4 4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {imagenNueva ? imagenNueva.name : "Cambiar imagen"}
                        </label>
                        <input
                            id="input-img-piscina-editar"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImagenChange}
                        />
                    </div>
                </div>

                <label className="file-label">Nombre</label>
                <input
                    value={form.nombre}
                    onChange={(e) => { setForm({ ...form, nombre: e.target.value }); setError(""); }}
                />

                <label className="file-label">Descripción</label>
                <input
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
                        <div key={tramo.id ?? `new-${idx}`} className="tramo-editor">
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

                {error && <div className="form-error">{error}</div>}

                <div className="modal-actions">
                    <button className="modal-cancel" onClick={cerrar} disabled={guardando}>Cancelar</button>
                    <button className="modal-save" onClick={guardarCambios} disabled={!formularioValido || guardando}>
                        {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditarPiscinaModal;
