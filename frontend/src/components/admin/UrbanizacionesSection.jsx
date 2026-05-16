import { useState } from "react";
import UrbanizacionModal from "./UrbanizacionModal";
import GestionUrbanizacion from "./urbanizacion/GestionUrbanizacion";

const HOUSE_ICON = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
    </svg>
);

const BUILDING_ICON = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="1"/>
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
    </svg>
);

function UrbanizacionesSection({ urbanizaciones, busqueda, recargarUrbanizaciones, mostrarMensaje }) {
    const [urbEditar, setUrbEditar] = useState(null);
    const [urbGestionar, setUrbGestionar] = useState(null);

    const texto = busqueda.trim().toLowerCase();

    const filtradas = urbanizaciones.filter((u) =>
        u.nombre?.toLowerCase().includes(texto) ||
        u.municipioNombre?.toLowerCase().includes(texto) ||
        u.provinciaNombre?.toLowerCase().includes(texto) ||
        u.comunidadAutonomaNombre?.toLowerCase().includes(texto) ||
        u.tipoUrbanizacion?.toLowerCase().includes(texto)
    );

    if (urbGestionar) {
        return (
            <GestionUrbanizacion
                urbanizacion={urbGestionar}
                onVolver={() => { setUrbGestionar(null); recargarUrbanizaciones?.(); }}
                mostrarMensaje={mostrarMensaje}
            />
        );
    }

    if (filtradas.length === 0) {
        return <div className="empty-state">No se han encontrado urbanizaciones.</div>;
    }

    return (
        <>
            <div className="urb-grid">
                {filtradas.map((u) => {
                    const esBloques = u.tipoUrbanizacion === "BLOQUES";
                    return (
                        <div
                            key={u.id}
                            className="urb-card urb-card-clickable"
                            onClick={() => setUrbGestionar(u)}
                        >
                            <div className={`urb-icon-wrap ${esBloques ? "urb-icon-purple" : "urb-icon-blue"}`}>
                                <span className="urb-icon-svg">
                                    {esBloques ? BUILDING_ICON : HOUSE_ICON}
                                </span>
                            </div>

                            <div className="urb-body">
                                <h3 className="urb-nombre">{u.nombre}</h3>

                                <p className="urb-lugar">
                                    {u.municipioNombre || "Municipio no indicado"}
                                    {u.provinciaNombre ? ` · ${u.provinciaNombre}` : ""}
                                </p>

                                {u.direccion && (
                                    <p className="urb-direccion">{u.direccion}</p>
                                )}

                                <div className="urb-badges">
                                    <span className={`urb-badge ${esBloques ? "urb-badge-purple" : "urb-badge-blue"}`}>
                                        {u.tipoUrbanizacion || "—"}
                                    </span>
                                    <span className={`urb-badge ${u.activa ? "urb-badge-green" : "urb-badge-red"}`}>
                                        {u.activa ? "Activa" : "Inactiva"}
                                    </span>
                                </div>
                            </div>

                            <div className="urb-card-actions">
                                <button
                                    className="urb-gestionar-btn"
                                    onClick={(e) => { e.stopPropagation(); setUrbGestionar(u); }}
                                >
                                    Gestionar
                                </button>
                                <button
                                    className="urb-edit-btn-inline"
                                    onClick={(e) => { e.stopPropagation(); setUrbEditar(u); }}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {urbEditar && (
                <UrbanizacionModal
                    urbanizacion={urbEditar}
                    cerrar={() => setUrbEditar(null)}
                    recargarUrbanizaciones={recargarUrbanizaciones}
                    mostrarMensaje={mostrarMensaje}
                />
            )}
        </>
    );
}

export default UrbanizacionesSection;
