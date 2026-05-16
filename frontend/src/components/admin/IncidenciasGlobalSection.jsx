const PRIORIDAD_COLOR = {
    ALTA:    "#ef4444",
    URGENTE: "#ef4444",
    MEDIA:   "#f59e0b",
    BAJA:    "#3b82f6",
};

function formatFecha(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function KanbanColumn({ titulo, items, colorScheme, children }) {
    return (
        <div className="kanban-col">
            <div className={`kanban-col-header ${colorScheme}`}>
                <span className="kanban-col-title">{titulo}</span>
                <span className={`kanban-col-badge ${colorScheme}`}>{items.length}</span>
            </div>

            <div className="kanban-col-body">
                {items.length === 0 ? (
                    <div className="kanban-empty">Sin incidencias</div>
                ) : (
                    items.map(i => children(i))
                )}
            </div>
        </div>
    );
}

function IncidenciaCard({ i, onRevision, onCerrar, puedeGestionar }) {
    const borderColor = PRIORIDAD_COLOR[i.prioridad] ?? "#94a3b8";
    return (
        <div className="kanban-card" style={{ borderLeftColor: borderColor }}>
            <div className="kanban-card-tipo">{i.tipo} · {i.categoria}</div>
            <p className="kanban-card-desc">{i.descripcion}</p>
            <div className="kanban-card-meta">
                <span>{i.piscinaNombre || "—"}</span>
                <span>{formatFecha(i.createdAt)}</span>
            </div>
            {puedeGestionar && (
                <div className="kanban-card-actions">
                    {i.estado === "ABIERTA" && (
                        <button className="kanban-btn-revision" onClick={() => onRevision(i)}>
                            Poner en revisión
                        </button>
                    )}
                    {i.estado === "EN_REVISION" && (
                        <button className="kanban-btn-cerrar" onClick={() => onCerrar(i)}>
                            Cerrar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function IncidenciasGlobalSection({ incidencias }) {
    const abiertas   = incidencias.filter(i => i.estado === "ABIERTA");
    const revision   = incidencias.filter(i => i.estado === "EN_REVISION");
    const cerradas   = incidencias.filter(i => i.estado === "CERRADA");

    return (
        <div className="kanban-board">
            <KanbanColumn titulo="ABIERTAS" items={abiertas} colorScheme="col-rojo">
                {i => <IncidenciaCard key={i.id} i={i} puedeGestionar={false} />}
            </KanbanColumn>

            <KanbanColumn titulo="EN REVISIÓN" items={revision} colorScheme="col-ambar">
                {i => <IncidenciaCard key={i.id} i={i} puedeGestionar={false} />}
            </KanbanColumn>

            <KanbanColumn titulo="CERRADAS" items={cerradas} colorScheme="col-verde">
                {i => <IncidenciaCard key={i.id} i={i} puedeGestionar={false} />}
            </KanbanColumn>
        </div>
    );
}

export default IncidenciasGlobalSection;
