const AuthField = ({ id, label, placeholder, type = "text", rightIcon }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-semibold text-slate-700">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="block w-full rounded border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
      {rightIcon && (
        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">{rightIcon}</span>
      )}
    </div>
  </div>
);

export default AuthField;

