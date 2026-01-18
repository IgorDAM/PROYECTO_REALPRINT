import PropTypes from "prop-types";

export default function Button({
  children, 
  variant = "primary", 
  size = "md",
  icon,
  className = "",
  ...props 
}) {
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-blue",
    secondary: "bg-white border-2 border-surface-200 hover:border-primary-300 hover:bg-primary-50 text-surface-700",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white",
    ghost: "hover:bg-surface-100 text-surface-600 hover:text-primary-600",
    gold: "bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white shadow-gold",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger", "ghost", "gold"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  icon: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Ejemplo de uso:
 * <Button variant="success" size="lg">Guardar</Button>
 */
