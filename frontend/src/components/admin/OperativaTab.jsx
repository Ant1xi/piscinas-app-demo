import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { useAccesos } from "../../hooks/useAccesos";
import {
  registrarEntrada,
  registrarSalida,
  registrarEntradaInvitados,
  registrarSalidaInvitados,
} from "../../api/accesoApi";
import { buscarPersonas, getCallesPiscina, getBloquesPiscina, getViviendasCalle, getViviendasBloque } from "../../api/estructuraApi";
import SelectorEstructura from "./SelectorEstructura";
import AvatarUsuario from "../ui/AvatarUsuario";

function tiempoTranscurrido(horaEntrada) {
  if (!horaEntrada) return "";
  const partes = horaEntrada.split(":");
  if (partes.length < 2) return "";
  const h = parseInt(partes[0]);
  const m = parseInt(partes[1]);
  const ahora = new Date();
  const diffMin = ahora.getHours() * 60 + ahora.getMinutes() - (h * 60 + m);
  if (diffMin < 0) return "";
  const horas = Math.floor(diffMin / 60);
  const minutos = diffMin % 60;
  if (horas > 0) return `${horas}h ${minutos}min`;
  return `${minutos} min`;
}

const ROL_COLORS = {
  PROPIETARIO: { background: "#dbeafe", color: "#1d4ed8" },
  HABITANTE:   { background: "#dcfce7", color: "#15803d" },
};
const ROL_LABELS = { PROPIETARIO: "Propietario", HABITANTE: "Habitante" };

const ordenarViviendas = (viviendas) =>
  [...viviendas].sort((a, b) => {
    const numA = parseInt(a.identificador);
    const numB = parseInt(b.identificador);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.identificador.localeCompare(b.identificador);
  });

const IcoCasa = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const IcoBloque = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="1"/>
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
  </svg>
);

