import { useEffect, useRef, useState, useMemo } from "react";
import api from "../../../api/axiosConfig";
import AvatarUsuario from "../../ui/AvatarUsuario";

const ROL_LABELS = { PROPIETARIO: "Propietario", HABITANTE: "Habitante" };
const ROL_COLORS = {
    PROPIETARIO: { background: "#dbeafe", color: "#1d4ed8" },
    HABITANTE:   { background: "#dcfce7", color: "#15803d" },
};

function GestionVecinos({ viviendaId, viviendaLabel, mostrarMensaje }) {
    const [vecinos, setVecinos] = useState([]);
    const [loadingVecinos, setLoadingVecinos] = useState(true);

    const [tabAnadir, setTabAnadir] = useState("buscar");
    const [personas, setPersonas] = useState([]);
    const [loadingPersonas, setLoadingPersonas] = useState(false);

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
    const [rolAsignar, setRolAsignar] = useState("HABITANTE");
    const [principalAsignar, setPrincipalAsignar] = useState(false);

    const [formNueva, setFormNueva] = useState({ nombre: "", apellidos: "", dni: "", telefono: "", email: "" });
    const [rolNueva, setRolNueva] = useState("HABITANTE");
    const [principalNueva, setPrincipalNueva] = useState(false);
    const [fotoNueva, setFotoNueva] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [errorFoto, setErrorFoto] = useState("");
    const fotoInputRef = useRef(null);

    const [warning, setWarning] = useState(null);
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    useEffect(() => { cargarVecinos(); }, [viviendaId]);

    const cargarVecinos = async () => {
        setLoadingVecinos(true);
        try {
            const res = await api.get(`/vivienda-personas/vivienda/${viviendaId}`);
            setVecinos(res.data);
        } catch {
            mostrarMensaje("error", "Error al cargar vecinos");
        } finally {
            setLoadingVecinos(false);
        }
    };

    const cargarPersonas = async () => {
        if (personas.length > 0) return;
        setLoadingPersonas(true);
        try {
            const res = await api.get("/personas");
            setPersonas(res.data);
        } catch {
            mostrarMensaje("error", "Error al cargar personas");
        } finally {
            setLoadingPersonas(false);
        }
    };

    const handleFotoChange = (file) => {
        if (!file) return;
        const FORMATOS_VALIDOS = ["image/jpeg", "image/png", "image/webp"];
        if (!FORMATOS_VALIDOS.includes(file.type)) {
            setErrorFoto(`Formato no válido: ${file.type || "desconocido"}. Solo se aceptan JPG, PNG o WebP.`);
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(1);
            setErrorFoto(`La imagen pesa ${sizeMB}MB. El máximo permitido es 5MB.`);
            return;
        }
        setErrorFoto("");
        setFotoNueva(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    const abrirTabBuscar = () => {
        setTabAnadir("buscar");
        setPersonaSeleccionada(null);
        setTextoBusqueda("");
        setPrincipalAsignar(false);
        setWarning(null);
        setError("");
        setErrorFoto("");
        cargarPersonas();
    };

    const abrirTabCrear = () => {
        setTabAnadir("crear");
        setFormNueva({ nombre: "", apellidos: "", dni: "", telefono: "", email: "" });
        setRolNueva("HABITANTE");
        setPrincipalNueva(false);
        setFotoNueva(null);
        setFotoPreview(null);
        setWarning(null);
        setError("");
        setErrorFoto("");
    };

    const personasFiltradas = useMemo(() => {
        const texto = textoBusqueda.trim().toLowerCase();
        if (!texto) return personas;
        return personas.filter((p) =>
            p.nombre?.toLowerCase().includes(texto) ||
            p.apellidos?.toLowerCase().includes(texto) ||
            p.dni?.toLowerCase().includes(texto)
        );
    }, [personas, textoBusqueda]);

    const principalActual = vecinos.find(v => v.principal);

    const asignar = async (personaId, rol) => {
        setGuardando(true);
        setWarning(null);
        setError("");
        try {
            const res = await api.post("/vivienda-personas/asignar", {
                personaId,
                viviendaId,
                rolEnVivienda: rol,
                principal: principalAsignar,
            });
            await cargarVecinos();
            setPersonaSeleccionada(null);
            setTextoBusqueda("");
            setPrincipalAsignar(false);
            if (res.data.warning) {
                setWarning(res.data.warning);
            } else {
                mostrarMensaje("success", "Vecino asignado correctamente");
            }
        } catch (e) {
            setError(e.response?.data?.message || "Error al asignar vecino");
        } finally {
            setGuardando(false);
        }
    };

    const crearYAsignar = async () => {
        if (!formNueva.nombre.trim() || !formNueva.apellidos.trim()) {
            setError("El nombre y los apellidos son obligatorios.");
            return;
        }
        setGuardando(true);
        setWarning(null);
        setError("");
        try {
            const personaRes = await api.post("/personas", {
                nombre: formNueva.nombre.trim(),
                apellidos: formNueva.apellidos.trim(),
                dni: formNueva.dni.trim() || null,
                telefono: formNueva.telefono.trim() || null,
                email: formNueva.email.trim() || null,
            });
            const nuevaPersonaId = personaRes.data.id;

            let warningFoto = null;
            if (fotoNueva) {
                try {
                    const fd = new FormData();
                    fd.append("file", fotoNueva);
                    await api.post(`/personas/${nuevaPersonaId}/foto`, fd);
                } catch {
                    warningFoto = "La foto no se pudo subir. Puedes añadirla después.";
                }
            }

            const asignarRes = await api.post("/vivienda-personas/asignar", {
                personaId: nuevaPersonaId,
                viviendaId,
                rolEnVivienda: rolNueva,
                principal: principalNueva,
            });

            setPersonas([]);
            await cargarVecinos();
            setFormNueva({ nombre: "", apellidos: "", dni: "", telefono: "", email: "" });
            setPrincipalNueva(false);
            setFotoNueva(null);
            setFotoPreview(null);

            const msgExito = `${formNueva.nombre.trim()} ${formNueva.apellidos.trim()} añadido correctamente.`;
            if (warningFoto) {
                setWarning(`${msgExito} ${warningFoto}`);
            } else if (asignarRes.data.warning) {
                setWarning(asignarRes.data.warning);
            } else {
                mostrarMensaje("success", msgExito);
            }
        } catch (e) {
            setError(e.response?.data?.message || "Error al crear o asignar persona");
        } finally {
            setGuardando(false);
        }
    };

    const eliminarAsignacion = async (id, nombre) => {
        if (!window.confirm(`¿Quitar a ${nombre} de esta vivienda?`)) return;
        try {
            await api.delete(`/vivienda-personas/${id}`);
            await cargarVecinos();
            mostrarMensaje("success", "Vecino eliminado de la vivienda");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "Error al eliminar vecino");
        }
    };

    return (
        <div className="gestion-lista">
            <div className="gestion-section-title">Vecinos de {viviendaLabel}</div>

            {loadingVecinos ? (
                <div className="gestion-loading">Cargando vecinos...</div>
            ) : vecinos.length === 0 ? (
                <div className="gestion-empty">No hay vecinos asignados a esta vivienda.</div>
            ) : (
                <div className="gestion-vecinos-list">
                    {vecinos.map((v) => (
                        <div key={v.id} className="gestion-vecino-item">
                            <AvatarUsuario
                                usuario={{ nombre: v.personaNombreCompleto, fotoPerfil: v.personaFotoPerfil || null }}
                                size={42}
                            />
                            <div className="gestion-vecino-info">
                                <span className="gestion-vecino-nombre">{v.personaNombreCompleto}</span>
                                {v.personaDni && (
                                    <span className="gestion-vecino-dni">{v.personaDni}</span>
                                )}
                            </div>
                            <div className="gestion-vecino-badges">
                                <span
                                    className="gestion-rol-badge"
                                    style={ROL_COLORS[v.rolEnVivienda] || {}}
                                >
                                    {ROL_LABELS[v.rolEnVivienda] || v.rolEnVivienda}
                                </span>
                                {v.principal && (
                                    <span className="gestion-principal-badge">Principal</span>
                                )}
                            </div>
                            <button
                                className="gestion-btn-delete"
                                onClick={() => eliminarAsignacion(v.id, v.personaNombreCompleto)}
                            >
                                Quitar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="gestion-anadir-section">
                <div className="gestion-anadir-header">Añadir vecino</div>

                <div className="gestion-tabs">
                    <button
                        className={`gestion-tab${tabAnadir === "buscar" ? " gestion-tab-active" : ""}`}
                        onClick={abrirTabBuscar}
                    >
                        Buscar persona existente
                    </button>
                    <button
                        className={`gestion-tab${tabAnadir === "crear" ? " gestion-tab-active" : ""}`}
                        onClick={abrirTabCrear}
                    >
                        Crear nueva persona
                    </button>
                </div>

                {warning && (
                    <div className="gestion-warning">
                        <strong>Aviso:</strong> {warning}
                    </div>
                )}
                {error && <div className="form-error" style={{ marginTop: 8 }}>{error}</div>}

                {tabAnadir === "buscar" && (
                    <div className="gestion-tab-content">
                        <input
                            placeholder="Buscar por nombre, apellidos o DNI..."
                            value={textoBusqueda}
                            onChange={(e) => {
                                setTextoBusqueda(e.target.value);
                                setPersonaSeleccionada(null);
                                setError("");
                            }}
                            className="gestion-search-input"
                        />

                        {loadingPersonas && <div className="gestion-loading">Cargando personas...</div>}

                        {!loadingPersonas && textoBusqueda.trim() && (
                            <div className="gestion-search-results">
                                {personasFiltradas.length === 0 ? (
                                    <div className="gestion-empty">No se encontraron personas.</div>
                                ) : (
                                    personasFiltradas.slice(0, 10).map((p) => (
                                        <div
                                            key={p.id}
                                            className={`gestion-persona-result${personaSeleccionada?.id === p.id ? " gestion-persona-selected" : ""}`}
                                            onClick={() => { setPersonaSeleccionada(p); setError(""); }}
                                        >
                                            <AvatarUsuario
                                                usuario={{ nombre: p.nombre, fotoPerfil: p.fotoPerfil || null }}
                                                size={36}
                                            />
                                            <div className="gestion-persona-result-info">
                                                <span className="gestion-persona-result-nombre">
                                                    {p.nombre} {p.apellidos}
                                                </span>
                                                {p.dni && (
                                                    <span className="gestion-persona-result-dni">{p.dni}</span>
                                                )}
                                                {p.calleNombre && (
                                                    <span className="gestion-persona-result-vivienda">
                                                        {p.calleNombre} {p.viviendaIdentificador}
                                                    </span>
                                                )}
                                                {p.bloqueCodigo && (
                                                    <span className="gestion-persona-result-vivienda">
                                                        Bloque {p.bloqueCodigo}{p.planta ? ` · ${p.planta}º` : ""} {p.viviendaIdentificador}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {personaSeleccionada && (
                            <div className="gestion-asignar-section">
                                <div className="gestion-asignar-row">
                                    <span className="gestion-asignar-label">
                                        Asignar <strong>{personaSeleccionada.nombre} {personaSeleccionada.apellidos}</strong> como:
                                    </span>
                                    <select
                                        value={rolAsignar}
                                        onChange={(e) => setRolAsignar(e.target.value)}
                                        className="gestion-rol-select"
                                    >
                                        <option value="PROPIETARIO">Propietario</option>
                                        <option value="HABITANTE">Habitante</option>
                                    </select>
                                    <button
                                        className="gestion-btn-primary"
                                        onClick={() => asignar(personaSeleccionada.id, rolAsignar)}
                                        disabled={guardando}
                                    >
                                        {guardando ? "Asignando..." : "Asignar"}
                                    </button>
                                </div>
                                <div className="gestion-principal-row">
                                    <label className="gestion-principal-check">
                                        <input
                                            type="checkbox"
                                            checked={principalAsignar}
                                            onChange={(e) => setPrincipalAsignar(e.target.checked)}
                                        />
                                        Contacto principal de la vivienda
                                    </label>
                                    <p className="gestion-principal-help">
                                        El contacto principal es la persona de referencia de la vivienda
                                        (normalmente el propietario o titular del contrato)
                                    </p>
                                    {principalAsignar && principalActual && (
                                        <div className="gestion-warning" style={{ marginTop: 6 }}>
                                            Ya hay un contacto principal en esta vivienda.
                                            Se cambiará a <strong>{principalActual.personaNombreCompleto}</strong>.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {tabAnadir === "crear" && (
                    <div className="gestion-tab-content">
                        <div className="gestion-form-grid">
                            <div className="gestion-form-field">
                                <label>Nombre *</label>
                                <input
                                    placeholder="Nombre"
                                    value={formNueva.nombre}
                                    onChange={(e) => { setFormNueva({ ...formNueva, nombre: e.target.value }); setError(""); }}
                                />
                            </div>
                            <div className="gestion-form-field">
                                <label>Apellidos *</label>
                                <input
                                    placeholder="Apellidos"
                                    value={formNueva.apellidos}
                                    onChange={(e) => { setFormNueva({ ...formNueva, apellidos: e.target.value }); setError(""); }}
                                />
                            </div>
                            <div className="gestion-form-field">
                                <label>DNI</label>
                                <input
                                    placeholder="DNI (opcional)"
                                    value={formNueva.dni}
                                    onChange={(e) => { setFormNueva({ ...formNueva, dni: e.target.value }); setError(""); }}
                                />
                            </div>
                            <div className="gestion-form-field">
                                <label>Teléfono</label>
                                <input
                                    placeholder="Teléfono (opcional)"
                                    value={formNueva.telefono}
                                    onChange={(e) => setFormNueva({ ...formNueva, telefono: e.target.value })}
                                />
                            </div>
                            <div className="gestion-form-field" style={{ gridColumn: "1 / -1" }}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Email (opcional)"
                                    value={formNueva.email}
                                    onChange={(e) => setFormNueva({ ...formNueva, email: e.target.value })}
                                />
                            </div>
                            <div className="gestion-form-field" style={{ gridColumn: "1 / -1" }}>
                                <label>Foto (opcional)</label>
                                <div
                                    className={`gestion-foto-dropzone${dragOver ? " gestion-foto-dropzone-over" : ""}`}
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragOver(false);
                                        handleFotoChange(e.dataTransfer.files[0]);
                                    }}
                                    onClick={() => fotoInputRef.current?.click()}
                                >
                                    {fotoPreview ? (
                                        <img src={fotoPreview} alt="Vista previa" className="gestion-foto-preview" />
                                    ) : (
                                        <span className="gestion-foto-placeholder">
                                            Arrastra una foto aquí o haz clic para seleccionar<br />
                                            <small>JPEG, PNG o WEBP · máx. 5 MB</small>
                                        </span>
                                    )}
                                </div>
                                {fotoPreview && (
                                    <button
                                        type="button"
                                        className="gestion-foto-quitar"
                                        onClick={() => { setFotoNueva(null); setFotoPreview(null); setErrorFoto(""); }}
                                    >
                                        Quitar foto
                                    </button>
                                )}
                                <input
                                    ref={fotoInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFotoChange(e.target.files[0])}
                                />
                                {errorFoto ? (
                                    <div style={{ marginTop: 6, padding: "8px 12px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, color: "#dc2626", fontSize: 13, display: "flex", alignItems: "flex-start", gap: 6 }}>
                                        <span>⚠️</span>
                                        <div>
                                            <strong>Error en la imagen:</strong> {errorFoto}
                                            <br />
                                            <span style={{ color: "#ef4444", fontSize: 12 }}>Formatos aceptados: JPG, PNG, WebP · Máximo: 5MB</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Opcional · JPG, PNG o WebP · Máximo 5MB</p>
                                )}
                            </div>
                        </div>

                        <div className="gestion-principal-row" style={{ marginTop: 12 }}>
                            <label className="gestion-principal-check">
                                <input
                                    type="checkbox"
                                    checked={principalNueva}
                                    onChange={(e) => setPrincipalNueva(e.target.checked)}
                                />
                                Contacto principal de la vivienda
                            </label>
                            <p className="gestion-principal-help">
                                El contacto principal es la persona de referencia de la vivienda
                                (normalmente el propietario o titular del contrato)
                            </p>
                            {principalNueva && principalActual && (
                                <div className="gestion-warning" style={{ marginTop: 6 }}>
                                    Ya hay un contacto principal en esta vivienda.
                                    Se cambiará a <strong>{principalActual.personaNombreCompleto}</strong>.
                                </div>
                            )}
                        </div>

                        <div className="gestion-asignar-row" style={{ marginTop: 12 }}>
                            <span className="gestion-asignar-label">Rol en la vivienda:</span>
                            <select
                                value={rolNueva}
                                onChange={(e) => setRolNueva(e.target.value)}
                                className="gestion-rol-select"
                            >
                                <option value="PROPIETARIO">Propietario</option>
                                <option value="HABITANTE">Habitante</option>
                            </select>
                            <button
                                className="gestion-btn-primary"
                                onClick={crearYAsignar}
                                disabled={guardando || !formNueva.nombre.trim() || !formNueva.apellidos.trim()}
                            >
                                {guardando ? "Guardando..." : "Crear y asignar"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GestionVecinos;
