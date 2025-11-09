export default function FloatingInput({ id, label, type = "text", ...props }) {
  return (
    <div className="input-group">
      <input id={id} type={type} placeholder=" " required {...props} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
