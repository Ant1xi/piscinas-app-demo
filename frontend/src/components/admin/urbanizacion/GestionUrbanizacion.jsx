import { useState } from "react";
import GestionCalles from "./GestionCalles";
import GestionBloques from "./GestionBloques";
import GestionViviendas from "./GestionViviendas";
import GestionVecinos from "./GestionVecinos";

function GestionUrbanizacion({ urbanizacion, onVolver, mostrarMensaje }) {
    const [vista, setVista] = useState("lista");
    const [estructura, setEstructura] = useState(null);
    const [vivienda, setVivienda] = useState(null);

    const esBloques = urbanizacion.tipoUrbanizacion === "BLOQUES";

    const irAViviendas = (id, label) => {
        setEstructura({ id, label });
        setVista("viviendas");
    };

    const irAVecinos = (id, label) => {
        setVivienda({ id, label });
        setVista("vecinos");
    };

    const volverALista = () => {
        setVista("lista");
        setEstructura(null);
        setVivienda(null);
    };

    const volverAViviendas = () => {
        setVista("viviendas");
        setVivienda(null);
    };

    const handleVolver = () => {
        if (vista === "lista") onVolver();
        else if (vista === "viviendas") volverALista();
        else volverAViviendas();
    };

    const volverLabel =
        vista === "lista" ? "Urbanizaciones"
        : vista === "viviendas" ? (esBloques ? "Bloques" : "Calles")
        : estructura?.label ?? "Viviendas";

    return (
        <div className="gestion-panel">
            <div className="gestion-header">
                <button className="gestion-back-btn" onClick={handleVolver}>
                    ← {volverLabel}
                </button>
                <div className="gestion-header-info">
                    <h2>{urbanizacion.nombre}</h2>
                    <span>
                        {urbanizacion.municipioNombre || ""}
                        {urbanizacion.provinciaNombre ? ` · ${urbanizacion.provinciaNombre}` : ""}
                    </span>
                </div>
            </div>

            {vista !== "lista" && (
                <div className="gestion-breadcrumb">
                    <button onClick={volverALista}>
                        {esBloques ? "Bloques" : "Calles"}
                    </button>
                    {estructura && (
                        <>
                            <span className="gestion-bc-sep">›</span>
                            {vista === "vecinos" ? (
                                <button onClick={volverAViviendas}>{estructura.label}</button>
                            ) : (
                                <span className="gestion-bc-current">{estructura.label}</span>
                            )}
                        </>
                    )}
                    {vivienda && vista === "vecinos" && (
                        <>
                            <span className="gestion-bc-sep">›</span>
                            <span className="gestion-bc-current">{vivienda.label}</span>
                        </>
                    )}
                </div>
            )}

            {vista === "lista" && (
                esBloques
                    ? <GestionBloques
                        urbanizacionId={urbanizacion.id}
                        onSelectBloque={irAViviendas}
                        mostrarMensaje={mostrarMensaje}
                      />
                    : <GestionCalles
                        urbanizacionId={urbanizacion.id}
                        onSelectCalle={irAViviendas}
                        mostrarMensaje={mostrarMensaje}
                      />
            )}

            {vista === "viviendas" && estructura && (
                <GestionViviendas
                    urbanizacionId={urbanizacion.id}
                    estructuraId={estructura.id}
                    esBloques={esBloques}
                    onSelectVivienda={irAVecinos}
                    mostrarMensaje={mostrarMensaje}
                />
            )}

            {vista === "vecinos" && vivienda && (
                <GestionVecinos
                    viviendaId={vivienda.id}
                    viviendaLabel={vivienda.label}
                    mostrarMensaje={mostrarMensaje}
                />
            )}
        </div>
    );
}

export default GestionUrbanizacion;
