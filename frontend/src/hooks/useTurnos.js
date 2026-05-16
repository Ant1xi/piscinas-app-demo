import { useCallback, useEffect, useState } from "react";
import { getTurnosPiscina } from "../api/turnoApi";

/**
 * Carga los turnos de una piscina para un rango de fechas dado.
 * Recarga automáticamente cuando cambian piscinaId, desde o hasta.
 */
export function useTurnos(piscinaId, desde, hasta) {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    if (!piscinaId || !desde || !hasta) return;
    setCargando(true);
    setError(null);
    try {
      const response = await getTurnosPiscina(piscinaId, desde, hasta);
      setTurnos(response.data);
    } catch {
      setError("Error al cargar turnos");
    } finally {
      setCargando(false);
    }
  }, [piscinaId, desde, hasta]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { turnos, cargando, error, recargar: cargar };
}
