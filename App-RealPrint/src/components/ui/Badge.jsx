import PropTypes from "prop-types";

export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-surface-100 text-surface-600 border border-surface-200",
    pendiente: "bg-amber-50 text-amber-700 border border-amber-200",
    en_proceso: "bg-blue-50 text-blue-700 border border-blue-200",
    completado: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    enviado: "bg-purple-50 text-purple-700 border border-purple-200",
    cancelado: "bg-red-50 text-red-700 border border-red-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    gold: "bg-gradient-to-r from-gold-100 to-gold-50 text-gold-700 border border-gold-300",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
 
Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Ejemplo de uso:
 * <Badge variant="success">Activo</Badge>
 */
