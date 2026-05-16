import { useEffect, useRef, useState } from "react";
import api from "../../api/axiosConfig";
import { getFileUrl } from "../../config";

const usuarioId = () => localStorage.getItem("usuarioId");

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function formatearMiembroDesde(createdAt) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  return `Miembro desde ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function formatearFechaLog(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

const IcoPiscina = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12c2-4 4-6 6-6s4 4 6 4 4-4 6-4"/>
    <path d="M2 18c2-4 4-6 6-6s4 4 6 4 4-4 6-4"/>
  </svg>
);
const IcoPersona = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoEdificio = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2"/>
    <path d="M8 3v18M16 3v18M2 9h20M2 15h20"/>
  </svg>
);
const IcoGrupo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

function ModalPassword({ cerrar, mostrarMensaje }) {
  const [form, setForm] = useState({ passwordActual: "", nuevaPassword: "", confirmar: "" });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    if (!form.passwordActual || !form.nuevaPassword || !form.confirmar) {
      setError("Todos los campos son obligatorios."); return;
    }
    if (form.nuevaPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres."); return;
    }
    if (form.nuevaPassword !== form.confirmar) {
      setError("Las contraseñas nuevas no coinciden."); return;
    }
    setGuardando(true);
    try {
      await api.patch(`/usuarios/${usuarioId()}/password`, {
        passwordActual: form.passwordActual,
        nuevaPassword: form.nuevaPassword,
      });
      mostrarMensaje("success", "Contraseña actualizada correctamente");
      cerrar();
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.mensaje || "Error al cambiar la contraseña");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={cerrar}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <h2>Cambiar contraseña</h2>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label className="file-label">Contraseña actual</label>
          <input type="password" value={form.passwordActual}
            onChange={e => { setForm(f => ({ ...f, passwordActual: e.target.value })); setError(""); }} />
        </div>
        <div className="form-group">
          <label className="file-label">Nueva contraseña</label>
          <input type="password" value={form.nuevaPassword}
            onChange={e => { setForm(f => ({ ...f, nuevaPassword: e.target.value })); setError(""); }} />
        </div>
        <div className="form-group">
          <label className="file-label">Confirmar nueva contraseña</label>
          <input type="password" value={form.confirmar}
            onChange={e => { setForm(f => ({ ...f, confirmar: e.target.value })); setError(""); }} />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-actions">
          <button className="modal-cancel" onClick={cerrar} disabled={guardando}>Cancelar</button>
          <button className="modal-confirm" onClick={guardar} disabled={guardando}>
            {guardando ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </div>
      </div>
    </div>
  );
}

function calcularTemporadaActiva() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();
  const enTemporada = mes >= 4 && mes <= 9;
  return {
    texto: `Mayo — Octubre ${anio}`,
    enTemporada,
    estado: enTemporada ? "En curso" : "Fuera de temporada",
  };
}

function PerfilSection({ mostrarMensaje }) {
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState({ piscinas: 0, socorristas: 0, urbanizaciones: 0, vecinos: 0 });
  const [logs, setLogs] = useState([]);
  const [modalPassword, setModalPassword] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [horaCierre, setHoraCierre] = useState("23");
  const [minutoCierre, setMinutoCierre] = useState("59");
  const [editandoCierre, setEditandoCierre] = useState(false);
  const [guardandoCierre, setGuardandoCierre] = useState(false);
  const [editando, setEditando] = useState(false);
  const inputFotoRef = useRef(null);

  const email = localStorage.getItem("email") || "";
  const rol = localStorage.getItem("rol") || "ADMIN";
  const fotoPerfil = localStorage.getItem("fotoPerfil") || "";

  const [form, setForm] = useState({
    nombre: localStorage.getItem("nombre") || "Administrador",
    apellidos: localStorage.getItem("apellidos") || "",
    telefono: "",
  });

  useEffect(() => {
    const uid = usuarioId();
    if (uid) {
      api.get(`/usuarios/${uid}`).then(r => {
        setUsuario(r.data);
        setForm(f => ({ ...f, telefono: r.data.telefono || "" }));
      }).catch(() => {});
    }
    Promise.all([
      api.get("/piscinas").catch(() => ({ data: [] })),
      api.get("/usuarios").catch(() => ({ data: [] })),
      api.get("/urbanizaciones").catch(() => ({ data: [] })),
      api.get("/personas").catch(() => ({ data: [] })),
    ]).then(([p, s, u, v]) => {
      setStats({
        piscinas: p.data.length,
        socorristas: s.data.filter(u => u.rol === 'SOCORRISTA').length,
        urbanizaciones: u.data.length,
        vecinos: v.data.length,
      });
    });
    api.get("/audit-log?page=0&size=5").then(r => setLogs(r.data.content || [])).catch(() => {});
    Promise.all([
      api.get("/configuracion/cierre_automatico_hora").catch(() => ({ data: { valor: "23" } })),
      api.get("/configuracion/cierre_automatico_minuto").catch(() => ({ data: { valor: "59" } })),
    ]).then(([h, m]) => {
      setHoraCierre(h.data.valor || "23");
      setMinutoCierre(m.data.valor || "59");
    });
  }, []);

  const guardarDatos = async () => {
    if (!form.nombre.trim() || !form.apellidos.trim()) {
      mostrarMensaje("error", "Nombre y apellidos son obligatorios."); return;
    }
    try {
      const res = await api.put(`/usuarios/${usuarioId()}`, {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        telefono: form.telefono.trim() || null,
        email,
        activo: true,
        rol,
      });
      localStorage.setItem("nombre", form.nombre.trim());
      localStorage.setItem("apellidos", form.apellidos.trim());
      setForm(f => ({ ...f, nombre: form.nombre.trim(), apellidos: form.apellidos.trim() }));
      setUsuario(u => ({ ...u, ...res.data }));
      mostrarMensaje("success", "Datos actualizados correctamente");
      setEditando(false);
    } catch (e) {
      mostrarMensaje("error", e.response?.data?.message || e.response?.data?.mensaje || "Error al guardar");
    }
  };

  const cancelarEdicion = () => {
    setForm(f => ({
      ...f,
      nombre: localStorage.getItem("nombre") || "Administrador",
      apellidos: localStorage.getItem("apellidos") || "",
      telefono: usuario?.telefono || "",
    }));
    setEditando(false);
  };

  const guardarCierre = async () => {
    setGuardandoCierre(true);
    try {
      await Promise.all([
        api.put("/configuracion/cierre_automatico_hora", { valor: horaCierre }),
        api.put("/configuracion/cierre_automatico_minuto", { valor: minutoCierre }),
      ]);
      mostrarMensaje("success", "Hora de cierre actualizada");
      setEditandoCierre(false);
    } catch {
      mostrarMensaje("error", "No se pudo guardar la hora de cierre");
    } finally {
      setGuardandoCierre(false);
    }
  };

  const obtenerImagen = (ruta) => {
    if (!ruta) return null;
    if (ruta.startsWith("http")) return ruta;
    return getFileUrl(ruta);
  };

  const fotoActual = usuario?.fotoPerfil ? obtenerImagen(usuario.fotoPerfil) : obtenerImagen(fotoPerfil);
  const inicial = (form.nombre?.[0] || "A").toUpperCase();

  const subirFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { mostrarMensaje("error", "La imagen no puede superar 5MB."); return; }
    const tipos = ["image/jpeg", "image/png", "image/webp"];
    if (!tipos.includes(file.type)) { mostrarMensaje("error", "Solo se aceptan JPG, PNG o WebP."); return; }
    setSubiendoFoto(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post(`/usuarios/${usuarioId()}/foto`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      localStorage.setItem("fotoPerfil", res.data.fotoPerfil || "");
      setUsuario(u => ({ ...u, fotoPerfil: res.data.fotoPerfil }));
      mostrarMensaje("success", "Foto actualizada correctamente");
    } catch {
      mostrarMensaje("error", "No se pudo subir la foto");
    } finally {
      setSubiendoFoto(false);
    }
  };

  const badgeLog = (accion) => {
    const a = (accion || "").toLowerCase();
    if (a === "entrada") return "entrada";
    if (a === "salida") return "salida";
    if (a === "salida_automatica") return "salida_automatica";
    return "otro";
  };

  return (
    <div className="perfil-layout">
      {/* ─── COLUMNA IZQUIERDA ─── */}
      <div className="perfil-columna-izq">
        <div className="perfil-card">
          <div className="perfil-foto-wrapper">
            {fotoActual
              ? <img src={fotoActual} alt="Foto de perfil" className="perfil-foto" />
              : <div className="perfil-foto-inicial">{inicial}</div>
            }
            {subiendoFoto && <div className="perfil-foto-overlay">...</div>}
          </div>

          <input
            ref={inputFotoRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={subirFoto}
          />
          <button
            className="perfil-btn-foto"
            onClick={() => inputFotoRef.current?.click()}
            disabled={subiendoFoto}
          >
            {subiendoFoto ? "Subiendo..." : "Cambiar foto"}
          </button>

          <div className="perfil-identidad">
            <strong className="perfil-nombre">{form.nombre} {form.apellidos}</strong>
            <span className="perfil-rol-badge">{rol}</span>
            {usuario?.createdAt && (
              <span className="perfil-miembro">{formatearMiembroDesde(usuario.createdAt)}</span>
            )}
          </div>
        </div>

        {/* Datos personales con edición inline */}
        <div className={`perfil-datos-card${editando ? " editando" : ""}`}>
          <div className="perfil-datos-header">
            <h3>{editando ? "Editar datos" : "Datos personales"}</h3>
            {!editando && (
              <button onClick={() => setEditando(true)} className="btn-editar-perfil">
                ✏️ Editar
              </button>
            )}
          </div>

          {editando ? (
            <>
              <div className="perfil-dato-fila">
                <label>Nombre</label>
                <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div className="perfil-dato-fila">
                <label>Apellidos</label>
                <input value={form.apellidos} onChange={e => setForm(f => ({ ...f, apellidos: e.target.value }))} />
              </div>
              <div className="perfil-dato-fila">
                <label>Teléfono</label>
                <input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
              </div>
              <div className="perfil-dato-fila">
                <label>Email</label>
                <input value={email} disabled style={{ opacity: 0.5 }} />
                <small>El email no se puede cambiar</small>
              </div>
              <div className="perfil-dato-acciones">
                <button onClick={guardarDatos} className="btn-guardar">Guardar cambios</button>
                <button onClick={cancelarEdicion} className="btn-cancelar">Cancelar</button>
              </div>
            </>
          ) : (
            <>
              <div className="perfil-dato-fila">
                <span className="dato-label">Nombre completo</span>
                <span className="dato-valor">{form.nombre} {form.apellidos}</span>
              </div>
              <div className="perfil-dato-fila">
                <span className="dato-label">Email</span>
                <span className="dato-valor">{email}</span>
              </div>
              <div className="perfil-dato-fila">
                <span className="dato-label">Teléfono</span>
                <span className="dato-valor">{form.telefono || "—"}</span>
              </div>
              <div className="perfil-dato-fila">
                <span className="dato-label">Miembro desde</span>
                <span className="dato-valor">{formatearMiembroDesde(usuario?.createdAt)}</span>
              </div>
            </>
          )}
        </div>

        <button className="perfil-btn-password" onClick={() => setModalPassword(true)}>
          Cambiar contraseña
        </button>
      </div>

      {/* ─── COLUMNA DERECHA ─── */}
      <div className="perfil-columna-der">
        <div className="perfil-stats-grid">
          <div className="perfil-stat-card azul">
            <IcoPiscina />
            <strong>{stats.piscinas}</strong>
            <span>Piscinas</span>
          </div>
          <div className="perfil-stat-card verde">
            <IcoPersona />
            <strong>{stats.socorristas}</strong>
            <span>Socorristas</span>
          </div>
          <div className="perfil-stat-card morado">
            <IcoEdificio />
            <strong>{stats.urbanizaciones}</strong>
            <span>Urbanizaciones</span>
          </div>
          <div className="perfil-stat-card naranja">
            <IcoGrupo />
            <strong>{stats.vecinos}</strong>
            <span>Vecinos registrados</span>
          </div>
        </div>

        <div className="perfil-actividad">
          <h3>Actividad reciente del sistema</h3>
          {logs.length === 0 && <p className="perfil-empty">Sin actividad registrada.</p>}
          {logs.map(log => (
            <div key={log.id} className="actividad-item">
              <div className={`actividad-badge ${badgeLog(log.accion)}`}>
                {log.accion}
              </div>
              <div className="actividad-info">
                <span>{log.detalle || log.entidad}</span>
                <small>{formatearFechaLog(log.createdAt || log.fecha)}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="perfil-config">
          <h3>Configuración del sistema</h3>
          <div className="config-item">
            <div className="config-info">
              <strong>Cierre automático nocturno</strong>
              <span>Todos los accesos abiertos se cierran automáticamente a esta hora cada día</span>
            </div>
            <div className="config-valor">
              {editandoCierre ? (
                <>
                  <input
                    type="time"
                    value={`${horaCierre.padStart(2,"0")}:${minutoCierre.padStart(2,"0")}`}
                    onChange={e => {
                      const [h, m] = e.target.value.split(":");
                      setHoraCierre(h);
                      setMinutoCierre(m);
                    }}
                    className="config-time-input"
                  />
                  <button className="config-btn-save" onClick={guardarCierre} disabled={guardandoCierre}>
                    {guardandoCierre ? "..." : "Guardar"}
                  </button>
                  <button className="config-btn-cancel" onClick={() => setEditandoCierre(false)}>✕</button>
                </>
              ) : (
                <>
                  <span className="config-hora">{horaCierre.padStart(2,"0")}:{minutoCierre.padStart(2,"0")}</span>
                  <span className="config-badge">Activo</span>
                  <button className="config-btn-edit" onClick={() => setEditandoCierre(true)} title="Editar hora">✏️</button>
                </>
              )}
            </div>
          </div>
          {(() => {
            const t = calcularTemporadaActiva();
            return (
              <div className="config-item">
                <div className="config-info">
                  <strong>Temporada activa</strong>
                  <span>{t.texto}</span>
                </div>
                <div className="config-valor">
                  <span className={`config-badge${t.enTemporada ? " activa" : ""}`}>{t.estado}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {modalPassword && (
        <ModalPassword
          cerrar={() => setModalPassword(false)}
          mostrarMensaje={mostrarMensaje}
        />
      )}
    </div>
  );
}

export default PerfilSection;
