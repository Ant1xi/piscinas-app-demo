/**
 * Badge de color semántico para mostrar estados y prioridades.
 * variante: "success" | "warning" | "danger" | "primary" | "default"
 */
function Badge({ texto, variante = "default" }) {
  return (
    <span className={`badge badge-${variante}`}>
      {texto}
    </span>
  );
}

export default Badge;
