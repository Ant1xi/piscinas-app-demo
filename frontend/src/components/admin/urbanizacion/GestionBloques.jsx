import { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";

function GestionBloques({ urbanizacionId, onSelectBloque, mostrarMensaje }) {
    const [bloques, setBloques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bloqueEditando, setBloqueEditando] = useState(null);
    const [codigoNuevo, setCodigoNuevo] = useState("");
    const [guardando, setGuardando] = useState(false);

    useEffect(() => { cargarBloques(); }, [urbanizacionId]);

    const cargarBloques = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/bloques/urbanizacion/${urbanizacionId}`);
            setBloques(res.data);
        } catch {
            mostrarMensaje("error", "Error al cargar bloques");
        } finally {
            setLoading(false);
        }
    };

    const crearBloque = async () => {
        if (!codigoNuevo.trim()) return;
        setGuardando(true);
        try {
            await api.post("/bloques", { codigo: codigoNuevo.trim(), urbanizacionId });
            setCodigoNuevo("");
            await cargarBloques();
            mostrarMensaje("success", "Bloque añadido");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "Error al crear bloque");
        } finally {
            setGuardando(false);
        }
    };

    const guardarEdicion = async () => {
        if (!bloqueEditando?.codigo.trim()) return;
        setGuardando(true);
        try {
            await api.put(`/bloques/${bloqueEditando.id}`, { codigo: bloqueEditando.codigo.trim(), urbanizacionId });
            setBloqueEditando(null);
            await cargarBloques();
            mostrarMensaje("success", "Bloque actualizado");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "Error al actualizar bloque");
        } finally {
            setGuardando(false);
        }
    };

    const eliminarBloque = async (id, codigo) => {
        if (!window.confirm(`¿Eliminar el bloque "${codigo}"?\nSolo se puede eliminar si no tiene viviendas asignadas.`)) return;
        try {
            await api.delete(`/bloques/${id}`);
            await cargarBloques();
            mostrarMensaje("success", "Bloque eliminado");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "No se puede eliminar el bloque");
        }
    };

    if (loading) return <div className="gestion-loading">Cargando bloques...</div>;

    return (
        <div className="gestion-lista">
            <div className="gestion-section-title">Bloques</div>

            <div className="gestion-add-form">
                <input
                    placeholder="Código del nuevo bloque (ej: A, B, 1, 2...)"
                    value={codigoNuevo}
                    onChange={(e) => setCodigoNuevo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && crearBloque()}
                />
                <button
                    className="gestion-btn-primary"
                    onClick={crearBloque}
                    disabled={guardando || !codigoNuevo.trim()}
                >
                    + Añadir bloque
                </button>
            </div>

            {bloques.length === 0 && (
                <div className="gestion-empty">No hay bloques registrados en esta urbanización.</div>
            )}

            {bloques.map((b) => (
                <div key={b.id} className="gestion-item">
                    {bloqueEditando?.id === b.id ? (
                        <>
                            <input
                                className="gestion-edit-input"
                                value={bloqueEditando.codigo}
                                onChange={(e) => setBloqueEditando({ ...bloqueEditando, codigo: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") guardarEdicion();
                                    if (e.key === "Escape") setBloqueEditando(null);
                                }}
                                autoFocus
                            />
                            <div className="gestion-item-actions">
                                <button className="gestion-btn-save" onClick={guardarEdicion} disabled={guardando}>
                                    Guardar
                                </button>
                                <button className="gestion-btn-cancel" onClick={() => setBloqueEditando(null)}>
                                    Cancelar
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="gestion-item-info">
                                <span className="gestion-item-nombre">Bloque {b.codigo}</span>
                                <span className="gestion-badge-count">
                                    {b.numViviendas} vivienda{b.numViviendas !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="gestion-item-actions">
                                <button
                                    className="gestion-btn-gestionar"
                                    onClick={() => onSelectBloque(b.id, `Bloque ${b.codigo}`)}
                                >
                                    Viviendas →
                                </button>
                                <button
                                    className="gestion-btn-edit"
                                    onClick={() => setBloqueEditando({ id: b.id, codigo: b.codigo })}
                                >
                                    Editar
                                </button>
                                <button
                                    className="gestion-btn-delete"
                                    onClick={() => eliminarBloque(b.id, b.codigo)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default GestionBloques;
