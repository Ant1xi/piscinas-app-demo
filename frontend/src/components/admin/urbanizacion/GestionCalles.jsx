import { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";

function GestionCalles({ urbanizacionId, onSelectCalle, mostrarMensaje }) {
    const [calles, setCalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [calleEditando, setCalleEditando] = useState(null);
    const [nombreNueva, setNombreNueva] = useState("");
    const [guardando, setGuardando] = useState(false);

    useEffect(() => { cargarCalles(); }, [urbanizacionId]);

    const cargarCalles = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/calles/urbanizacion/${urbanizacionId}`);
            setCalles(res.data);
        } catch {
            mostrarMensaje("error", "Error al cargar calles");
        } finally {
            setLoading(false);
        }
    };

    const crearCalle = async () => {
        if (!nombreNueva.trim()) return;
        setGuardando(true);
        try {
            await api.post("/calles", { nombre: nombreNueva.trim(), urbanizacionId });
            setNombreNueva("");
            await cargarCalles();
            mostrarMensaje("success", "Calle añadida");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "Error al crear calle");
        } finally {
            setGuardando(false);
        }
    };

    const guardarEdicion = async () => {
        if (!calleEditando?.nombre.trim()) return;
        setGuardando(true);
        try {
            await api.put(`/calles/${calleEditando.id}`, { nombre: calleEditando.nombre.trim(), urbanizacionId });
            setCalleEditando(null);
            await cargarCalles();
            mostrarMensaje("success", "Calle actualizada");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "Error al actualizar calle");
        } finally {
            setGuardando(false);
        }
    };

    const eliminarCalle = async (id, nombre) => {
        if (!window.confirm(`¿Eliminar la calle "${nombre}"?\nSolo se puede eliminar si no tiene viviendas asignadas.`)) return;
        try {
            await api.delete(`/calles/${id}`);
            await cargarCalles();
            mostrarMensaje("success", "Calle eliminada");
        } catch (e) {
            mostrarMensaje("error", e.response?.data?.message || "No se puede eliminar la calle");
        }
    };

    if (loading) return <div className="gestion-loading">Cargando calles...</div>;

    return (
        <div className="gestion-lista">
            <div className="gestion-section-title">Calles</div>

            <div className="gestion-add-form">
                <input
                    placeholder="Nombre de la nueva calle"
                    value={nombreNueva}
                    onChange={(e) => setNombreNueva(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && crearCalle()}
                />
                <button
                    className="gestion-btn-primary"
                    onClick={crearCalle}
                    disabled={guardando || !nombreNueva.trim()}
                >
                    + Añadir calle
                </button>
            </div>

            {calles.length === 0 && (
                <div className="gestion-empty">No hay calles registradas en esta urbanización.</div>
            )}

            {calles.map((c) => (
                <div key={c.id} className="gestion-item">
                    {calleEditando?.id === c.id ? (
                        <>
                            <input
                                className="gestion-edit-input"
                                value={calleEditando.nombre}
                                onChange={(e) => setCalleEditando({ ...calleEditando, nombre: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") guardarEdicion();
                                    if (e.key === "Escape") setCalleEditando(null);
                                }}
                                autoFocus
                            />
                            <div className="gestion-item-actions">
                                <button className="gestion-btn-save" onClick={guardarEdicion} disabled={guardando}>
                                    Guardar
                                </button>
                                <button className="gestion-btn-cancel" onClick={() => setCalleEditando(null)}>
                                    Cancelar
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="gestion-item-info">
                                <span className="gestion-item-nombre">{c.nombre}</span>
                                <span className="gestion-badge-count">
                                    {c.numViviendas} vivienda{c.numViviendas !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="gestion-item-actions">
                                <button
                                    className="gestion-btn-gestionar"
                                    onClick={() => onSelectCalle(c.id, c.nombre)}
                                >
                                    Viviendas →
                                </button>
                                <button
                                    className="gestion-btn-edit"
                                    onClick={() => setCalleEditando({ id: c.id, nombre: c.nombre })}
                                >
                                    Editar
                                </button>
                                <button
                                    className="gestion-btn-delete"
                                    onClick={() => eliminarCalle(c.id, c.nombre)}
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

export default GestionCalles;
