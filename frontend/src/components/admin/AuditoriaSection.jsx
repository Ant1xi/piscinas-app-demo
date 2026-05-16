import { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosConfig";

const ACCIONES = ["LOGIN", "ENTRADA", "SALIDA", "CREAR", "EDITAR", "CERRAR"];
const ENTIDADES = ["Acceso", "Incidencia", "Usuario", "TurnoPiscina"];

const BADGE_COLOR = {
    LOGIN:   { bg: "#dbeafe", color: "#1d4ed8" },
    ENTRADA: { bg: "#dcfce7", color: "#15803d" },
    SALIDA:  { bg: "#ffedd5", color: "#c2410c" },
    CREAR:   { bg: "#ede9fe", color: "#7c3aed" },
    EDITAR:  { bg: "#f3f4f6", color: "#374151" },
    CERRAR:  { bg: "#fee2e2", color: "#b91c1c" },
};

function formatFecha(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function exportCSV(rows) {
    const header = ["Fecha/Hora", "Email", "Acción", "Entidad", "Entidad ID", "Detalle", "IP"];
    const lines = rows.map(r => [
        formatFecha(r.createdAt),
        r.usuarioEmail ?? "",
        r.accion,
        r.entidad,
        r.entidadId ?? "",
        (r.detalle ?? "").replace(/,/g, ";"),
        r.ip ?? "",
    ].map(v => `"${v}"`).join(","));
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function AuditoriaSection() {
    const [search,  setSearch]  = useState("");
    const [accion,  setAccion]  = useState("");
    const [entidad, setEntidad] = useState("");
    const [desde,   setDesde]   = useState("");
    const [hasta,   setHasta]   = useState("");

    const [page,       setPage]       = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [logs,       setLogs]       = useState([]);
    const [loading,    setLoading]    = useState(false);
    const [error,      setError]      = useState(null);

    const PAGE_SIZE = 50;

    const cargar = useCallback(async (p = 0) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page: p, size: PAGE_SIZE });
            if (search)  params.set("search",  search);
            if (accion)  params.set("accion",  accion);
            if (entidad) params.set("entidad", entidad);
            if (desde)   params.set("desde",   desde + "T00:00:00");
            if (hasta)   params.set("hasta",   hasta + "T23:59:59");

            const res = await api.get(`/audit-log?${params}`);
            setLogs(res.data.content ?? []);
            setTotalPages(res.data.totalPages ?? 0);
            setTotalItems(res.data.totalElements ?? 0);
            setPage(p);
        } catch {
            setError("No se pudieron cargar los registros de auditoría.");
        } finally {
            setLoading(false);
        }
    }, [search, accion, entidad, desde, hasta]);

    useEffect(() => { cargar(0); }, [cargar]);

    const inicio = page * PAGE_SIZE + 1;
    const fin    = Math.min((page + 1) * PAGE_SIZE, totalItems);

    return (
        <div className="auditoria-section">
            {/* Filtros */}
            <div className="auditoria-filters">
                <input
                    className="auditoria-input"
                    type="text"
                    placeholder="Buscar por usuario o acción…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select className="auditoria-select" value={accion} onChange={e => setAccion(e.target.value)}>
                    <option value="">Todas las acciones</option>
                    {ACCIONES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                <select className="auditoria-select" value={entidad} onChange={e => setEntidad(e.target.value)}>
                    <option value="">Todas las entidades</option>
                    {ENTIDADES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>

                <div className="auditoria-dates">
                    <label>Desde</label>
                    <input type="date" className="auditoria-input" value={desde} onChange={e => setDesde(e.target.value)} />
                    <label>Hasta</label>
                    <input type="date" className="auditoria-input" value={hasta} onChange={e => setHasta(e.target.value)} />
                </div>

                <button
                    className="auditoria-btn-export"
                    onClick={() => exportCSV(logs)}
                    disabled={logs.length === 0}
                >
                    ↓ Exportar CSV
                </button>
            </div>

            {/* Tabla */}
            {loading && <div className="auditoria-estado">Cargando…</div>}
            {error   && <div className="auditoria-estado auditoria-estado--error">{error}</div>}

            {!loading && !error && logs.length === 0 && (
                <div className="auditoria-estado">
                    <span className="auditoria-empty-icon">🔍</span>
                    <p>No hay registros con los filtros actuales.</p>
                </div>
            )}

            {!loading && !error && logs.length > 0 && (
                <>
                    <div className="auditoria-table-wrap">
                        <table className="auditoria-table">
                            <thead>
                                <tr>
                                    <th>Fecha/Hora</th>
                                    <th>Usuario</th>
                                    <th>Acción</th>
                                    <th>Entidad</th>
                                    <th>Detalle</th>
                                    <th>IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => {
                                    const badge = BADGE_COLOR[log.accion] ?? { bg: "#f3f4f6", color: "#374151" };
                                    return (
                                        <tr key={log.id}>
                                            <td className="auditoria-fecha">{formatFecha(log.createdAt)}</td>
                                            <td>
                                                <span className="auditoria-user-nombre">
                                                    {log.usuarioEmail ? log.usuarioEmail.split("@")[0] : "—"}
                                                </span>
                                                {log.usuarioEmail && (
                                                    <span className="auditoria-user-email">{log.usuarioEmail}</span>
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className="auditoria-badge"
                                                    style={{ background: badge.bg, color: badge.color }}
                                                >
                                                    {log.accion}
                                                </span>
                                            </td>
                                            <td>{log.entidad}{log.entidadId ? ` #${log.entidadId}` : ""}</td>
                                            <td className="auditoria-detalle">{log.detalle ?? "—"}</td>
                                            <td className="auditoria-ip">{log.ip ?? "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="auditoria-pagination">
                        <span className="auditoria-pagination-info">
                            Mostrando {inicio}–{fin} de {totalItems}
                        </span>
                        <div className="auditoria-pagination-btns">
                            <button
                                className="auditoria-btn-page"
                                disabled={page === 0}
                                onClick={() => cargar(page - 1)}
                            >
                                ← Anterior
                            </button>
                            <span className="auditoria-pagination-current">
                                Página {page + 1} / {totalPages}
                            </span>
                            <button
                                className="auditoria-btn-page"
                                disabled={page >= totalPages - 1}
                                onClick={() => cargar(page + 1)}
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
