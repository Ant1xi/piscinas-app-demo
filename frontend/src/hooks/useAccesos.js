import { useCallback, useEffect, useState } from "react";
import {
  getPersonasDentro,
  getCountDentro,
  getEntradasHoy,
  getInvitadosActivos,
} from "../api/accesoApi";

// Carga en paralelo (Promise.all) toda la información operativa de una piscina.
// El backend devuelve DTOs para los contadores:
//   PersonasDentroCountResponseDto  → { piscinaId, personasDentro }
//   AccesosHoyCountResponseDto      → { piscinaId, totalEntradasHoy }
// Por eso se extrae el campo numérico del objeto antes de guardarlo en estado.
export function useAccesos(piscinaId) {
  const [personasDentro, setPersonasDentro] = useState([]);
  const [invitadosActivos, setInvitadosActivos] = useState([]);
  const [countDentro, setCountDentro] = useState(0);
  const [entradasHoy, setEntradasHoy] = useState(0);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    if (!piscinaId) return;
    setCargando(true);
    try {
      const [dentroRes, countRes, hoyRes, invitadosRes] = await Promise.all([
        getPersonasDentro(piscinaId),
        getCountDentro(piscinaId),
        getEntradasHoy(piscinaId),
        getInvitadosActivos(piscinaId),
      ]);
      setPersonasDentro(dentroRes.data);
      // Los endpoints de conteo devuelven un DTO, no un número plano
      setCountDentro(countRes.data?.personasDentro ?? 0);
      setEntradasHoy(hoyRes.data?.totalEntradasHoy ?? 0);
      setInvitadosActivos(invitadosRes.data);
    } catch (err) {
      console.error("Error al cargar accesos:", err);
    } finally {
      setCargando(false);
    }
  }, [piscinaId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    personasDentro,
    invitadosActivos,
    countDentro,
    entradasHoy,
    cargando,
    recargar: cargar,
  };
}
