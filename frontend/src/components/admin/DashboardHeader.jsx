function DashboardHeader({
    titulo,
    busqueda,
    setBusqueda,
    placeholder,
    sinBusqueda,
    botonSecundarioTexto,
    onBotonSecundario,
    botonPrincipalTexto,
    onBotonPrincipal
}) {
    const fecha = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="header">
            <div>
                <h1>{titulo}</h1>
                <span>{fecha}</span>
            </div>

            <div className="actions">
                {!sinBusqueda && (
                    <input
                        placeholder={placeholder}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                )}

                {botonSecundarioTexto && (
                    <button className="secondary" onClick={onBotonSecundario}>
                        {botonSecundarioTexto}
                    </button>
                )}

                {botonPrincipalTexto && (
                    <button className="primary" onClick={onBotonPrincipal}>
                        {botonPrincipalTexto}
                    </button>
                )}
            </div>
        </div>
    );
}

export default DashboardHeader;