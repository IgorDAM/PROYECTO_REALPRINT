export default function Textarea({ 
  label, 
  id, 
  className = "",
  rows = 4,
  ...props 
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-surface-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`
          w-full rounded-xl p-4 
          bg-white border-2 border-surface-200
          text-surface-900 placeholder:text-surface-400
          focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
          transition-all duration-200 resize-none
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
