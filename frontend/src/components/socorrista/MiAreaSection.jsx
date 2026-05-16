import { useEffect, useMemo, useState } from "react";
import { getMisTurnos } from "../../api/turnoApi";

const COLORES_PISCINAS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B",
  "#EF4444", "#06B6D4", "#F97316", "#84CC16",
];

const MESES_TEMPORADA = [4, 5, 6, 7, 8, 9]; // Mayo–Octubre (0-indexed)
const NOMBRES_MESES = ["Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"];

function calcularHoras(horaInicio, horaFin) {
  if (!horaInicio || !horaFin) return 0;
  const [h1, m1] = horaInicio.split(":").map(Number);
  const [h2, m2] = horaFin.split(":").map(Number);
  const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
  return diff > 0 ? diff / 60 : 0;
}

function parseFechaLocal(f) {
  const [y, m, d] = f.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function primerDia(fecha) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function ultimoDia(fecha) {
  const y = fecha.getFullYear();
  const m = fecha.getMonth();
  const ultimo = new Date(y, m + 1, 0).getDate();
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(ultimo).padStart(2, "0")}`;
}

function formatearFecha(fecha) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function esHoy(fecha) {
  const hoy = new Date();
  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  );
}

function generarDiasCalendario(fecha) {
  const y = fecha.getFullYear();
  const m = fecha.getMonth();
  const primero = new Date(y, m, 1);
  const ultimo = new Date(y, m + 1, 0);
  const inicioSemana = primero.getDay() === 0 ? 6 : primero.getDay() - 1;
  const dias = [];
  const diaAnterior = new Date(y, m, 0).getDate();
  for (let i = inicioSemana - 1; i >= 0; i--) {
    dias.push({ fecha: new Date(y, m - 1, diaAnterior - i), esMes: false });
  }
  for (let d = 1; d <= ultimo.getDate(); d++) {
    dias.push({ fecha: new Date(y, m, d), esMes: true });
  }
  while (dias.length % 7 !== 0) {
    const ult = dias[dias.length - 1].fecha;
    dias.push({ fecha: new Date(ult.getFullYear(), ult.getMonth(), ult.getDate() + 1), esMes: false });
  }
  return dias;
}

function MiAreaSection() {
  const temporadaActual = new Date().getFullYear();
  const [temporada, setTemporada] = useState(temporadaActual);

  const [mesIdx, setMesIdx] = useState(() => {
    const m = new Date().getMonth();
    const idx = MESES_TEMPORADA.indexOf(m);
    return idx >= 0 ? idx : 0;
  });

  const [turnosPorMes, setTurnosPorMes] = useState(Array(6).fill([]));
  const [cargando, setCargando] = useState(false);
  const [stats, setStats] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const mesesTemporada = useMemo(
    () => MESES_TEMPORADA.map(m => new Date(temporada, m, 1)),
    [temporada]
  );

  useEffect(() => {
    cargarTemporada();
  }, [temporada]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarTemporada = async () => {
    setCargando(true);
    try {
      const resultados = await Promise.all(
        mesesTemporada.map(m =>
          getMisTurnos(primerDia(m), ultimoDia(m))
            .then(r => r.data || [])
            .catch(() => [])
        )
      );

      setTurnosPorMes(resultados);

      const todosTurnos = resultados.flat();
      const totalHoras = todosTurnos.reduce((acc, t) => acc + calcularHoras(t.horaInicio, t.horaFin), 0);
      const totalTurnos = todosTurnos.length;

      const porPiscina = {};
      todosTurnos.forEach(t => {
        if (!porPiscina[t.piscinaId]) {
          porPiscina[t.piscinaId] = { nombre: t.piscinaNombre, turnos: 0, horas: 0 };
        }
        porPiscina[t.piscinaId].turnos++;
        porPiscina[t.piscinaId].horas += calcularHoras(t.horaInicio, t.horaFin);
      });
      const piscinaTop = Object.values(porPiscina).sort((a, b) => b.horas - a.horas)[0] || null;

      const horasPorMes = resultados.map((turnos, i) => ({
        mes: NOMBRES_MESES[i],
        horas: turnos.reduce((acc, t) => acc + calcularHoras(t.horaInicio, t.horaFin), 0),
        turnos: turnos.length,
      }));
      const mesMasCargado = [...horasPorMes].sort((a, b) => b.horas - a.horas)[0] || null;

      const hoy = new Date();
      let mesesCompletados = 0;
      if (temporada < hoy.getFullYear()) {
        mesesCompletados = 6;
      } else if (temporada === hoy.getFullYear()) {
        mesesCompletados = MESES_TEMPORADA.filter(m => {
          const ultimoDiaMes = new Date(temporada, m + 1, 0);
          return ultimoDiaMes < hoy;
        }).length;
      }

      setStats({
        totalHoras,
        totalTurnos,
        piscinaTop,
        mesMasCargado,
        horasPorMes,
        mesesCompletados,
        mediaHoras: totalTurnos > 0 ? totalHoras / totalTurnos : 0,
      });
    } finally {
      setCargando(false);
    }
  };

  const turnosDelMes = turnosPorMes[mesIdx] || [];
  const mesCalendario = mesesTemporada[mesIdx];

  const coloresPiscina = useMemo(() => {
    const pids = [...new Set(turnosDelMes.map(t => t.piscinaId).filter(Boolean))];
    const mapa = {};
    pids.forEach((pid, i) => { mapa[pid] = COLORES_PISCINAS[i % COLORES_PISCINAS.length]; });
    return mapa;
  }, [turnosDelMes]);

  const piscinasDistintas = useMemo(
    () => [...new Set(turnosDelMes.map(t => t.piscinaId).filter(Boolean))],
    [turnosDelMes]
  );

  const turnosPorDia = (fecha) => {
    const f = formatearFecha(fecha);
    return turnosDelMes.filter(t => t.fecha === f);
  };

  const diasCalendario = useMemo(() => generarDiasCalendario(mesCalendario), [mesCalendario]);

  return (
    <div className="area-wrapper">

      {/* 1 — SELECTOR DE TEMPORADA */}
      <div className="temporada-selector">
        <button
          onClick={() => { setTemporada(t => t - 1); setMesIdx(0); }}
          disabled={temporada <= 2024}
        >
          ‹
        </button>
        <div className="temporada-label">
          <span className="temporada-titulo">Temporada {temporada}</span>
          <span className="temporada-sub">Mayo — Octubre</span>
        </div>
        <button
          onClick={() => { setTemporada(t => t + 1); setMesIdx(0); }}
          disabled={temporada >= temporadaActual}
        >
          ›
        </button>
      </div>

      {/* 2 — ESTADÍSTICAS */}
      {cargando && <div className="area-empty">Cargando temporada...</div>}

      {stats && !cargando && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-card-label">Horas totales</span>
              <span className="stat-card-valor">{stats.totalHoras.toFixed(0)}h</span>
              <span className="stat-card-sub">en la temporada</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Turnos</span>
              <span className="stat-card-valor">{stats.totalTurnos}</span>
              <span className="stat-card-sub">en la temporada</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Piscina top</span>
              <span className="stat-card-valor" style={{ fontSize: 16, paddingTop: 4 }}>
                {stats.piscinaTop?.nombre || "—"}
              </span>
              <span className="stat-card-sub">
                {stats.piscinaTop
                  ? `${stats.piscinaTop.horas.toFixed(0)}h · ${stats.piscinaTop.turnos}t`
                  : "sin datos"}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Mes top</span>
              <span className="stat-card-valor" style={{ fontSize: 16, paddingTop: 4 }}>
                {stats.mesMasCargado?.horas > 0 ? stats.mesMasCargado.mes : "—"}
              </span>
              <span className="stat-card-sub">
                {stats.mesMasCargado?.horas > 0
                  ? `${stats.mesMasCargado.horas.toFixed(0)}h`
                  : "sin datos"}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Progreso</span>
              <span className="stat-card-valor" style={{ fontSize: 18, paddingTop: 4 }}>
                {stats.mesesCompletados}/6 meses
              </span>
              <div className="stat-card-progreso">
                <div
                  className="stat-card-progreso-fill"
                  style={{ width: `${temporada < new Date().getFullYear() ? 100 : (stats.mesesCompletados / 6) * 100}%` }}
                />
              </div>
              <span className="stat-card-sub">
                {stats.mesesCompletados === 6
                  ? "Temporada completada"
                  : `Quedan ${6 - stats.mesesCompletados} meses`}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Media/turno</span>
              <span className="stat-card-valor">{stats.mediaHoras.toFixed(1)}h</span>
              <span className="stat-card-sub">por turno</span>
            </div>
          </div>

          <div className="barras-temporada">
            <div className="barras-titulo">Horas por mes</div>
            <div className="barras-grid">
              {stats.horasPorMes.map((m, i) => {
                const maxHoras = Math.max(...stats.horasPorMes.map(x => x.horas), 1);
                const altura = (m.horas / maxHoras) * 100;
                const esMesActual =
                  MESES_TEMPORADA[i] === new Date().getMonth() &&
                  temporada === new Date().getFullYear();
                return (
                  <div key={i} className="barra-item">
                    <div className="barra-valor">{m.horas > 0 ? `${m.horas.toFixed(0)}h` : ""}</div>
                    <div className="barra-wrap">
                      <div
                        className={`barra-fill${esMesActual ? " actual" : ""}${m.horas === 0 ? " vacia" : ""}`}
                        style={{ height: `${Math.max(altura, m.horas > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                    <div className="barra-mes">{m.mes.substring(0, 3)}</div>
                    <div className="barra-turnos">{m.turnos}t</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 3 — CALENDARIO COMPACTO */}
      <div>
        <div className="cal-mes-selector">
          <button
            onClick={() => setMesIdx(i => Math.max(0, i - 1))}
            disabled={mesIdx === 0}
          >
            ‹
          </button>
          <span>{NOMBRES_MESES[mesIdx]} {temporada}</span>
          <button
            onClick={() => setMesIdx(i => Math.min(5, i + 1))}
            disabled={mesIdx === 5}
          >
            ›
          </button>
        </div>

        <div className="area-calendario-wrapper">
          <div className="area-cal-grid">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => (
              <div key={d} className="area-cal-nombre-dia">{d}</div>
            ))}
            {diasCalendario.map((dia, i) => {
              const tDia = turnosPorDia(dia.fecha);
              return (
                <div
                  key={i}
                  className={`area-cal-celda${!dia.esMes ? " otro-mes" : ""}`}
                >
                  <div className={esHoy(dia.fecha) ? "area-num-dia hoy" : "area-num-dia"}>
                    {dia.fecha.getDate()}
                  </div>
                  {tDia.map(t => (
                    <div
                      key={t.id}
                      className="area-turno-chip"
                      style={{ backgroundColor: coloresPiscina[t.piscinaId] || COLORES_PISCINAS[0] }}
                      onClick={() => setTurnoSeleccionado(t)}
                    >
                      <strong>{t.piscinaNombre || "Piscina"}</strong>
                      <span>{t.horaInicio}–{t.horaFin}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {piscinasDistintas.length > 0 && (
            <div className="area-leyenda">
              {piscinasDistintas.map((pid, i) => {
                const turno = turnosDelMes.find(t => t.piscinaId === pid);
                return (
                  <div key={pid} className="area-leyenda-item">
                    <span style={{ background: COLORES_PISCINAS[i % COLORES_PISCINAS.length] }}></span>
                    {turno?.piscinaNombre || `Piscina ${pid}`}
                  </div>
                );
              })}
            </div>
          )}

          {!cargando && turnosDelMes.length === 0 && (
            <div className="area-empty">No tienes turnos registrados este mes.</div>
          )}
        </div>
      </div>

      {/* 4 — TABLA RESUMEN DE TEMPORADA */}
      {stats && !cargando && (
        <div className="temporada-tabla-wrapper">
          <table className="temporada-tabla">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Turnos</th>
                <th>Horas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {stats.horasPorMes.map((m, i) => {
                const mesDate = mesesTemporada[i];
                const ahora = new Date();
                const esPasado = mesDate < new Date(ahora.getFullYear(), ahora.getMonth(), 1);
                const esActual =
                  mesDate.getMonth() === ahora.getMonth() &&
                  mesDate.getFullYear() === ahora.getFullYear();
                const esFuturo = !esPasado && !esActual;
                return (
                  <tr
                    key={i}
                    className={esActual ? "fila-actual" : ""}
                    onClick={() => setMesIdx(i)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{m.mes}</td>
                    <td>{m.turnos}</td>
                    <td>{m.horas > 0 ? `${m.horas.toFixed(1)}h` : "—"}</td>
                    <td>
                      {esActual && <span className="badge-mes activo">En curso</span>}
                      {esPasado && m.turnos > 0 && <span className="badge-mes ok">Completado</span>}
                      {esPasado && m.turnos === 0 && <span className="badge-mes vacio">Sin turnos</span>}
                      {esFuturo && <span className="badge-mes futuro">Próximo</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{stats.totalTurnos}</strong></td>
                <td><strong>{stats.totalHoras.toFixed(1)}h</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* MODAL DETALLE TURNO */}
      {turnoSeleccionado && (
        <div className="modal-backdrop" onClick={() => setTurnoSeleccionado(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Turno</h2>
            <div className="soc-turno-card" style={{ marginTop: 4 }}>
              <div className="soc-turno-horario">
                <span>{turnoSeleccionado.horaInicio}</span>
                <div className="soc-turno-linea"></div>
                <span>{turnoSeleccionado.horaFin}</span>
              </div>
              <div className="soc-turno-datos">
                <strong>{turnoSeleccionado.piscinaNombre || "Piscina"}</strong>
                <span>
                  {parseFechaLocal(turnoSeleccionado.fecha).toLocaleDateString("es-ES", {
                    weekday: "long", day: "numeric", month: "long",
                  })}
                </span>
                <span>
                  {calcularHoras(turnoSeleccionado.horaInicio, turnoSeleccionado.horaFin).toFixed(1)} horas
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setTurnoSeleccionado(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MiAreaSection;
