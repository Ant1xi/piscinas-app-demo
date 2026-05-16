function EmptyState({ titulo = "Sin resultados", descripcion = "" }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">○</div>
      <h3>{titulo}</h3>
      {descripcion && <p>{descripcion}</p>}
    </div>
  );
}

export default EmptyState;
