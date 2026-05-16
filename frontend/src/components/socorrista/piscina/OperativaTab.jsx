// Tab de operativa de la piscina (vista socorrista).
// Delega en el componente admin reutilizando la misma vista de estado operativo.
import AdminOperativaTab from "../../admin/OperativaTab";

function OperativaTab({ piscina, mostrarMensaje }) {
  return <AdminOperativaTab piscina={piscina} mostrarMensaje={mostrarMensaje} />;
}

export default OperativaTab;
