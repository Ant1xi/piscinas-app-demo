function Spinner({ texto = "Cargando..." }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
      {texto && <span>{texto}</span>}
    </div>
  );
}

export default Spinner;
