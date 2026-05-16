import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosConfig";

const IcoCasa = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const IcoBloque = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="1"/>
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
  </svg>
);

function GestionViviendas({ urbanizacionId, estructuraId, esBloques, onSelectVivienda, mostrarMensaje }) {
    const [viviendas, setViviendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viviendaEditando, setViviendaEditando] = useState(null);
    const [form, setForm] = useState({ identificador: "", planta: "" });
    const [guardando, setGuardando] = useState(false);

    // Modo creación: "individual" | "masiva"
    const [modoCreacion, setModoCreacion] = useState("individual");
    const [formMasiva, setFormMasiva] = useState({ tipo: "todos", inicio: "", fin: "", plantas: "", letras: "" });
    const [resultadoMasiva, setResultadoMasiva] = useState(null);

    useEffect(() => { cargarViviendas(); }, [estructuraId]);

    const cargarViviendas = async () => {
        setLoading(true);
        try {
            const endpoint = esBloques
                ? `/viviendas/bloque/${estructuraId}`
                : `/viviendas/calle/${estructuraId}`;
            const res = await api.get(endpoint);
            setViviendas(res.data);
        } catch {
            mostrarMensaje("error", "Error al cargar viviendas");
        } finally {
            setLoading(false);
        }
    };

    const buildPayload = (identificador, planta) => ({
        identificador: identificador.trim(),
        planta: esBloques && planta && planta.trim() ? planta.trim() : null,
        urbanizacionId,
        calleId: esBloques ? null : estructuraId,
        bloqueId: esBloques ? estructuraId : null,
    });

    const buildLabel = (v) => {
        if (esBloques && v.planta) return `${v.planta}º${v.identificador}`;
        return v.identificador;
    };

    const crearVivienda = async () => {
        if (!form.identificador.trim()) return;
        setGuardando(true);
        try {
            await api.post("/viviendas", buildPayload(form.identificador, form.planta));
            setForm({ identificador: "", planta: "" });
            await cargarViviendas();
            mostrarMensaje("success", "Vivienda añadida");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "Error al crear vivienda");
        } finally {
            setGuardando(false);
        }
    };

    const guardarEdicion = async () => {
        if (!viviendaEditando?.identificador.trim()) return;
        setGuardando(true);
        try {
            await api.put(`/viviendas/${viviendaEditando.id}`,
                buildPayload(viviendaEditando.identificador, viviendaEditando.planta || ""));
            setViviendaEditando(null);
            await cargarViviendas();
            mostrarMensaje("success", "Vivienda actualizada");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "Error al actualizar vivienda");
        } finally {
            setGuardando(false);
        }
    };

    const eliminarVivienda = async (id, label) => {
        if (!window.confirm(`¿Eliminar la vivienda "${label}"?\nSolo se puede eliminar si no tiene vecinos asignados.`)) return;
        try {
            await api.delete(`/viviendas/${id}`);
            await cargarViviendas();
            mostrarMensaje("success", "Vivienda eliminada");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "No se puede eliminar la vivienda");
        }
    };

    // --- Creación masiva (calles) ---
    const generarNumerosCalles = useMemo(() => {
        const fin = parseInt(formMasiva.fin);
        if (isNaN(fin) || fin < 1) return [];
        switch (formMasiva.tipo) {
            case "todos":
                return Array.from({ length: fin }, (_, i) => i + 1);
            case "pares":
                return Array.from({ length: Math.floor(fin / 2) }, (_, i) => (i + 1) * 2);
            case "impares":
                return Array.from({ length: Math.ceil(fin / 2) }, (_, i) => i * 2 + 1);
            case "rango": {
                const inicio = parseInt(formMasiva.inicio);
                if (isNaN(inicio) || inicio < 1 || inicio > fin) return [];
                return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
            }
            default: return [];
        }
    }, [formMasiva.tipo, formMasiva.fin, formMasiva.inicio]);

    // --- Creación masiva (bloques) ---
    const parsarLetras = (str) =>
        str.split(/[\s,]+/).map(l => l.trim()).filter(l => l.length > 0);

    const generarViviendasBloques = useMemo(() => {
        const plantas = parseInt(formMasiva.plantas);
        const letras = parsarLetras(formMasiva.letras);
        if (isNaN(plantas) || plantas < 1 || letras.length === 0) return [];
        const result = [];
        for (let p = 1; p <= plantas; p++) {
            for (const l of letras) {
                result.push({ planta: String(p), identificador: l });
            }
        }
        return result;
    }, [formMasiva.plantas, formMasiva.letras]);

    const crearMasiva = async () => {
        setGuardando(true);
        setResultadoMasiva(null);
        try {
            let creadas = 0;
            let omitidas = 0;
            if (esBloques) {
                const items = generarViviendasBloques;
                if (items.length === 0) return;
                const res = await Promise.allSettled(
                    items.map(v => api.post("/viviendas", buildPayload(v.identificador, v.planta)))
                );
                creadas = res.filter(r => r.status === "fulfilled").length;
                omitidas = res.filter(r => r.status === "rejected").length;
            } else {
                const nums = generarNumerosCalles;
                if (nums.length === 0) return;
                const res = await Promise.allSettled(
                    nums.map(n => api.post("/viviendas", buildPayload(String(n), "")))
                );
                creadas = res.filter(r => r.status === "fulfilled").length;
                omitidas = res.filter(r => r.status === "rejected").length;
            }
            await cargarViviendas();
            setResultadoMasiva(
                `Se crearon ${creadas} vivienda${creadas !== 1 ? "s" : ""} correctamente.` +
                (omitidas > 0 ? ` ${omitidas} ya existían y se omitieron.` : "")
            );
        } catch {
            mostrarMensaje("error", "Error al crear viviendas en grupo");
        } finally {
            setGuardando(false);
        }
    };

    const previewCalles = useMemo(() => {
        const nums = generarNumerosCalles;
        if (nums.length === 0) return null;
        const muestra = nums.slice(0, 15).join(", ");
        return `Se crearán: ${muestra}${nums.length > 15 ? ", ..." : ""} (${nums.length} vivienda${nums.length !== 1 ? "s" : ""})`;
    }, [generarNumerosCalles]);

    const previewBloques = useMemo(() => {
        const items = generarViviendasBloques;
        if (items.length === 0) return null;
        const plantas = parseInt(formMasiva.plantas);
        const letras = parsarLetras(formMasiva.letras);
        const lineas = Array.from({ length: plantas }, (_, i) => {
            const p = i + 1;
            return letras.map(l => `${p}º${l}`).join(", ");
        });
        return { total: items.length, lineas };
    }, [generarViviendasBloques, formMasiva.plantas, formMasiva.letras]);

    const sortedViviendas = useMemo(() => {
        return [...viviendas].sort((a, b) => {
            const numA = parseInt(a.identificador);
            const numB = parseInt(b.identificador);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.identificador.localeCompare(b.identificador);
        });
    }, [viviendas]);

    if (loading) return <div className="gestion-loading">Cargando viviendas...</div>;

    return (
        <div className="gestion-lista">
            <div className="gestion-section-title">Viviendas</div>

            {/* Toggle modo */}
            <div className="gestion-modo-toggle">
                <button
                    className={`gestion-modo-btn${modoCreacion === "individual" ? " gestion-modo-btn-active" : ""}`}
                    onClick={() => { setModoCreacion("individual"); setResultadoMasiva(null); }}
                >
                    Añadir una
                </button>
                <button
                    className={`gestion-modo-btn${modoCreacion === "masiva" ? " gestion-modo-btn-active" : ""}`}
                    onClick={() => { setModoCreacion("masiva"); setResultadoMasiva(null); }}
                >
                    Añadir en grupo
                </button>
            </div>

            {/* Modo individual */}
            {modoCreacion === "individual" && (
                <div className={`gestion-add-form ${esBloques ? "gestion-add-form-3col" : ""}`}>
                    {esBloques && (
                        <input
                            placeholder="Planta (ej: 1, 2, 3...)"
                            value={form.planta}
                            onChange={(e) => setForm({ ...form, planta: e.target.value })}
                            style={{ maxWidth: 120 }}
                        />
                    )}
                    <input
                        placeholder={esBloques ? "Puerta (ej: A, B, 1...)" : "Número o identificador (ej: 12, 14A...)"}
                        value={form.identificador}
                        onChange={(e) => setForm({ ...form, identificador: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && crearVivienda()}
                    />
                    <button
                        className="gestion-btn-primary"
                        onClick={crearVivienda}
                        disabled={guardando || !form.identificador.trim()}
                    >
                        + Añadir vivienda
                    </button>
                </div>
            )}

            {/* Modo masiva */}
            {modoCreacion === "masiva" && !esBloques && (
                <div className="grupo-panel">
                    <h3>Creación masiva de viviendas</h3>
                    <p className="grupo-desc">Genera múltiples viviendas de una vez seleccionando el patrón de numeración.</p>

                    <div className="grupo-opciones">
                        <button
                            className={`grupo-tipo-btn${formMasiva.tipo === "pares" ? " activo" : ""}`}
                            onClick={() => setFormMasiva({ ...formMasiva, tipo: "pares" })}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/>
                            </svg>
                            <span>Pares</span>
                            <small>2, 4, 6...</small>
                        </button>
                        <button
                            className={`grupo-tipo-btn${formMasiva.tipo === "impares" ? " activo" : ""}`}
                            onClick={() => setFormMasiva({ ...formMasiva, tipo: "impares" })}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="5" cy="14" r="3"/><circle cx="12" cy="10" r="3"/><circle cx="19" cy="14" r="3"/>
                            </svg>
                            <span>Impares</span>
                            <small>1, 3, 5...</small>
                        </button>
                        <button
                            className={`grupo-tipo-btn${formMasiva.tipo === "todos" ? " activo" : ""}`}
                            onClick={() => setFormMasiva({ ...formMasiva, tipo: "todos" })}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                            </svg>
                            <span>Todos</span>
                            <small>1, 2, 3...</small>
                        </button>
                        <button
                            className={`grupo-tipo-btn${formMasiva.tipo === "rango" ? " activo" : ""}`}
                            onClick={() => setFormMasiva({ ...formMasiva, tipo: "rango" })}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M8 6l-4 6 4 6M16 6l4 6-4 6"/>
                            </svg>
                            <span>Rango</span>
                            <small>X hasta Y</small>
                        </button>
                    </div>

                    <div className="grupo-inputs">
                        {formMasiva.tipo !== "rango" ? (
                            <div className="grupo-input-group">
                                <label>Número máximo</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Ej: 50"
                                    value={formMasiva.fin}
                                    onChange={(e) => setFormMasiva({ ...formMasiva, fin: e.target.value })}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="grupo-input-group">
                                    <label>Desde</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Ej: 1"
                                        value={formMasiva.inicio}
                                        onChange={(e) => setFormMasiva({ ...formMasiva, inicio: e.target.value })}
                                    />
                                </div>
                                <div className="grupo-input-group">
                                    <label>Hasta</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Ej: 99"
                                        value={formMasiva.fin}
                                        onChange={(e) => setFormMasiva({ ...formMasiva, fin: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {generarNumerosCalles.length > 0 && (
                        <div className="grupo-preview">
                            <span className="grupo-preview-label">Se crearán {generarNumerosCalles.length} viviendas:</span>
                            <div className="grupo-preview-nums">
                                {generarNumerosCalles.slice(0, 20).join(", ")}
                                {generarNumerosCalles.length > 20 && ` ... y ${generarNumerosCalles.length - 20} más`}
                            </div>
                        </div>
                    )}

                    {resultadoMasiva && <div className="gestion-masiva-result">{resultadoMasiva}</div>}

                    <button
                        className="grupo-crear-btn"
                        onClick={crearMasiva}
                        disabled={guardando || generarNumerosCalles.length === 0}
                    >
                        {guardando ? "Creando..." : `Crear ${generarNumerosCalles.length > 0 ? generarNumerosCalles.length : ""} viviendas`}
                    </button>
                </div>
            )}

            {modoCreacion === "masiva" && esBloques && (
                <div className="grupo-panel">
                    <h3>Creación masiva de viviendas</h3>
                    <p className="grupo-desc">Define el número de plantas y las puertas de cada planta.</p>

                    <div className="grupo-inputs">
                        <div className="grupo-input-group">
                            <label>Número de plantas</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Ej: 4"
                                value={formMasiva.plantas}
                                onChange={(e) => setFormMasiva({ ...formMasiva, plantas: e.target.value })}
                            />
                        </div>
                        <div className="grupo-input-group">
                            <label>Letras por planta</label>
                            <input
                                placeholder="Ej: A B C D"
                                value={formMasiva.letras}
                                onChange={(e) => setFormMasiva({ ...formMasiva, letras: e.target.value })}
                            />
                        </div>
                    </div>

                    {previewBloques && (
                        <div className="grupo-preview">
                            <span className="grupo-preview-label">Se crearán {previewBloques.total} viviendas:</span>
                            <div className="grupo-preview-bloques">
                                {previewBloques.lineas.map((linea, i) => {
                                    const letrasArr = parsarLetras(formMasiva.letras);
                                    return (
                                        <div key={i} className="grupo-preview-planta-row">
                                            <span className="grupo-preview-planta-label">Planta {i + 1}:</span>
                                            <div className="grupo-preview-grid">
                                                {letrasArr.map(l => (
                                                    <span key={l} className="grupo-preview-celda">{i + 1}º{l}</span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {resultadoMasiva && <div className="gestion-masiva-result">{resultadoMasiva}</div>}

                    <button
                        className="grupo-crear-btn"
                        onClick={crearMasiva}
                        disabled={guardando || generarViviendasBloques.length === 0}
                    >
                        {guardando ? "Creando..." : `Crear ${generarViviendasBloques.length > 0 ? generarViviendasBloques.length : ""} viviendas`}
                    </button>
                </div>
            )}

            {viviendas.length === 0 && (
                <div className="gestion-empty">No hay viviendas registradas.</div>
            )}

            {viviendaEditando && (
                <div className="vivienda-edit-panel">
                    <div className="vivienda-edit-panel-title">Editando: {buildLabel(viviendaEditando)}</div>
                    <div className="gestion-edit-row">
                        {esBloques && (
                            <input
                                className="gestion-edit-input"
                                placeholder="Planta"
                                value={viviendaEditando.planta || ""}
                                onChange={(e) => setViviendaEditando({ ...viviendaEditando, planta: e.target.value })}
                                style={{ maxWidth: 90 }}
                            />
                        )}
                        <input
                            className="gestion-edit-input"
                            placeholder="Identificador"
                            value={viviendaEditando.identificador}
                            onChange={(e) => setViviendaEditando({ ...viviendaEditando, identificador: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") guardarEdicion();
                                if (e.key === "Escape") setViviendaEditando(null);
                            }}
                            autoFocus
                        />
                    </div>
                    <div className="gestion-item-actions">
                        <button className="gestion-btn-save" onClick={guardarEdicion} disabled={guardando}>Guardar</button>
                        <button className="gestion-btn-cancel" onClick={() => setViviendaEditando(null)}>Cancelar</button>
                    </div>
                </div>
            )}

            {viviendas.length > 0 && (
                <div className="vivienda-grid">
                    {sortedViviendas.map((v) => {
                        const label = buildLabel(v);
                        const tieneVecinos = (v.numVecinos ?? 0) > 0;
                        const esEditando = viviendaEditando?.id === v.id;
                        return (
                            <div
                                key={v.id}
                                className={`vivienda-card${tieneVecinos ? " vivienda-card--vecinos" : " vivienda-card--vacia"}${esEditando ? " vivienda-card--editando" : ""}`}
                                title={tieneVecinos ? `${v.numVecinos} vecino${v.numVecinos !== 1 ? "s" : ""} registrados` : "Sin vecinos registrados"}
                                onClick={() => !esEditando && onSelectVivienda(v.id, label)}
                            >
                                {esBloques ? <IcoBloque color={tieneVecinos ? "#16a34a" : "#94a3b8"} /> : <IcoCasa color={tieneVecinos ? "#16a34a" : "#94a3b8"} />}
                                <span className="vivienda-card-num">{v.identificador}</span>
                                {esBloques && v.planta && (
                                    <span className="vivienda-card-planta">{v.planta}ª</span>
                                )}
                                <div className="vivienda-card-actions" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="vivienda-card-btn vivienda-card-btn--edit"
                                        onClick={() => setViviendaEditando({ id: v.id, identificador: v.identificador, planta: v.planta || "" })}
                                        title="Editar"
                                    >✏</button>
                                    <button
                                        className="vivienda-card-btn vivienda-card-btn--delete"
                                        onClick={() => eliminarVivienda(v.id, label)}
                                        title="Eliminar"
                                    >✕</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default GestionViviendas;
