import { useCallback, useEffect, useState } from "react";
import { getPiscinas } from "../api/piscinaApi";

/**
 * Devuelve la lista de piscinas con estado de carga.
 * Expone `recargar` para refrescar manualmente.
 */
export function usePiscinas() {
  const [piscinas, setPiscinas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await getPiscinas();
      setPiscinas(response.data);
    } catch {
      setError("Error al cargar piscinas");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { piscinas, cargando, error, recargar: cargar };
}
