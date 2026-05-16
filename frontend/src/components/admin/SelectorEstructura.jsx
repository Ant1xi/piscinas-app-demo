// Selector de estructura interna de una piscina en cascada:
//   Calle  → Vivienda → Persona (opcional)   [tipoUrbanizacion === "CALLES"]
//   Bloque → Vivienda → Persona (opcional)   [tipoUrbanizacion === "BLOQUES"]
//
// El tipo de estructura es un enum del backend (CALLES | BLOQUES) que determina
// el primer nivel del árbol: las urbanizaciones con calles usan la tabla "calle",
// las de bloques usan "bloque". Ambas desembocan en "vivienda" y luego "persona".
//
// Cada selección dispara una carga lazy del siguiente nivel:
//   1. Al montar: carga calles o bloques según tipoUrbanizacion
//   2. Al seleccionar calle/bloque: carga viviendas de esa unidad
//   3. Al seleccionar vivienda: notifica via onSelectVivienda y carga personas si mostrarPersonas=true
//
// Props:
//   piscinaId        – ID de la piscina
//   tipoUrbanizacion – "CALLES" | "BLOQUES"
//   onSelectVivienda – callback(viviendaId|null) cuando cambia la selección
//   mostrarPersonas  – si true, muestra un 3er select de personas
//   onSelectPersona  – callback(personaId|null) si mostrarPersonas=true
import { useEffect, useState } from "react";
import {
  getCallesPiscina,
  getBloquesPiscina,
  getViviendasCalle,
  getViviendasBloque,
  getPersonasVivienda,
} from "../../api/estructuraApi";
function SelectorEstructura({
  piscinaId,
  tipoUrbanizacion,
  onSelectVivienda,
  mostrarPersonas = false,
  onSelectPersona,
}) {
  const [calles, setCalles] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [viviendas, setViviendas] = useState([]);
  const [personas, setPersonas] = useState([]);

  const [calleId, setCalleId] = useState("");
  const [bloqueId, setBloqueId] = useState("");
  const [viviendaId, setViviendaId] = useState("");
  const [personaId, setPersonaId] = useState("");

  const esPorCalles = tipoUrbanizacion === "CALLES";

  // Carga calles o bloques al montar
  useEffect(() => {
    if (!piscinaId) return;
    if (esPorCalles) {
      getCallesPiscina(piscinaId)
        .then((r) => setCalles(r.data))
        .catch(() => setCalles([]));
    } else {
      getBloquesPiscina(piscinaId)
        .then((r) => setBloques(r.data))
        .catch(() => setBloques([]));
    }
  }, [piscinaId, esPorCalles]);

  // Carga viviendas al seleccionar calle o bloque
  useEffect(() => {
    setViviendaId("");
    setPersonaId("");
    setViviendas([]);
    setPersonas([]);

    const estructuraId = esPorCalles ? calleId : bloqueId;
    if (!estructuraId) return;

    const llamada = esPorCalles
      ? getViviendasCalle(estructuraId)
      : getViviendasBloque(estructuraId);

    llamada
      .then((r) => setViviendas(r.data))
      .catch(() => setViviendas([]));
  }, [calleId, bloqueId, esPorCalles]);

  // Carga personas al seleccionar vivienda
  useEffect(() => {
    setPersonaId("");
    setPersonas([]);

    if (!viviendaId) {
      if (onSelectVivienda) onSelectVivienda(null);
      return;
    }

    if (onSelectVivienda) onSelectVivienda(viviendaId);

    if (mostrarPersonas) {
      getPersonasVivienda(viviendaId)
        .then((r) => setPersonas(r.data))
        .catch(() => setPersonas([]));
    }
  }, [viviendaId, mostrarPersonas]);

  // Notifica persona seleccionada
  useEffect(() => {
    if (onSelectPersona) onSelectPersona(personaId || null);
  }, [personaId]);

  return (
    <div className="selector-estructura">
      {/* Calle o Bloque */}
      <div className="form-group">
        <label className="file-label">
          {esPorCalles ? "Calle" : "Bloque"}
        </label>
        {esPorCalles ? (
          <select
            value={calleId}
            onChange={(e) => setCalleId(e.target.value)}
          >
            <option value="">Selecciona una calle</option>
            {calles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        ) : (
          <select
            value={bloqueId}
            onChange={(e) => setBloqueId(e.target.value)}
          >
            <option value="">Selecciona un bloque</option>
            {bloques.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Vivienda */}
      {viviendas.length > 0 && (
        <div className="form-group">
          <label className="file-label">Vivienda</label>
          <select
            value={viviendaId}
            onChange={(e) => setViviendaId(e.target.value)}
          >
            <option value="">Selecciona una vivienda</option>
            {viviendas.map((v) => (
              <option key={v.id} value={v.id}>
                {v.identificador || v.nombre || `Vivienda ${v.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Persona (opcional) */}
      {mostrarPersonas && viviendaId && (
        <div className="form-group">
          <label className="file-label">Persona</label>
          <select
            value={personaId}
            onChange={(e) => setPersonaId(e.target.value)}
          >
            <option value="">Selecciona una persona</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellidos}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default SelectorEstructura;
