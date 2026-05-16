import { getFileUrl } from "../../config";

function AvatarUsuario({ usuario, size = 48 }) {
  const fotoUrl = usuario?.fotoPerfil ? getFileUrl(usuario.fotoPerfil) : null;

  const inicial = (usuario?.nombre || "?").charAt(0).toUpperCase();

  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={usuario.nombre}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #e2e8f0",
          flexShrink: 0,
        }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {inicial}
    </div>
  );
}

export default AvatarUsuario;
