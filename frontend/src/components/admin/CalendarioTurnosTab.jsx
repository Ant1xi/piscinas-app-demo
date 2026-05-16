// Calendario mensual de turnos de socorristas para una piscina.
//
// LÓGICA PRINCIPAL:
//   - Carga turnos del mes (desde/hasta primer-último día) y la lista de socorristas
//     asignados a la piscina en paralelo (Promise.all).
//   - diasCalendario genera el grid 7×N: rellena celdas del mes anterior/siguiente
//     para completar semanas. El primer día de semana es LUNES (iso), por eso
//     diaSemanaInicio = (getDay() === 0 ? 6 : getDay() - 1).
//   - Cada socorrista recibe un color fijo del array COLORES_SOCORRISTAS según
//     su posición en la lista de asignados.
//   - Al hacer clic en una celda → modal para asignar turno en ese día.
//   - Al hacer clic en un chip de turno → modal de detalle con opción de eliminar.
//
// VALIDACIONES de turno:
//   horaFin > horaInicio, horaInicio >= horaApertura, horaFin <= horaCierre
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosConfig";
import AvatarUsuario from "../ui/AvatarUsuario";

const COLORES_SOCORRISTAS = [
    "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B",
    "#EF4444", "#06B6D4", "#F97316", "#84CC16"
];

