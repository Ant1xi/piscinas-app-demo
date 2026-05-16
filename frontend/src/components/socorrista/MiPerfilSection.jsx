// Perfil personal del socorrista.
// Muestra datos del usuario, permite cambiar la foto de perfil
// y lista las piscinas asignadas.
import { useEffect, useRef, useState } from "react";
import AvatarUsuario from "../ui/AvatarUsuario";
import api from "../../api/axiosConfig";
import { getMisPiscinas } from "../../api/piscinaApi";

function MiPerfilSection({ onFotoActualizada }) {
  const usuarioId = localStorage.getItem("usuarioId");
  const nombre = localStorage.getItem("nombre") || "";
  const apellidos = localStorage.getItem("apellidos") || "";

  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [piscinas, setPiscinas] = useState([]);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [errorFoto, setErrorFoto] = useState("");
  const [subiendoFoto, setSubiendoFoto] = useState(false);
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

  useEffect(() => {
    cargarPerfil();
    cargarPiscinas();
  }, []);

  const cargarPerfil = async () => {
    try {
      const res = await api.get(`/usuarios/${usuarioId}`);
      setPerfilUsuario(res.data);
      if (res.data.fotoPerfil) {
        localStorage.setItem("fotoPerfil", res.data.fotoPerfil);
      }
    } catch {
      // silently fail
    }
  };

  const cargarPiscinas = async () => {
    try {
      const res = await getMisPiscinas();
      setPiscinas(res.data);
    } catch {
      // silently fail
    }
  };

  const subirFotoPerfil = async () => {
    if (!fotoFile) return;
    setSubiendoFoto(true);
    try {
      const formData = new FormData();
      formData.append("file", fotoFile);
      const res = await api.post(`/usuarios/${usuarioId}/foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setPerfilUsuario(res.data);
      localStorage.setItem("fotoPerfil", res.data.fotoPerfil);
      onFotoActualizada?.(res.data.fotoPerfil);
      setFotoFile(null);
      setFotoPreview(null);
    } catch (error) {
      const msg = error.response?.data?.message || "Error al subir la foto. Intenta con una imagen más pequeña.";
      alert(msg);
    } finally {
      setSubiendoFoto(false);
    }
  };

  return (
    <div className="perfil-wrapper">
      <div className="perfil-foto-container">
        {fotoPreview ? (
          <img
            src={fotoPreview}
            alt="preview"
            style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }}
          />
        ) : (
          <AvatarUsuario
            usuario={perfilUsuario || { nombre, fotoPerfil: localStorage.getItem("fotoPerfil") }}
            size={96}
          />
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
        {fotoFile ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="soc-perfil-btn-secondary"
              onClick={() => { setFotoFile(null); setFotoPreview(null); setErrorFoto(""); }}
            >
              Cancelar
            </button>
            <button
              className="soc-perfil-btn-primary"
              onClick={subirFotoPerfil}
              disabled={subiendoFoto}
            >
              {subiendoFoto ? "Subiendo..." : "Confirmar foto"}
            </button>
          </div>
        ) : (
          <>
            <button className="soc-perfil-btn-secondary" onClick={() => fotoInputRef.current?.click()}>
              Cambiar foto
            </button>
            {errorFoto ? (
              <div style={{ marginTop: 6, padding: "8px 12px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, color: "#dc2626", fontSize: 13, display: "flex", alignItems: "flex-start", gap: 6, maxWidth: 280, textAlign: "left" }}>
                <span>⚠️</span>
                <div>
                  <strong>Error en la imagen:</strong> {errorFoto}
                  <br />
                  <span style={{ color: "#ef4444", fontSize: 12 }}>Formatos aceptados: JPG, PNG, WebP · Máximo: 5MB</span>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, textAlign: "center" }}>
                JPG, PNG o WebP · Máximo 5MB
              </p>
            )}
          </>
        )}
      </div>

      <div className="perfil-datos">
        <div className="perfil-dato-card">
          <span>Nombre completo</span>
          <strong>{perfilUsuario?.nombre || nombre} {perfilUsuario?.apellidos || apellidos}</strong>
        </div>
        <div className="perfil-dato-card">
          <span>Email</span>
          <strong>{perfilUsuario?.email || localStorage.getItem("email") || "—"}</strong>
        </div>
        <div className="perfil-dato-card">
          <span>Teléfono</span>
          <strong>{perfilUsuario?.telefono || "No indicado"}</strong>
        </div>
        <div className="perfil-dato-card">
          <span>Rol</span>
          <strong style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <em style={{ background: "#eff6ff", color: "#2563eb", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700, fontStyle: "normal" }}>
              SOCORRISTA
            </em>
          </strong>
        </div>
        <div className="perfil-dato-card">
          <span>Estado</span>
          <strong>
            <em style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700, fontStyle: "normal" }}>
              Activo
            </em>
          </strong>
        </div>

        {piscinas.length > 0 && (
          <div style={{ marginTop: 6 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
              Piscinas asignadas
            </p>
            {piscinas.map((p) => (
              <div key={p.id || p.piscinaId} className="perfil-dato-card" style={{ marginBottom: 8 }}>
                <strong>{p.nombre || p.piscinaNombre}</strong>
                <span style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {p.horaApertura || "--:--"} – {p.horaCierre || "--:--"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MiPerfilSection;
