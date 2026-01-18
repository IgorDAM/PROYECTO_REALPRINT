export default function Input({ 
  label, 
  id, 
  type = "text", 
  className = "",
  error,
  ...props 
}) {
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
          bg-white border-2 border-surface-200
          text-surface-900 placeholder:text-surface-400
          focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
          transition-all duration-200
          ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