// Convierte "YYYY-MM-DD" a Date local evitando el offset UTC de new Date("YYYY-MM-DD")
function parseFechaLocal(f) {
    const [y, m, d] = f.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function CalendarioTurnosTab({ piscina, mostrarMensaje, soloLectura = false }) {
    const [fechaActual, setFechaActual] = useState(new Date());
    const [turnos, setTurnos] = useState([]);
    const [socorristas, setSocorristas] = useState([]);
    const [loading, setLoading] = useState(false);

    const [modalAsignar, setModalAsignar] = useState(false);
    const [modalDetalle, setModalDetalle] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [errorModal, setErrorModal] = useState("");

    const [formTurno, setFormTurno] = useState({
        socorristaId: "",
        horaInicio: "",
        horaFin: ""
    });

    useEffect(() => {
        cargarDatosCalendario();
    }, [fechaActual, piscina.id]);

    const cargarDatosCalendario = async () => {
        setLoading(true);

        try {
            const desde = obtenerPrimerDiaMes(fechaActual);
            const hasta = obtenerUltimoDiaMes(fechaActual);

            const [turnosResponse, socorristasResponse] = await Promise.all([
                api.get(`/turnos/piscina/${piscina.id}?desde=${desde}&hasta=${hasta}`),
                api.get(`/socorrista-piscina/piscina/${piscina.id}/socorristas`)
            ]);

            setTurnos(turnosResponse.data);
            setSocorristas(socorristasResponse.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
            mostrarMensaje("error", "Error al cargar el calendario");
        } finally {
            setLoading(false);
        }
    };

    const obtenerPrimerDiaMes = (fecha) => {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}-01`;
    };

    const obtenerUltimoDiaMes = (fecha) => {
        const year = fecha.getFullYear();
        const month = fecha.getMonth();
        const ultimoDia = new Date(year, month + 1, 0).getDate();
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
    };

    const formatearFechaInput = (fecha) => {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        const day = String(fecha.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const cambiarMes = (cantidad) => {
        setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + cantidad, 1));
    };

    const irHoy = () => {
        setFechaActual(new Date());
    };

    const nombreMes = fechaActual.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric"
    });

    const tituloCalendario = soloLectura
        ? `Turnos de la piscina — ${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}`
        : nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

    const diasCalendario = useMemo(() => {
        const year = fechaActual.getFullYear();
        const month = fechaActual.getMonth();

        const primerDiaMes = new Date(year, month, 1);
        const ultimoDiaMes = new Date(year, month + 1, 0);

        const diaSemanaInicio = primerDiaMes.getDay() === 0 ? 6 : primerDiaMes.getDay() - 1;
        const totalDiasMes = ultimoDiaMes.getDate();

        const dias = [];

        const ultimoDiaMesAnterior = new Date(year, month, 0).getDate();

        for (let i = diaSemanaInicio - 1; i >= 0; i--) {
            dias.push({
                fecha: new Date(year, month - 1, ultimoDiaMesAnterior - i),
                esMesActual: false
            });
        }

        for (let dia = 1; dia <= totalDiasMes; dia++) {
            dias.push({
                fecha: new Date(year, month, dia),
                esMesActual: true
            });
        }

        while (dias.length % 7 !== 0) {
            const ultimo = dias[dias.length - 1].fecha;
            dias.push({
                fecha: new Date(ultimo.getFullYear(), ultimo.getMonth(), ultimo.getDate() + 1),
                esMesActual: false
            });
        }

        return dias;
    }, [fechaActual]);

    const turnosPorDia = (fecha) => {
        const fechaTexto = formatearFechaInput(fecha);
        return turnos.filter((t) => t.fecha === fechaTexto);
    };

    const obtenerNombreSocorrista = (turno) => {
        return turno.socorristaNombre || turno.nombreSocorrista || "Socorrista";
    };

    const obtenerColorSocorrista = (socorristaId) => {
        const index = socorristas.findIndex((s) =>
            s.socorristaId === socorristaId ||
            s.id === socorristaId ||
            s.usuarioId === socorristaId
        );

        if (index === -1) return COLORES_SOCORRISTAS[0];

        return COLORES_SOCORRISTAS[index % COLORES_SOCORRISTAS.length];
    };

    const abrirModalAsignar = (fecha) => {
        setDiaSeleccionado(fecha);
        setErrorModal("");

        setFormTurno({
            socorristaId: "",
            horaInicio: piscina.horaApertura || "",
            horaFin: piscina.horaCierre || ""
        });

        setModalAsignar(true);
    };

    const abrirDetalleTurno = (turno, event) => {
        event.stopPropagation();
        setTurnoSeleccionado(turno);
        setModalDetalle(true);
    };

    const validarTurno = () => {
        if (!formTurno.socorristaId) {
            return "Selecciona un socorrista.";
        }

        if (!formTurno.horaInicio || !formTurno.horaFin) {
            return "Indica hora de inicio y hora de fin.";
        }

        if (formTurno.horaFin <= formTurno.horaInicio) {
            return "La hora de fin debe ser posterior a la hora de inicio.";
        }

        if (piscina.horaApertura && formTurno.horaInicio < piscina.horaApertura) {
            return `La hora de inicio no puede ser anterior a la apertura (${piscina.horaApertura}).`;
        }

        if (piscina.horaCierre && formTurno.horaFin > piscina.horaCierre) {
            return `La hora de fin no puede ser posterior al cierre (${piscina.horaCierre}).`;
        }

        return "";
    };

    const asignarTurno = async () => {
        const error = validarTurno();

        if (error) {
            setErrorModal(error);
            return;
        }

        try {
            await api.post("/turnos", {
                piscinaId: piscina.id,
                socorristaId: Number(formTurno.socorristaId),
                fecha: formatearFechaInput(diaSeleccionado),
                horaInicio: formTurno.horaInicio,
                horaFin: formTurno.horaFin
            });

            setModalAsignar(false);
            mostrarMensaje("success", "Turno asignado correctamente");
            await cargarDatosCalendario();
        } catch (error) {
            const texto =
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                "Error al asignar el turno";

            setErrorModal(texto);
        }
    };

    const eliminarTurno = async () => {
        if (!turnoSeleccionado) return;

        const confirmar = window.confirm("¿Seguro que quieres eliminar este turno?");
        if (!confirmar) return;

        try {
            await api.delete(`/turnos/${turnoSeleccionado.id}`);

            setModalDetalle(false);
            mostrarMensaje("success", "Turno eliminado correctamente");
            await cargarDatosCalendario();
        } catch (error) {
            const texto =
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                "Error al eliminar el turno";

            mostrarMensaje("error", texto);
        }
    };

    const esHoy = (fecha) => {
        const hoy = new Date();
        return (
            fecha.getDate() === hoy.getDate() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getFullYear() === hoy.getFullYear()
        );
    };

    const formatearFechaLarga = (fecha) => {
        return fecha.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const socorristasConTurnos = socorristas.filter((s) =>
        turnos.some((t) =>
            t.socorristaId === s.socorristaId ||
            t.socorristaId === s.id ||
            t.usuarioId === s.id
        )
    );

    return (
        <div className="calendar-wrapper">
            <div className="calendar-header">
                <h2>{tituloCalendario}</h2>

                <div className="calendar-actions">
                    <button onClick={() => cambiarMes(-1)}>‹ Anterior</button>
                    <button onClick={irHoy}>Hoy</button>
                    <button onClick={() => cambiarMes(1)}>Siguiente ›</button>
                </div>
            </div>

            {loading && (
                <div className="calendar-loading">
                    Cargando turnos...
                </div>
            )}

            <div className="calendar-grid">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dia) => (
                    <div key={dia} className="calendar-day-name">
                        {dia}
                    </div>
                ))}

                {diasCalendario.map((dia, index) => {
                    const turnosDia = turnosPorDia(dia.fecha);

                    return (
                        <div
                            key={index}
                            className={`calendar-cell ${!dia.esMesActual ? "other-month" : ""}${soloLectura ? " readonly" : ""}`}
                            onClick={() => !soloLectura && abrirModalAsignar(dia.fecha)}
                        >
                            <div className={esHoy(dia.fecha) ? "day-number today" : "day-number"}>
                                {dia.fecha.getDate()}
                            </div>

                            <div className={`turnos-dia${turnosDia.length > 1 ? " turnos-dia--compacto" : ""}`}>
                                {turnosDia.map((turno) => (
                                    <div
                                        key={turno.id}
                                        className="turno-chip"
                                        style={{
                                            backgroundColor: obtenerColorSocorrista(turno.socorristaId)
                                        }}
                                        onClick={(event) => abrirDetalleTurno(turno, event)}
                                    >
                                        <strong>{obtenerNombreSocorrista(turno)}</strong>
                                        <span>{turno.horaInicio} - {turno.horaFin}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {socorristasConTurnos.length > 0 && (
                <div className="calendar-legend">
                    {socorristasConTurnos.map((s, index) => (
                        <div key={s.id || s.socorristaId} className="legend-item">
                            <span
                                style={{
                                    backgroundColor: COLORES_SOCORRISTAS[index % COLORES_SOCORRISTAS.length]
                                }}
                            ></span>
                            {s.socorristaNombre || s.nombre || "Socorrista"}
                        </div>
                    ))}
                </div>
            )}

            {modalAsignar && (
                <div className="modal-backdrop">
                    <div className="modal calendar-modal">
                        <h2>Asignar turno</h2>
                        <p>{formatearFechaLarga(diaSeleccionado)}</p>

                        {socorristas.length === 0 ? (
                            <div className="detalle-empty">
                                Primero asigna socorristas en el tab Socorristas.
                            </div>
                        ) : (
                            <>
                                <label className="calendar-label">Socorrista</label>
                                <select
                                    value={formTurno.socorristaId}
                                    onChange={(e) => {
                                        setFormTurno({ ...formTurno, socorristaId: e.target.value });
                                        setErrorModal("");
                                    }}
                                >
                                    <option value="">Selecciona socorrista</option>
                                    {socorristas.map((s) => (
                                        <option
                                            key={s.id || s.socorristaId}
                                            value={s.socorristaId || s.id}
                                        >
                                            {(s.socorristaNombre || `${s.nombre} ${s.apellidos || ""}`)} · {s.socorristaEmail || s.email}
                                        </option>
                                    ))}
                                </select>

                                <div className="form-row">
                                    <div>
                                        <label className="calendar-label">Hora inicio</label>
                                        <input
                                            type="time"
                                            value={formTurno.horaInicio}
                                            onChange={(e) => {
                                                setFormTurno({ ...formTurno, horaInicio: e.target.value });
                                                setErrorModal("");
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label className="calendar-label">Hora fin</label>
                                        <input
                                            type="time"
                                            value={formTurno.horaFin}
                                            onChange={(e) => {
                                                setFormTurno({ ...formTurno, horaFin: e.target.value });
                                                setErrorModal("");
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {errorModal && (
                            <div className="form-error">{errorModal}</div>
                        )}

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setModalAsignar(false)}>
                                Cancelar
                            </button>

                            {socorristas.length > 0 && (
                                <button className="modal-save wide" onClick={asignarTurno}>
                                    Asignar turno
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {modalDetalle && turnoSeleccionado && (
                <div className="modal-backdrop">
                    <div className="modal calendar-modal">
                        <h2>Turno asignado</h2>

                        <div className="turno-detail-box">
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                                <AvatarUsuario
                                    usuario={{
                                        nombre: turnoSeleccionado.socorristaNombre,
                                        fotoPerfil: turnoSeleccionado.socorristaFotoPerfil || null
                                    }}
                                    size={48}
                                />
                                <div>
                                    <strong style={{ display: "block", marginBottom: 0 }}>{obtenerNombreSocorrista(turnoSeleccionado)}</strong>
                                    <span>{formatearFechaLarga(parseFechaLocal(turnoSeleccionado.fecha))}</span>
                                </div>
                            </div>
                            <p>🕒 {turnoSeleccionado.horaInicio} – {turnoSeleccionado.horaFin}</p>

                            <div className="turno-status">
                                {turnoSeleccionado.estado || "PROGRAMADO"}
                            </div>

                            <small>{piscina.nombre}</small>
                        </div>

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setModalDetalle(false)}>
                                Cerrar
                            </button>

                            {!soloLectura && (turnoSeleccionado.estado || "PROGRAMADO") === "PROGRAMADO" && (
                                <button className="modal-danger" onClick={eliminarTurno}>
                                    Eliminar turno
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarioTurnosTab;