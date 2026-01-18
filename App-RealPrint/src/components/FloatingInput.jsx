export default function FloatingInput({ id, label, type = "text", ...props }) {
  return (
    <div className="relative">
      <input 
        id={id} 
        type={type} 
        placeholder=" " 
        required 
        className="peer w-full h-14 px-4 pt-4 border-2 border-surface-200 rounded-xl text-surface-900 placeholder-transparent focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all duration-200 bg-white"
        {...props} 
      />
      <label 
        htmlFor={id}
        className="absolute left-4 top-4 text-surface-400 text-base transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary-600"
      >
        {label}
      </label>
    </div>
  );
}
