// Tab de incidencias para el socorrista (solo lectura).
// Muestra las incidencias de la piscina sin permitir cambiar estados.
import AdminIncidenciasPiscinaTab from "../../admin/IncidenciasPiscinaTab";

function IncidenciasSocTab({ piscina, mostrarMensaje }) {
  return (
    <AdminIncidenciasPiscinaTab
      piscina={piscina}
      mostrarMensaje={mostrarMensaje}
      puedeGestionarEstado={false}
    />
  );
}

export default IncidenciasSocTab;
