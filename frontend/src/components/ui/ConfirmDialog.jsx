/**
 * Diálogo de confirmación genérico.
 * variante del botón de confirmar: "danger" | "save"
 */
function ConfirmDialog({
  mensaje,
  onConfirmar,
  onCancelar,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  variante = "danger",
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal modal-sm">
        <p className="confirm-message">{mensaje}</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button className={`modal-${variante}`} onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
