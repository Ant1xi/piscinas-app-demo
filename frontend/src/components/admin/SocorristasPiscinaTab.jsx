import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import AvatarUsuario from "../ui/AvatarUsuario";

function SocorristasPiscinaTab({ piscinaId, mostrarMensaje }) {
    const [asignaciones, setAsignaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        cargarAsignaciones();
    }, [piscinaId]);

    const cargarAsignaciones = async () => {
        try {
            const response = await api.get(`/socorrista-piscina/piscina/${piscinaId}/socorristas`);
            setAsignaciones(response.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
            mostrarMensaje("error", "Error al cargar socorristas asignados");
        }
    };

    const abrirModal = async () => {
        try {
            const response = await api.get("/usuarios");

            // De momento filtramos en frontend por rol SOCORRISTA si viene en el DTO.
            const soloSocorristas = response.data.filter((u) =>
                u.rol === "SOCORRISTA" ||
                u.roles?.includes("SOCORRISTA")
            );

            setUsuarios(soloSocorristas.length > 0 ? soloSocorristas : response.data);
            setMostrarModal(true);
        } catch (error) {
            console.error(error.response?.data || error.message);
            mostrarMensaje("error", "Error al cargar usuarios");
        }
    };

    const asignarSocorrista = async (socorristaId) => {
        try {
            await api.post("/socorrista-piscina/asignar", {
                socorristaId,
                piscinaId: Number(piscinaId)
            });

            await cargarAsignaciones();
            setMostrarModal(false);
            mostrarMensaje("success", "Socorrista asignado correctamente");
        } catch (error) {
            mostrarMensaje(
                "error",
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                "Error al asignar socorrista"
            );
        }
    };

    const quitarSocorrista = async (asignacionId) => {
        const confirmar = window.confirm("¿Seguro que quieres quitar este socorrista de la piscina?");
        if (!confirmar) return;

        try {
            await api.patch(`/socorrista-piscina/desactivar/${asignacionId}`);
            await cargarAsignaciones();
            mostrarMensaje("success", "Socorrista quitado correctamente");
        } catch (error) {
            mostrarMensaje(
                "error",
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                "Error al quitar socorrista"
            );
        }
    };

    const idsSocorristasAsignados = asignaciones.map((a) => a.socorristaId);

    const usuariosDisponibles = usuarios.filter(
        (u) => !idsSocorristasAsignados.includes(u.id)
    );

    return (
        <div>
            <div className="detalle-section-title">
                <div>
                    <h2>Socorristas asignados</h2>
                    <p>Gestiona qué socorristas pueden trabajar en esta piscina.</p>
                </div>

                <button className="detalle-primary-btn" onClick={abrirModal}>
                    + Añadir socorrista
                </button>
            </div>

            {asignaciones.length === 0 ? (
                <div className="detalle-empty">
                    No hay socorristas asignados todavía.
                </div>
            ) : (
                <div className="socorrista-list">
                    {asignaciones.map((a) => (
                        <div key={a.id} className="socorrista-card">
                            <AvatarUsuario usuario={{ nombre: a.socorristaNombre, fotoPerfil: a.socorristaFotoPerfil || null }} size={44} />
                            <div>
                                <h3>{a.socorristaNombre}</h3>
                                <p>{a.socorristaEmail}</p>
                                <span>
                                    Asignado por {a.asignadoPorNombre || "administrador"} · {a.fechaAsignacion}
                                </span>
                            </div>

                            <button
                                className="btn-danger-soft"
                                onClick={() => quitarSocorrista(a.id)}
                            >
                                Quitar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {mostrarModal && (
                <div className="modal-backdrop">
                    <div className="modal modal-large">
                        <h2>Añadir socorrista</h2>
                        <p>Selecciona un socorrista disponible para esta piscina.</p>

                        {usuariosDisponibles.length === 0 ? (
                            <div className="detalle-empty compact">
                                No hay socorristas disponibles para añadir.
                            </div>
                        ) : (
                            <div className="socorrista-modal-list">
                                {usuariosDisponibles.map((u) => (
                                    <div key={u.id} className="socorrista-modal-item">
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <AvatarUsuario usuario={u} size={36} />
                                            <div>
                                                <strong>{u.nombre} {u.apellidos}</strong>
                                                <span>{u.email}</span>
                                            </div>
                                        </div>

                                        <button
                                            className="modal-save"
                                            onClick={() => asignarSocorrista(u.id)}
                                        >
                                            Añadir
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setMostrarModal(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SocorristasPiscinaTab;