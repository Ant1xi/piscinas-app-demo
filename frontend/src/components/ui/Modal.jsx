/**
 * Wrapper de modal genérico con backdrop, animación de entrada y cierre al hacer click fuera.
 * tamano: "" | "large" | "sm"
 */
function Modal({ titulo, subtitulo, cerrar, children, tamano = "" }) {
  return (
    <div className="modal-backdrop" onClick={cerrar}>
      <div
        className={`modal ${tamano ? `modal-${tamano}` : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && <h2>{titulo}</h2>}
        {subtitulo && <p>{subtitulo}</p>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
