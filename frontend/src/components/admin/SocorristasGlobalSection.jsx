import { useMemo, useRef, useState } from "react";
import api from "../../api/axiosConfig";
import AvatarUsuario from "../ui/AvatarUsuario";

function SocorristasGlobalSection({ usuarios, recargarUsuarios, mostrarMensaje }) {
    const [busqueda, setBusqueda] = useState("");
    const [filtroActivo, setFiltroActivo] = useState("TODOS");

    const [modalCrear, setModalCrear] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalPassword, setModalPassword] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const [socorristaSeleccionado, setSocorristaSeleccionado] = useState(null);
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [fotoFile, setFotoFile] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [errorFoto, setErrorFoto] = useState("");
    const fotoInputRef = useRef(null);

    const validarFoto = (file) => {
        const FORMATOS_VALIDOS = ["image/jpeg", "image/png", "image/webp"];
        if (!FORMATOS_VALIDOS.includes(file.type)) {
            return `Formato no válido: ${file.type || "desconocido"}. Solo se aceptan JPG, PNG o WebP.`;
        }
        if (file.size > 5 * 1024 * 1024) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(1);
            return `La imagen pesa ${sizeMB}MB. El máximo permitido es 5MB.`;
        }
        return null;
    };

    const [form, setForm] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        password: "",
        activo: true,
        rol: "SOCORRISTA"
    });

    const socorristas = useMemo(() => {
        return usuarios.filter((u) =>
            u.rol === "SOCORRISTA" || u.roles?.includes("SOCORRISTA")
        );
    }, [usuarios]);

    const socorristasFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return socorristas.filter((s) => {
            const coincideTexto =
                s.nombre?.toLowerCase().includes(texto) ||
                s.apellidos?.toLowerCase().includes(texto) ||
                s.email?.toLowerCase().includes(texto) ||
                s.telefono?.toLowerCase().includes(texto);

            const coincideActivo =
                filtroActivo === "TODOS" ||
                (filtroActivo === "ACTIVOS" && s.activo) ||
                (filtroActivo === "INACTIVOS" && !s.activo);

            return coincideTexto && coincideActivo;
        });
    }, [socorristas, busqueda, filtroActivo]);

    const abrirCrear = () => {
        setForm({
            nombre: "",
            apellidos: "",
            email: "",
            telefono: "",
            password: "",
            activo: true,
            rol: "SOCORRISTA"
        });
        setError("");
        setModalCrear(true);
    };

    const abrirEditar = (s) => {
        setSocorristaSeleccionado(s);
        setForm({
            nombre: s.nombre || "",
            apellidos: s.apellidos || "",
            email: s.email || "",
            telefono: s.telefono || "",
            password: "",
            activo: s.activo,
            rol: "SOCORRISTA"
        });
        setFotoFile(null);
        setFotoPreview(null);
        setErrorFoto("");
        setError("");
        setModalEditar(true);
    };

    const abrirPassword = (s) => {
        setSocorristaSeleccionado(s);
        setForm({ ...form, password: "" });
        setMostrarPassword(false);
        setError("");
        setModalPassword(true);
    };

    const validarCrear = () => {
        if (!form.nombre.trim()) return "El nombre es obligatorio.";
        if (!form.apellidos.trim()) return "Los apellidos son obligatorios.";
        if (!form.email.trim()) return "El email es obligatorio.";
        if (!form.password.trim()) return "La contraseña es obligatoria.";
        return "";
    };

    const validarEditar = () => {
        if (!form.nombre.trim()) return "El nombre es obligatorio.";
        if (!form.apellidos.trim()) return "Los apellidos son obligatorios.";
        if (!form.email.trim()) return "El email es obligatorio.";
        return "";
    };

    const crearSocorrista = async () => {
        const errorValidacion = validarCrear();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setGuardando(true);
        try {
            await api.post("/usuarios", {
                nombre: form.nombre.trim(),
                apellidos: form.apellidos.trim(),
                email: form.email.trim(),
                telefono: form.telefono.trim(),
                password: form.password,
                activo: form.activo,
                rol: "SOCORRISTA"
            });

            await recargarUsuarios();
            setModalCrear(false);
            mostrarMensaje("success", "Socorrista creado correctamente");
        } catch (error) {
            setError(error.response?.data?.message || error.response?.data?.mensaje || "Error al crear socorrista");
        } finally {
            setGuardando(false);
        }
    };

    const editarSocorrista = async () => {
        const errorValidacion = validarEditar();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }



        setGuardando(true);
        try {
            await api.put(`/usuarios/${socorristaSeleccionado.id}`, {
                nombre: form.nombre.trim(),
                apellidos: form.apellidos.trim(),
                email: form.email.trim(),
                telefono: form.telefono.trim(),
                activo: form.activo,
                rol: "SOCORRISTA"
            });

            if (fotoFile) {
                const formData = new FormData();
                formData.append("file", fotoFile);
                await api.post(`/usuarios/${socorristaSeleccionado.id}/foto`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            await recargarUsuarios();
            setModalEditar(false);
            mostrarMensaje("success", "Socorrista actualizado correctamente");
        } catch (error) {
            setError(error.response?.data?.message || error.response?.data?.mensaje || "Error al actualizar socorrista");
        } finally {
            setGuardando(false);
        }
    };

    const cambiarPassword = async () => {
        if (!form.password.trim()) {
            setError("La nueva contraseña es obligatoria.");
            return;
        }

        setGuardando(true);
        try {
            await api.patch(`/usuarios/${socorristaSeleccionado.id}/password-reset`, {
                nuevaPassword: form.password
            });

            setModalPassword(false);
            mostrarMensaje("success", "Contraseña actualizada correctamente");
        } catch (error) {
            setError(error.response?.data?.message || error.response?.data?.mensaje || "Error al cambiar contraseña");
        } finally {
            setGuardando(false);
        }
    };

    const desactivarSocorrista = async (s) => {
        const confirmar = window.confirm(`¿Seguro que quieres desactivar a ${s.nombre} ${s.apellidos}?`);
        if (!confirmar) return;

        try {
            // DELETE hace soft-delete (activo=false) en el backend, no elimina el registro
            await api.delete(`/usuarios/${s.id}`);
            await recargarUsuarios();
            mostrarMensaje("success", "Socorrista desactivado correctamente");
        } catch (error) {
            mostrarMensaje("error", error.response?.data?.message || "Error al desactivar socorrista");
        }
    };

    const activarSocorrista = async (s) => {
        try {
            await api.put(`/usuarios/${s.id}`, {
                nombre: s.nombre,
                apellidos: s.apellidos,
                email: s.email,
                telefono: s.telefono || "",
                activo: true,
                rol: "SOCORRISTA"
            });
            await recargarUsuarios();
            mostrarMensaje("success", "Socorrista activado correctamente");
        } catch (error) {
            mostrarMensaje("error", error.response?.data?.message || "Error al activar socorrista");
        }
    };

    return (
        <div className="socorristas-section">
            <div className="section-toolbar">
                <input
                    placeholder="Buscar por nombre, email, teléfono..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select value={filtroActivo} onChange={(e) => setFiltroActivo(e.target.value)}>
                    <option value="TODOS">Todos</option>
                    <option value="ACTIVOS">Activos</option>
                    <option value="INACTIVOS">Inactivos</option>
                </select>

                <button className="primary" onClick={abrirCrear}>
                    + Nuevo socorrista
                </button>
            </div>

            <div className="socorristas-grid">
                {socorristasFiltrados.map((s) => (
                    <div key={s.id} className="socorrista-global-card">
                        <AvatarUsuario usuario={s} size={48} />

                        <div className="socorrista-content">
                            <h3>{s.nombre} {s.apellidos}</h3>
                            <p>{s.email}</p>
                            <span>{s.telefono || "Sin teléfono"}</span>

                            <div className="socorrista-badges">
                                <strong className={s.activo ? "estado activa" : "estado inactiva"}>
                                    {s.activo ? "Activo" : "Inactivo"}
                                </strong>
                                <strong className="tipo">SOCORRISTA</strong>
                            </div>
                        </div>

                        <div className="socorrista-actions">
                            <button onClick={() => abrirEditar(s)}>Editar</button>
                            <button onClick={() => abrirPassword(s)}>Contraseña</button>
                            {s.activo ? (
                                <button className="danger" onClick={() => desactivarSocorrista(s)}>
                                    Desactivar
                                </button>
                            ) : (
                                <button
                                    style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }}
                                    onClick={() => activarSocorrista(s)}
                                >
                                    Activar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {socorristasFiltrados.length === 0 && (
                <div className="empty-state">No se han encontrado socorristas.</div>
            )}

            {(modalCrear || modalEditar) && (
                <div className="modal-backdrop">
                    <div className="modal modal-large">
                        <h2>{modalCrear ? "Nuevo socorrista" : "Editar socorrista"}</h2>
                        <p>{modalCrear ? "Da de alta un nuevo socorrista." : "Modifica los datos del socorrista."}</p>

                        {modalEditar && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                {fotoPreview ? (
                                    <img src={fotoPreview} alt="preview" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }} />
                                ) : (
                                    <AvatarUsuario usuario={socorristaSeleccionado} size={72} />
                                )}
                                <input
                                    ref={fotoInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const f = e.target.files[0];
                                        if (!f) return;
                                        const err = validarFoto(f);
                                        if (err) { setErrorFoto(err); return; }
                                        setErrorFoto("");
                                        setFotoFile(f);
                                        setFotoPreview(URL.createObjectURL(f));
                                    }}
                                />
                                <button
                                    type="button"
                                    className="modal-cancel"
                                    style={{ fontSize: 12, padding: "5px 12px", height: "auto" }}
                                    onClick={() => fotoInputRef.current?.click()}
                                >
                                    Cambiar foto
                                </button>
                                {errorFoto ? (
                                    <div style={{ marginTop: 4, padding: "7px 10px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, color: "#dc2626", fontSize: 12, display: "flex", alignItems: "flex-start", gap: 5, maxWidth: 260, textAlign: "left" }}>
                                        <span>⚠️</span>
                                        <div>
                                            <strong>Error:</strong> {errorFoto}
                                            <br />
                                            <span style={{ color: "#ef4444", fontSize: 11 }}>JPG, PNG, WebP · Máximo: 5MB</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>JPG, PNG o WebP · Máximo 5MB</p>
                                )}
                            </div>
                        )}

                        <label className="file-label">Nombre</label>
                        <input value={form.nombre} onChange={(e) => { setForm({ ...form, nombre: e.target.value }); setError(""); }} />

                        <label className="file-label">Apellidos</label>
                        <input value={form.apellidos} onChange={(e) => { setForm({ ...form, apellidos: e.target.value }); setError(""); }} />

                        <label className="file-label">Email</label>
                        <input type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }} />

                        <label className="file-label">Teléfono</label>
                        <input value={form.telefono} onChange={(e) => { setForm({ ...form, telefono: e.target.value }); setError(""); }} />

                        {modalCrear && (
                            <>
                                <label className="file-label">Contraseña</label>
                                <input type="password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }} />
                            </>
                        )}

                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={form.activo}
                                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                            />
                            Usuario activo
                        </label>

                        {error && <div className="form-error">{error}</div>}

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => { setModalCrear(false); setModalEditar(false); }} disabled={guardando}>
                                Cancelar
                            </button>

                            <button className="modal-save" onClick={modalCrear ? crearSocorrista : editarSocorrista} disabled={guardando}>
                                {guardando ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalPassword && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>Cambiar contraseña</h2>
                        <p>{socorristaSeleccionado?.nombre} {socorristaSeleccionado?.apellidos}</p>

                        <label className="file-label">Nueva contraseña</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={mostrarPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
                                style={{ width: "100%", paddingRight: 40, boxSizing: "border-box" }}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarPassword(v => !v)}
                                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#64748b", padding: 0 }}
                                tabIndex={-1}
                            >
                                {mostrarPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setModalPassword(false)} disabled={guardando}>
                                Cancelar
                            </button>

                            <button className="modal-save" onClick={cambiarPassword} disabled={guardando}>
                                {guardando ? "Guardando..." : "Cambiar contraseña"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SocorristasGlobalSection;