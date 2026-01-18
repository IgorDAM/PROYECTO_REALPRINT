import PropTypes from "prop-types";

export default function Select({
  label, 
  id, 
  options = [], 
  placeholder = "Selecciona una opción",
  className = "",
  ...props 
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-surface-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full rounded-xl h-12 px-4 
          bg-white border-2 border-surface-200
          text-surface-900
          focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
          transition-all duration-200 cursor-pointer
          ${className}
        `}
        {...props}
      >
        <option value="" className="text-surface-400">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
 
Select.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  })),
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Ejemplo de uso:
 * <Select label="Servicio" options={[{value: 'a', label: 'A'}]} />
 */