function OperativaTab({ piscina, mostrarMensaje }) {
  const {
    personasDentro,
    invitadosActivos,
    countDentro,
    entradasHoy,
    cargando,
    recargar,
  } = useAccesos(piscina.id);

  // --- Búsqueda de personas ---
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // --- Modal entrada directa (desde búsqueda) ---
  const [personaParaEntrada, setPersonaParaEntrada] = useState(null);

  // --- Modal registrar invitados ---
  const [modalInvitados, setModalInvitados] = useState(false);
  const [viviendaInvitados, setViviendaInvitados] = useState(null);
  const [viviendaInvitadosLabel, setViviendaInvitadosLabel] = useState(null);
  const [cantidadInvitados, setCantidadInvitados] = useState(1);

  // --- Modo panel: "buscar" | "explorar" ---
  const [modoPanel, setModoPanel] = useState("buscar");

  // --- Explorar: nivel 1 (estructuras) ---
  const [estructuras, setEstructuras] = useState([]);
  const [cargandoEstructuras, setCargandoEstructuras] = useState(false);
  const [estructuraSeleccionada, setEstructuraSeleccionada] = useState(null);

  // --- Explorar: nivel 2 (viviendas) ---
  const [viviendasExplora, setViviendasExplora] = useState([]);
  const [cargandoViviendas, setCargandoViviendas] = useState(false);
  const [viviendaSeleccionada, setViviendaSeleccionada] = useState(null);

  // --- Explorar: nivel 3 (vecinos) ---
  const [personasVivienda, setPersonasVivienda] = useState([]);
  const [cargandoPersonas, setCargandoPersonas] = useState(false);
  const [nivelExplora, setNivelExplora] = useState(1);
  const [avisoSinVecinos, setAvisoSinVecinos] = useState(null);

  const esPorCalles = piscina.tipoUrbanizacion === "CALLES";

  const idsYaDentro = new Set(
    personasDentro.map((a) => a.personaId).filter(Boolean)
  );

  const totalInvitadosActivos = invitadosActivos.reduce(
    (acc, r) => acc + (r.cantidadInvitados || 0),
    0
  );

  // --- Carga de estructuras al activar modo explorar ---
  useEffect(() => {
    if (modoPanel !== "explorar") return;
    setCargandoEstructuras(true);
    const llamada = esPorCalles
      ? getCallesPiscina(piscina.id)
      : getBloquesPiscina(piscina.id);
    llamada
      .then(r => setEstructuras(r.data || []))
      .catch(() => setEstructuras([]))
      .finally(() => setCargandoEstructuras(false));
  }, [modoPanel, piscina.id, esPorCalles]);

  const seleccionarEstructura = async (e) => {
    setEstructuraSeleccionada(e);
    setNivelExplora(2);
    setViviendasExplora([]);
    setAvisoSinVecinos(null);
    setCargandoViviendas(true);
    try {
      const res = esPorCalles
        ? await getViviendasCalle(e.id)
        : await getViviendasBloque(e.id);
      setViviendasExplora(res.data || []);
    } catch {
      mostrarMensaje("error", "Error al cargar viviendas");
    } finally {
      setCargandoViviendas(false);
    }
  };

  const seleccionarVivienda = async (v) => {
    const label = esPorCalles
      ? v.identificador
      : (v.planta ? `${v.planta}º${v.identificador}` : v.identificador);
    setViviendaSeleccionada({ id: v.id, label });
    setNivelExplora(3);
    setPersonasVivienda([]);
    setCargandoPersonas(true);
    try {
      const res = await api.get(`/vivienda-personas/vivienda/${v.id}`);
      setPersonasVivienda(res.data || []);
    } catch {
      mostrarMensaje("error", "Error al cargar vecinos");
    } finally {
      setCargandoPersonas(false);
    }
  };

  const volverANivel1 = () => {
    setNivelExplora(1);
    setEstructuraSeleccionada(null);
    setViviendaSeleccionada(null);
    setViviendasExplora([]);
    setPersonasVivienda([]);
    setAvisoSinVecinos(null);
  };

  const volverANivel2 = () => {
    setNivelExplora(2);
    setViviendaSeleccionada(null);
    setPersonasVivienda([]);
  };

  // --- Búsqueda ---
  const buscar = async () => {
    const texto = textoBusqueda.trim();
    if (!texto) {
      setResultadosBusqueda([]);
      return;
    }
    setBuscando(true);
    try {
      const res = await buscarPersonas(piscina.id, texto);
      setResultadosBusqueda(res.data || []);
    } catch {
      mostrarMensaje("error", "Error al buscar personas");
    } finally {
      setBuscando(false);
    }
  };

  const handleBuscarKeyDown = (e) => {
    if (e.key === "Enter") buscar();
  };

  const getUbicacion = (p) => {
    if (p.calleNombre) return `${p.calleNombre} ${p.viviendaIdentificador}`;
    if (p.bloqueCodigo) return `Bloque ${p.bloqueCodigo} · ${p.planta}º${p.viviendaIdentificador}`;
    return p.viviendaIdentificador || "Sin vivienda";
  };

  const registrarEntradaPersona = async (persona) => {
    try {
      await registrarEntrada({
        piscinaId: piscina.id,
        viviendaId: persona.viviendaId,
        personaId: persona.id,
      });
      mostrarMensaje("success", `Entrada registrada: ${persona.nombre} ${persona.apellidos}`);
      setResultadosBusqueda([]);
      setTextoBusqueda("");
      setPersonaParaEntrada(null);
      recargar();
    } catch (error) {
      mostrarMensaje("error", error.response?.data?.message || error.response?.data?.mensaje || "Error al registrar entrada");
    }
  };

  const registrarEntradaDesdeExplora = async (vecino) => {
    try {
      await registrarEntrada({
        piscinaId: piscina.id,
        viviendaId: viviendaSeleccionada.id,
        personaId: vecino.personaId,
      });
      mostrarMensaje("success", `Entrada registrada: ${vecino.personaNombreCompleto}`);
      recargar();
    } catch (error) {
      mostrarMensaje("error", error.response?.data?.message || "Error al registrar entrada");
    }
  };

  const registrarSalidaAcceso = async (accesoId) => {
    try {
      await registrarSalida({ accesoId });
      mostrarMensaje("success", "Salida registrada correctamente");
      recargar();
    } catch (error) {
      mostrarMensaje("error", error.response?.data?.message || "Error al registrar salida");
    }
  };

  const confirmarInvitados = async () => {
    if (!viviendaInvitados) {
      mostrarMensaje("error", "Selecciona una vivienda");
      return;
    }
    if (cantidadInvitados < 1) {
      mostrarMensaje("error", "La cantidad debe ser al menos 1");
      return;
    }
    const max = piscina.maxInvitadosPorVivienda || 99;
    if (cantidadInvitados > max) {
      mostrarMensaje("error", `Máximo ${max} invitados por vivienda`);
      return;
    }
    try {
      await registrarEntradaInvitados({
        piscinaId: piscina.id,
        viviendaId: Number(viviendaInvitados),
        cantidadInvitados: Number(cantidadInvitados),
      });
      mostrarMensaje("success", `${cantidadInvitados} invitado(s) registrados`);
      setModalInvitados(false);
      setCantidadInvitados(1);
      setViviendaInvitados(null);
      setViviendaInvitadosLabel(null);
      recargar();
    } catch (error) {
      mostrarMensaje("error", error.response?.data?.message || "Error al registrar invitados");
    }
  };

  const registrarSalidaGrupoInvitados = async (registroId) => {
    try {
      await registrarSalidaInvitados({ registroId });
      mostrarMensaje("success", "Salida de invitados registrada");
      recargar();
    } catch (error) {
      mostrarMensaje("error", error.response?.data?.message || "Error al registrar salida de invitados");
    }
  };

  const abrirInvitadosDesdeExplora = () => {
    setViviendaInvitados(String(viviendaSeleccionada.id));
    setViviendaInvitadosLabel(viviendaSeleccionada.label);
    setModalInvitados(true);
  };

  return (
    <div className="operativa-wrapper">
      {/* MÉTRICAS DEL DÍA */}
      <div className="operativa-metricas">
        <div className="operativa-kpi">
          <span>Dentro ahora</span>
          <strong style={{ color: "#10b981" }}>{countDentro}</strong>
        </div>
        <div className="operativa-kpi">
          <span>Entradas hoy</span>
          <strong style={{ color: "#3b82f6" }}>{entradasHoy}</strong>
        </div>
        <div className="operativa-kpi">
          <span>Invitados activos</span>
          <strong style={{ color: "#f59e0b" }}>{totalInvitadosActivos}</strong>
        </div>
      </div>

      {/* PANEL BUSCAR / EXPLORAR */}
      <div className="operativa-seccion">
        <div className="explora-toggle">
          <button
            className={`explora-toggle-btn${modoPanel === "buscar" ? " explora-toggle-btn-active" : ""}`}
            onClick={() => setModoPanel("buscar")}
          >
            🔍 Buscar
          </button>
          <button
            className={`explora-toggle-btn${modoPanel === "explorar" ? " explora-toggle-btn-active" : ""}`}
            onClick={() => { setModoPanel("explorar"); setNivelExplora(1); }}
          >
            🏘️ Explorar por {esPorCalles ? "calles" : "bloques"}
          </button>
        </div>

        {/* MODO BUSCAR */}
        {modoPanel === "buscar" && (
          <>
            <h3>Buscar vecino</h3>
            <p>Busca por nombre, apellidos o DNI para registrar entrada.</p>
            <div className="operativa-buscador">
              <input
                placeholder="Nombre, apellidos o DNI..."
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                onKeyDown={handleBuscarKeyDown}
              />
              <button className="detalle-primary-btn" onClick={buscar} disabled={buscando}>
                {buscando ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {resultadosBusqueda.length > 0 && (
              <div className="operativa-resultados">
                {resultadosBusqueda.map((p) => {
                  const yaDentro = idsYaDentro.has(p.id);
                  return (
                    <div key={p.id} className="operativa-persona-row">
                      <div>
                        <div className="operativa-persona-avatar">
                          {(p.nombre || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="operativa-persona-info">
                          <strong>{p.nombre} {p.apellidos}</strong>
                          <span>{getUbicacion(p)}</span>
                        </div>
                      </div>
                      {yaDentro ? (
                        <span className="operativa-ya-dentro">Ya dentro</span>
                      ) : (
                        <button
                          className="detalle-primary-btn"
                          onClick={() => registrarEntradaPersona(p)}
                        >
                          Registrar entrada
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {textoBusqueda && resultadosBusqueda.length === 0 && !buscando && (
              <div className="detalle-empty">
                No se encontraron personas con ese criterio.
              </div>
            )}
          </>
        )}

        {/* MODO EXPLORAR */}
        {modoPanel === "explorar" && (
          <div>
            {/* Breadcrumb */}
            {nivelExplora > 1 && (
              <div className="explora-breadcrumb">
                <button className="explora-bc-btn" onClick={volverANivel1}>
                  {esPorCalles ? "Calles" : "Bloques"}
                </button>
                {estructuraSeleccionada && (
                  <>
                    <span className="explora-bc-sep">›</span>
                    {nivelExplora === 3 ? (
                      <button className="explora-bc-btn" onClick={volverANivel2}>
                        {estructuraSeleccionada.label}
                      </button>
                    ) : (
                      <span className="explora-bc-current">{estructuraSeleccionada.label}</span>
                    )}
                  </>
                )}
                {viviendaSeleccionada && nivelExplora === 3 && (
                  <>
                    <span className="explora-bc-sep">›</span>
                    <span className="explora-bc-current">{viviendaSeleccionada.label}</span>
                  </>
                )}
              </div>
            )}

            {/* NIVEL 1 — Lista calles/bloques */}
            {nivelExplora === 1 && (
              <>
                {cargandoEstructuras && <div className="explora-empty">Cargando {esPorCalles ? "calles" : "bloques"}...</div>}
                {!cargandoEstructuras && estructuras.length === 0 && (
                  <div className="explora-empty">No hay {esPorCalles ? "calles" : "bloques"} registrados.</div>
                )}
                {estructuras.map((e) => (
                  <div
                    key={e.id}
                    className="explora-card"
                    onClick={() => seleccionarEstructura({ id: e.id, label: esPorCalles ? e.nombre : `Bloque ${e.codigo}` })}
                  >
                    <div className="explora-card-info">
                      <span className="explora-card-nombre">
                        {esPorCalles ? e.nombre : `Bloque ${e.codigo}`}
                      </span>
                      {e.numViviendas !== undefined && (
                        <span className="explora-card-sub">{e.numViviendas} vivienda{e.numViviendas !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                    {e.numViviendas !== undefined && (
                      <span className="explora-card-badge">{e.numViviendas}</span>
                    )}
                    <span className="explora-card-arrow">›</span>
                  </div>
                ))}
              </>
            )}

            {/* NIVEL 2 — Grid viviendas */}
            {nivelExplora === 2 && (
              <>
                {cargandoViviendas && <div className="explora-empty">Cargando viviendas...</div>}
                {!cargandoViviendas && viviendasExplora.length === 0 && (
                  <div className="explora-empty">No hay viviendas registradas.</div>
                )}
                {!cargandoViviendas && viviendasExplora.length > 0 && (
                  <div className="vivienda-grid">
                    {ordenarViviendas(viviendasExplora).map((v) => {
                      const tieneVecinos = (v.numVecinos ?? 0) > 0;
                      const iconColor = tieneVecinos ? "#16a34a" : "#94a3b8";
                      return (
                        <div
                          key={v.id}
                          className={`vivienda-card${tieneVecinos ? " vivienda-card--vecinos" : " vivienda-card--vacia"}`}
                          title={tieneVecinos ? `${v.numVecinos} vecino${v.numVecinos !== 1 ? "s" : ""} registrados` : "Sin vecinos registrados"}
                          onClick={() => {
                            if (!tieneVecinos) {
                              setAvisoSinVecinos(esPorCalles ? v.identificador : (v.planta ? `${v.planta}º${v.identificador}` : v.identificador));
                              return;
                            }
                            setAvisoSinVecinos(null);
                            seleccionarVivienda(v);
                          }}
                        >
                          {esPorCalles ? <IcoCasa color={iconColor} /> : <IcoBloque color={iconColor} />}
                          <span className="vivienda-card-num">{v.identificador}</span>
                          {!esPorCalles && v.planta && (
                            <span className="vivienda-card-planta">{v.planta}ª</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {avisoSinVecinos && (
                  <div className="explora-aviso-sin-vecinos">
                    La vivienda <strong>{avisoSinVecinos}</strong> no tiene vecinos registrados.
                    Contacta con el administrador.
                  </div>
                )}
              </>
            )}

            {/* NIVEL 3 — Lista vecinos */}
            {nivelExplora === 3 && (
              <>
                {cargandoPersonas && <div className="explora-empty">Cargando vecinos...</div>}
                {!cargandoPersonas && personasVivienda.length === 0 && (
                  <div className="explora-empty">
                    No hay vecinos registrados en esta vivienda.<br />
                    Contacta con el administrador para darlos de alta.
                  </div>
                )}
                {personasVivienda.map((v) => {
                  const accesoActivo = personasDentro.find(a => a.personaId === v.personaId);
                  const estaDentro = !!accesoActivo;
                  return (
                    <div key={v.id} className={`vecino-fila${estaDentro ? " dentro" : ""}`}>
                      <AvatarUsuario
                        usuario={{ nombre: v.personaNombreCompleto, fotoPerfil: v.personaFotoPerfil || null }}
                        size={40}
                      />
                      <div className="vecino-info">
                        <div className="vecino-nombre">{v.personaNombreCompleto}</div>
                        <span
                          className="explora-persona-rol"
                          style={ROL_COLORS[v.rolEnVivienda] || {}}
                        >
                          {ROL_LABELS[v.rolEnVivienda] || v.rolEnVivienda}
                        </span>
                      </div>
                      <div className="vecino-acciones">
                        {estaDentro && (
                          <span className="explora-dentro-badge">Dentro</span>
                        )}
                        {estaDentro ? (
                          <button
                            className="explora-btn-salida"
                            onClick={() => registrarSalidaAcceso(accesoActivo.id)}
                          >
                            Salida
                          </button>
                        ) : (
                          <button
                            className="explora-btn-entrada"
                            onClick={() => registrarEntradaDesdeExplora(v)}
                          >
                            Entrada
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button className="explora-btn-invitados" onClick={abrirInvitadosDesdeExplora}>
                  + Invitados de esta vivienda
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* PERSONAS DENTRO AHORA */}
      <div className="operativa-seccion">
        <div className="detalle-section-title">
          <div>
            <h3>Personas dentro ahora</h3>
            <p>Toca "Salida" para registrar que han salido.</p>
          </div>
        </div>

        {cargando && <div className="detalle-empty">Cargando...</div>}

        {!cargando && personasDentro.length === 0 && (
          <div className="detalle-empty">No hay nadie dentro en este momento.</div>
        )}

        {personasDentro.map((acceso) => (
          <div key={acceso.id} className="operativa-dentro-row">
            <div className="operativa-persona-info">
              <strong>{acceso.personaNombreCompleto}</strong>
              <span>{acceso.calleNombre
                ? `${acceso.calleNombre} ${acceso.viviendaIdentificador}`
                : acceso.bloqueCodigo
                  ? `Bloque ${acceso.bloqueCodigo} · ${acceso.viviendaIdentificador}`
                  : acceso.viviendaIdentificador}</span>
              <span className="operativa-hora">
                Entrada: {acceso.horaEntrada}
                {acceso.horaEntrada && <em> · {tiempoTranscurrido(acceso.horaEntrada)}</em>}
              </span>
            </div>
            <button className="btn-salida" onClick={() => registrarSalidaAcceso(acceso.id)}>
              Salida
            </button>
          </div>
        ))}
      </div>

      {/* INVITADOS ACTIVOS */}
      <div className="operativa-seccion">
        <div className="detalle-section-title">
          <div>
            <h3>Invitados activos</h3>
            <p>Máximo {piscina.maxInvitadosPorVivienda ?? "—"} invitados por vivienda.</p>
          </div>
          <button className="detalle-primary-btn" onClick={() => setModalInvitados(true)}>
            + Registrar invitados
          </button>
        </div>

        {invitadosActivos.length === 0 && (
          <div className="detalle-empty">No hay invitados activos.</div>
        )}

        {invitadosActivos.map((reg) => (
          <div key={reg.id} className="operativa-invitado-row">
            <div>
              <strong>{reg.cantidadInvitados} invitado(s)</strong>
              <span>{reg.viviendaIdentificador}</span>
              <span className="operativa-hora">Entrada: {reg.horaEntrada}</span>
            </div>
            <button className="btn-salida" onClick={() => registrarSalidaGrupoInvitados(reg.id)}>
              Salida
            </button>
          </div>
        ))}
      </div>

      {/* MODAL REGISTRAR INVITADOS */}
      {modalInvitados && (
        <div className="modal-backdrop">
          <div className="modal modal-large">
            <h2>Registrar invitados</h2>
            <p>Selecciona la vivienda e indica cuántos invitados entran.</p>

            {viviendaInvitadosLabel ? (
              <p style={{ fontWeight: 600, color: "var(--blue-700)", marginBottom: 8 }}>
                Vivienda: {viviendaInvitadosLabel}
              </p>
            ) : (
              <SelectorEstructura
                piscinaId={piscina.id}
                tipoUrbanizacion={piscina.tipoUrbanizacion}
                onSelectVivienda={(id) => setViviendaInvitados(id)}
                mostrarPersonas={false}
              />
            )}

            <label className="file-label">Cantidad de invitados</label>
            <input
              type="number"
              min="1"
              max={piscina.maxInvitadosPorVivienda || 99}
              value={cantidadInvitados}
              onChange={(e) => setCantidadInvitados(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => {
                  setModalInvitados(false);
                  setCantidadInvitados(1);
                  setViviendaInvitados(null);
                  setViviendaInvitadosLabel(null);
                }}
              >
                Cancelar
              </button>
              <button className="modal-save" onClick={confirmarInvitados}>
                Confirmar entrada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OperativaTab;
