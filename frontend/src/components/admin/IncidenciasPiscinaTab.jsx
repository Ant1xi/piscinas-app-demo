import { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosConfig";

const CATEGORIAS = [
    { value: "INCIDENCIA",  label: "🚨 Incidencia" },
    { value: "OBSERVACION", label: "👁️ Observación" },
];

const TIPOS = [
    { value: "MATERIAL",        label: "🔧 Material / Instalaciones" },
    { value: "MEDICA",          label: "🏥 Emergencia médica" },
    { value: "CONFLICTO",       label: "⚡ Conflicto entre vecinos" },
    { value: "ACCESO_INDEBIDO", label: "🚫 Acceso indebido" },
    { value: "COMPORTAMIENTO",  label: "⚠️ Comportamiento inadecuado" },
    { value: "INVITADOS",       label: "👥 Problema con invitados" },
    { value: "OTRO",            label: "📝 Otro" },
];

const PRIORIDADES = [
    { value: "ALTA",  label: "🔴 Alta" },
    { value: "MEDIA", label: "🟡 Media" },
    { value: "BAJA",  label: "🔵 Baja" },
];

const PRIORIDAD_BORDER = { ALTA: "#ef4444", MEDIA: "#f59e0b", BAJA: "#3b82f6" };

function formatFechaKanban(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function KanbanBoard({ incidencias, puedeGestionar, onDetalle, onRevision, onCerrar }) {
    const abiertas = incidencias.filter(i => i.estado === "ABIERTA");
    const revision = incidencias.filter(i => i.estado === "EN_REVISION");
    const cerradas = incidencias.filter(i => i.estado === "CERRADA");

    const col = (titulo, items, scheme) => (
        <div className="kanban-col">
            <div className={`kanban-col-header ${scheme}`}>
                <span className="kanban-col-title">{titulo}</span>
                <span className={`kanban-col-badge ${scheme}`}>{items.length}</span>
            </div>
            <div className="kanban-col-body">
                {items.length === 0 ? (
                    <div className="kanban-empty">Sin incidencias</div>
                ) : items.map(i => (
                    <div
                        key={i.id}
                        className="kanban-card"
                        style={{ borderLeftColor: PRIORIDAD_BORDER[i.prioridad] ?? "#94a3b8" }}
                        onClick={() => onDetalle(i)}
                    >
                        <div className="kanban-card-tipo">{i.tipo} · {i.categoria}</div>
                        <p className="kanban-card-desc">{i.descripcion}</p>
                        <div className="kanban-card-meta">
                            <span>{i.piscinaNombre || "Esta piscina"}</span>
                            <span>{formatFechaKanban(i.createdAt)}</span>
                        </div>
                        {puedeGestionar && (
                            <div className="kanban-card-actions" onClick={e => e.stopPropagation()}>
                                {i.estado === "ABIERTA" && (
                                    <button className="kanban-btn-revision" onClick={() => onRevision(i)}>
                                        Poner en revisión
                                    </button>
                                )}
                                {i.estado === "EN_REVISION" && (
                                    <button className="kanban-btn-cerrar" onClick={() => onCerrar(i)}>
                                        Cerrar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="kanban-board">
            {col("ABIERTAS",    abiertas, "col-rojo")}
            {col("EN REVISIÓN", revision, "col-ambar")}
            {col("CERRADAS",    cerradas, "col-verde")}
        </div>
    );
}

// puedeGestionarEstado: true=admin puede revisar/cerrar, false=socorrista solo ve y crea
function IncidenciasPiscinaTab({ piscina, mostrarMensaje, puedeGestionarEstado = true }) {
    const [incidencias, setIncidencias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("TODAS");

    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [incidenciaDetalle, setIncidenciaDetalle] = useState(null);
    const [incidenciaCerrar, setIncidenciaCerrar] = useState(null);

    const [errorModal, setErrorModal] = useState("");
    const [notaCierre, setNotaCierre] = useState("");
    const [guardando, setGuardando] = useState(false);

    const [form, setForm] = useState({
        categoria: "INCIDENCIA",
        tipo: "MATERIAL",
        prioridad: "MEDIA",
        descripcion: ""
    });

    useEffect(() => {
        cargarIncidencias();
    }, [piscina.id]);

    const cargarIncidencias = async () => {
        try {
            const response = await api.get(`/incidencias/piscina/${piscina.id}`);
            setIncidencias(response.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
            mostrarMensaje("error", "Error al cargar incidencias");
        }
    };

    const incidenciasFiltradas = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return incidencias.filter((i) => {
            const coincideTexto =
                i.descripcion?.toLowerCase().includes(texto) ||
                i.tipo?.toLowerCase().includes(texto) ||
                i.categoria?.toLowerCase().includes(texto) ||
                i.prioridad?.toLowerCase().includes(texto) ||
                i.estado?.toLowerCase().includes(texto) ||
                i.creadaPorNombre?.toLowerCase().includes(texto) ||
                i.viviendaIdentificador?.toLowerCase().includes(texto) ||
                i.personaNombre?.toLowerCase().includes(texto);

            const coincideEstado =
                filtroEstado === "TODAS" || i.estado === filtroEstado;

            return coincideTexto && coincideEstado;
        });
    }, [incidencias, busqueda, filtroEstado]);

    const resumen = useMemo(() => {
        return {
            abiertas: incidencias.filter(i => i.estado === "ABIERTA").length,
            revision: incidencias.filter(i => i.estado === "EN_REVISION").length,
            cerradas: incidencias.filter(i => i.estado === "CERRADA").length,
            urgentes: incidencias.filter(i => i.prioridad === "URGENTE" || i.prioridad === "ALTA").length
        };
    }, [incidencias]);

    const crearIncidencia = async () => {
        if (!form.descripcion.trim()) {
            setErrorModal("La descripción es obligatoria.");
            return;
        }

        setGuardando(true);
        try {
            await api.post("/incidencias", {
                piscinaId: piscina.id,
                viviendaId: null,
                personaId: null,
                accesoId: null,
                categoria: form.categoria,
                tipo: form.tipo,
                prioridad: form.prioridad,
                descripcion: form.descripcion.trim()
            });

            setMostrarModalCrear(false);
            setForm({
                categoria: "INCIDENCIA",
                tipo: "MATERIAL",
                prioridad: "MEDIA",
                descripcion: ""
            });

            await cargarIncidencias();
            mostrarMensaje("success", "Incidencia creada correctamente");
        } catch (error) {
            const texto =
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                "Error al crear la incidencia";

            setErrorModal(texto);
        } finally {
            setGuardando(false);
        }
    };

    const ponerEnRevision = async (incidencia) => {
        try {
            await api.patch(`/incidencias/${incidencia.id}/revision`);
            await cargarIncidencias();
            setIncidenciaDetalle(null);
            mostrarMensaje("success", "Incidencia puesta en revisión");
        } catch (error) {
            mostrarMensaje(
                "error",
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                "Error al poner en revisión"
            );
        }
    };

    const abrirCerrarIncidencia = (incidencia) => {
        setIncidenciaDetalle(null);
        setIncidenciaCerrar(incidencia);
        setNotaCierre("");
        setErrorModal("");
    };

    const cerrarIncidencia = async () => {
        if (!notaCierre.trim()) {
            setErrorModal("Debes indicar una nota de cierre.");
            return;
        }

        try {
            await api.patch(`/incidencias/${incidenciaCerrar.id}/cerrar`, {
                notaCierre: notaCierre.trim()
            });

            setIncidenciaCerrar(null);
            setNotaCierre("");
            await cargarIncidencias();
            mostrarMensaje("success", "Incidencia cerrada correctamente");
        } catch (error) {
            const texto =
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                "Error al cerrar la incidencia";

            setErrorModal(texto);
        }
    };

    const claseEstado = (estado) => {
        if (estado === "ABIERTA") return "estado-incidencia abierta";
        if (estado === "EN_REVISION") return "estado-incidencia revision";
        if (estado === "CERRADA") return "estado-incidencia cerrada";
        return "estado-incidencia";
    };

    const clasePrioridad = (prioridad) => {
        if (prioridad === "ALTA") return "prioridad alta";
        if (prioridad === "MEDIA") return "prioridad media";
        return "prioridad baja";
    };

    return (
        <div className="incidencias-wrapper">
            <div className="detalle-section-title">
                <div>
                    <h2>Incidencias</h2>
                    <p>Control de observaciones, problemas y avisos registrados en esta piscina.</p>
                </div>

                <button
                    className="detalle-primary-btn"
                    onClick={() => {
                        setMostrarModalCrear(true);
                        setErrorModal("");
                    }}
                >
                    + Nueva incidencia
                </button>
            </div>

            <div className="incidencias-summary">
                <div>
                    <span>Abiertas</span>
                    <strong>{resumen.abiertas}</strong>
                </div>

                <div>
                    <span>En revisión</span>
                    <strong>{resumen.revision}</strong>
                </div>

                <div>
                    <span>Cerradas</span>
                    <strong>{resumen.cerradas}</strong>
                </div>

                <div className="danger">
                    <span>Alta prioridad</span>
                    <strong>{resumen.urgentes}</strong>
                </div>
            </div>

            <div className="incidencias-toolbar">
                <input
                    placeholder="Buscar incidencia, vivienda, persona, tipo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="TODAS">Todos los estados</option>
                    <option value="ABIERTA">Abiertas</option>
                    <option value="EN_REVISION">En revisión</option>
                    <option value="CERRADA">Cerradas</option>
                </select>
            </div>

            {incidenciasFiltradas.length === 0 ? (
                <div className="detalle-empty">
                    No hay incidencias que coincidan con el filtro.
                </div>
            ) : (
                <KanbanBoard
                    incidencias={incidenciasFiltradas}
                    puedeGestionar={puedeGestionarEstado}
                    onDetalle={setIncidenciaDetalle}
                    onRevision={ponerEnRevision}
                    onCerrar={abrirCerrarIncidencia}
                />
            )}

            {mostrarModalCrear && (
                <div className="modal-backdrop">
                    <div className="modal modal-large">
                        <h2>Nueva incidencia</h2>
                        <p>Registra una observación o problema asociado a esta piscina.</p>

                        <label className="file-label">Categoría</label>
                        <select
                            value={form.categoria}
                            onChange={(e) => {
                                setForm({ ...form, categoria: e.target.value });
                                setErrorModal("");
                            }}
                        >
                            {CATEGORIAS.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>

                        <label className="file-label">Tipo</label>
                        <select
                            value={form.tipo}
                            onChange={(e) => {
                                setForm({ ...form, tipo: e.target.value });
                                setErrorModal("");
                            }}
                        >
                            {TIPOS.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>

                        <label className="file-label">Prioridad</label>
                        <select
                            value={form.prioridad}
                            onChange={(e) => {
                                setForm({ ...form, prioridad: e.target.value });
                                setErrorModal("");
                            }}
                        >
                            {PRIORIDADES.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>

                        <label className="file-label">Descripción</label>
                        <textarea
                            className="modal-textarea"
                            placeholder="Describe la incidencia..."
                            value={form.descripcion}
                            onChange={(e) => {
                                setForm({ ...form, descripcion: e.target.value });
                                setErrorModal("");
                            }}
                        />

                        {errorModal && <div className="form-error">{errorModal}</div>}

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setMostrarModalCrear(false)} disabled={guardando}>
                                Cancelar
                            </button>

                            <button className="modal-save" onClick={crearIncidencia} disabled={guardando}>
                                {guardando ? "Creando..." : "Crear incidencia"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {incidenciaDetalle && (
                <div className="modal-backdrop">
                    <div className="modal modal-large">
                        <h2>Detalle de incidencia</h2>
                        <p>Información completa del registro.</p>

                        <div className="incidencia-detail">
                            <div className="incidencia-top">
                                <span className={claseEstado(incidenciaDetalle.estado)}>
                                    {incidenciaDetalle.estado}
                                </span>

                                <span className={clasePrioridad(incidenciaDetalle.prioridad)}>
                                    {incidenciaDetalle.prioridad}
                                </span>
                            </div>

                            <h3>{incidenciaDetalle.tipo} · {incidenciaDetalle.categoria}</h3>

                            <p>{incidenciaDetalle.descripcion}</p>

                            <div className="detail-grid">
                                <div>
                                    <span>Piscina</span>
                                    <strong>{incidenciaDetalle.piscinaNombre || piscina.nombre}</strong>
                                </div>

                                <div>
                                    <span>Creada por</span>
                                    <strong>{incidenciaDetalle.creadaPorNombreCompleto || "No indicado"}</strong>
                                </div>

                                <div>
                                    <span>Fecha creación</span>
                                    <strong>{incidenciaDetalle.createdAt || "No indicada"}</strong>
                                </div>

                                <div>
                                    <span>Vivienda</span>
                                    <strong>{incidenciaDetalle.viviendaIdentificador || "No asociada"}</strong>
                                </div>

                                <div>
                                    <span>Persona</span>
                                    <strong>{incidenciaDetalle.personaNombreCompleto || "No asociada"}</strong>
                                </div>

                                <div>
                                    <span>Cerrada por</span>
                                    <strong>{incidenciaDetalle.cerradaPorNombreCompleto || "No cerrada"}</strong>
                                </div>

                                <div>
                                    <span>Fecha cierre</span>
                                    <strong>{incidenciaDetalle.cerradaAt || "No cerrada"}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setIncidenciaDetalle(null)}>
                                Cerrar
                            </button>

                            {puedeGestionarEstado && incidenciaDetalle.estado === "ABIERTA" && (
                                <button className="modal-save" onClick={() => ponerEnRevision(incidenciaDetalle)}>
                                    Poner en revisión
                                </button>
                            )}

                            {puedeGestionarEstado && incidenciaDetalle.estado !== "CERRADA" && (
                                <button className="modal-danger" onClick={() => abrirCerrarIncidencia(incidenciaDetalle)}>
                                    Cerrar incidencia
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {incidenciaCerrar && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>Cerrar incidencia</h2>
                        <p>Indica una nota de cierre para dejar constancia.</p>

                        <textarea
                            className="modal-textarea"
                            placeholder="Ej: revisada y solucionada por el administrador..."
                            value={notaCierre}
                            onChange={(e) => {
                                setNotaCierre(e.target.value);
                                setErrorModal("");
                            }}
                        />

                        {errorModal && <div className="form-error">{errorModal}</div>}

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setIncidenciaCerrar(null)}>
                                Cancelar
                            </button>

                            <button className="modal-danger" onClick={cerrarIncidencia}>
                                Confirmar cierre
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IncidenciasPiscinaTab;