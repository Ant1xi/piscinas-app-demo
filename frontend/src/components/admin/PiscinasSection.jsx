import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFileUrl } from "../../config";
import { getCountDentro, getEntradasHoy } from "../../api/accesoApi";
import { getHorarios } from "../../api/piscinaApi";
import { getTurnosPiscina } from "../../api/turnoApi";
import AvatarUsuario from "../ui/AvatarUsuario";

// ─── Helpers horario ──────────────────────────────────────────────────────────

const DIAS_ORDEN = "LMXJVSD";
const JS_DIA_LETRA = ["D", "L", "M", "X", "J", "V", "S"];

function diasLetra(diasSemana) {
    if (!diasSemana) return "";
    if (diasSemana === DIAS_ORDEN) return "Diario";
    const indices = diasSemana
        .split("")
        .map(d => DIAS_ORDEN.indexOf(d))
        .filter(i => i >= 0)
        .sort((a, b) => a - b);
    if (!indices.length) return "";
    const grupos = [];
    let ini = indices[0], fin = indices[0];
    for (let i = 1; i < indices.length; i++) {
        if (indices[i] === fin + 1) {
            fin = indices[i];
        } else {
            grupos.push([ini, fin]);
            ini = fin = indices[i];
        }
    }
    grupos.push([ini, fin]);
    return grupos
        .map(([s, e]) => s === e ? DIAS_ORDEN[s] : `${DIAS_ORDEN[s]}-${DIAS_ORDEN[e]}`)
        .join(", ");
}

function formatHorario(tramos) {
    if (!tramos || !tramos.length) return "";
    const grupos = new Map();
    tramos.forEach(t => {
        if (!grupos.has(t.diasSemana)) grupos.set(t.diasSemana, []);
        grupos.get(t.diasSemana).push(`${t.horaApertura}–${t.horaCierre}`);
    });
    return [...grupos.entries()]
        .map(([dias, horas]) => `${diasLetra(dias)}: ${horas.join(" / ")}`)
        .join(" · ");
}

function estaAbiertaAhora(tramos) {
    if (!tramos || !tramos.length) return false;
    const ahora = new Date();
    const letraHoy = JS_DIA_LETRA[ahora.getDay()];
    const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
    return tramos.some(t => {
        if (!t.diasSemana.includes(letraHoy)) return false;
        const [hA, mA] = t.horaApertura.split(":").map(Number);
        const [hC, mC] = t.horaCierre.split(":").map(Number);
        return minAhora >= hA * 60 + mA && minAhora < hC * 60 + mC;
    });
}

// ─── Helper turno activo ──────────────────────────────────────────────────────

// Dado el array de turnos de hoy, devuelve el turno cuya franja cubre la hora
// actual, o null si ninguno está activo en este momento.
function turnoActivoAhora(turnos) {
    if (!turnos || !turnos.length) return null;
    const ahora = new Date();
    const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
    return turnos.find(t => {
        if (!t.horaInicio || !t.horaFin) return false;
        const [hI, mI] = t.horaInicio.split(":").map(Number);
        const [hF, mF] = t.horaFin.split(":").map(Number);
        return minAhora >= hI * 60 + mI && minAhora < hF * 60 + mF;
    }) ?? null;
}

function fechaLocalHoy() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Componente ───────────────────────────────────────────────────────────────

function PiscinasSection({ piscinas, busqueda }) {
    const navigate = useNavigate();

    // { [id]: { dentro, hoy } }  — undefined = cargando, null = error piscina
    const [contadores, setContadores] = useState({});
    // { [id]: tramo[] | null }   — undefined = cargando, null = error, [] = sin horario
    const [horarios, setHorarios]     = useState({});
    // { [id]: turno[] | null }   — undefined = cargando, null = error, [] = sin turnos hoy
    const [turnosHoy, setTurnosHoy]   = useState({});

    useEffect(() => {
        if (!piscinas.length) return;

        const cargarDatos = async () => {
            const hoy = fechaLocalHoy();
            // Una piscina que falle (Promise exterior) no bloquea las demás
            const resultados = await Promise.allSettled(
                piscinas.map(async (p) => {
                    // Cada llamada falla de forma independiente (Promise interior)
                    const [countRes, entradasRes, horariosRes, turnosRes] = await Promise.allSettled([
                        getCountDentro(p.id),
                        getEntradasHoy(p.id),
                        getHorarios(p.id),
                        getTurnosPiscina(p.id, hoy, hoy),
                    ]);
                    return {
                        id:     p.id,
                        dentro: countRes.status    === "fulfilled" ? (countRes.value.data?.personasDentro     ?? null) : null,
                        hoy:    entradasRes.status === "fulfilled" ? (entradasRes.value.data?.totalEntradasHoy ?? null) : null,
                        tramos: horariosRes.status === "fulfilled" ? (horariosRes.value.data                   ?? [])   : null,
                        turnos: turnosRes.status   === "fulfilled" ? (turnosRes.value.data                     ?? [])   : null,
                    };
                })
            );

            const nuevosCont   = {};
            const nuevosHor    = {};
            const nuevosTurnos = {};
            resultados.forEach(r => {
                if (r.status !== "fulfilled") return;
                const { id, dentro, hoy, tramos, turnos } = r.value;
                nuevosCont[id]   = { dentro, hoy };
                nuevosHor[id]    = tramos;
                nuevosTurnos[id] = turnos;
            });
            setContadores(nuevosCont);
            setHorarios(nuevosHor);
            setTurnosHoy(nuevosTurnos);
        };

        cargarDatos();
    }, [piscinas]);

    const obtenerImagen = (ruta) => {
        if (!ruta) return "/login-backgrounds/piscina1.jpg";
        if (ruta.startsWith("http")) return ruta;
        return getFileUrl(ruta);
    };

    const texto = busqueda.trim().toLowerCase();
    const piscinasFiltradas = piscinas.filter(p =>
        p.nombre?.toLowerCase().includes(texto) ||
        p.urbanizacionNombre?.toLowerCase().includes(texto) ||
        p.municipioNombre?.toLowerCase().includes(texto)
    );

    if (!piscinasFiltradas.length) {
        return <div className="empty-state">No se han encontrado piscinas.</div>;
    }

    return (
        <div className="grid">
            {piscinasFiltradas.map((p) => {
                const cont   = contadores[p.id];
                const tramos = horarios[p.id];
                const abierta = estaAbiertaAhora(tramos);

                const horarioTexto =
                    tramos === undefined ? null :
                    tramos === null      ? null :
                    tramos.length === 0  ? "Sin horario" :
                    formatHorario(tramos);

                const valorDentro   = cont === undefined ? "–" : (cont.dentro ?? "–");
                const valorEntradas = cont === undefined ? "–" : (cont.hoy    ?? "–");

                // undefined=todavía cargando | null=nadie activo | objeto=turno activo
                const turnoActivo = turnosHoy[p.id] !== undefined
                    ? turnoActivoAhora(turnosHoy[p.id])
                    : undefined;

                return (
                    <div
                        key={p.id}
                        className="card"
                        onClick={() => navigate(`/admin/piscinas/${p.id}`)}
                    >
                        <div
                            className="card-img"
                            style={{ backgroundImage: `url(${obtenerImagen(p.rutaImagen)})` }}
                        >
                            <h3>{p.nombre}</h3>
                            {abierta && (
                                <div className="card-live">
                                    <span className="live-dot" />
                                    <span className="live-label">Abierta</span>
                                </div>
                            )}
                        </div>

                        <div className="card-body">
                            <p>{p.urbanizacionNombre || "Sin urbanización"}</p>

                            {horarioTexto !== null && (
                                <div className={`card-horario${tramos?.length === 0 ? " card-horario--vacio" : ""}`}>
                                    {horarioTexto}
                                </div>
                            )}

                            {turnoActivo !== undefined && (
                                <div className="card-socorrista">
                                    <span className="card-socorrista-lbl">Socorrista en turno</span>
                                    {turnoActivo ? (
                                        <div className="card-socorrista-fila">
                                            <AvatarUsuario
                                                usuario={{
                                                    nombre:     turnoActivo.socorristaNombre || turnoActivo.nombreSocorrista || "S",
                                                    fotoPerfil: turnoActivo.socorristaFotoPerfil || null,
                                                }}
                                                size={28}
                                            />
                                            <div className="card-socorrista-info">
                                                <span className="card-socorrista-nombre">
                                                    {turnoActivo.socorristaNombre || turnoActivo.nombreSocorrista || "Socorrista"}
                                                </span>
                                                <span className="card-socorrista-hora">
                                                    {turnoActivo.horaInicio}–{turnoActivo.horaFin}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="card-socorrista-vacio">Nadie en la instalación</span>
                                    )}
                                </div>
                            )}

                            <div className="stats">
                                <div>
                                    <strong>{valorDentro}</strong>
                                    <span>Dentro ahora</span>
                                </div>
                                <div>
                                    <strong>{valorEntradas}</strong>
                                    <span>Entradas hoy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PiscinasSection;
