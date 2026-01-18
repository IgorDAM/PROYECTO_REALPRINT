import PropTypes from "prop-types";

export default function Input({
  label, 
  id, 
  type = "text", 
  className = "",
  error,
  ...props 
}) {
  const isNumber = type === "number";
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-surface-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full rounded-xl h-12 px-4
          ${isNumber ? "bg-gray-50 border-2 border-primary-300 text-lg font-bold" : "bg-white border-2 border-surface-200"}
          text-surface-900 placeholder:text-surface-400
          focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-200
          transition-all duration-200
          ${isNumber ? "hover:border-primary-500 hover:bg-primary-50 focus:bg-primary-50" : ""}
          ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
};

/**
 * Ejemplo de uso:
 * <Input label="Cantidad" type="number" value={valor} onChange={...} />
 */
