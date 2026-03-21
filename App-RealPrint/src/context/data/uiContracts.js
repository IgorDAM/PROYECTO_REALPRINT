/**
 * Contratos de UI compartidos por paginas y componentes.
 * Se mantienen desacoplados de DataContext para facilitar la separacion por dominios.
 */
export const ESTADOS_PEDIDO = {
  pendiente: { label: "Pendiente", color: "bg-yellow-300 text-yellow-800" },
  en_proceso: { label: "En Proceso", color: "bg-blue-300 text-blue-800" },
  completado: { label: "Completado", color: "bg-green-300 text-green-800" },
  enviado: { label: "Enviado", color: "bg-purple-300 text-purple-800" },
  cancelado: { label: "Cancelado", color: "bg-red-300 text-red-800" },
};

export const SERVICIOS = [
  {
    value: "serigrafia",
    label: "Serigrafía",
    subservicios: [],
  },
  {
    value: "rotulacion",
    label: "Rotulación",
    subservicios: [],
  },
];

