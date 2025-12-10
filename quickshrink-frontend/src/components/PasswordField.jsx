import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const PasswordField = ({ id, label, placeholder }) => {
  const [show, setShow] = useState(false);
  const type = show ? "text" : "password";

  return (
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
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <LuEyeOff className="text-lg" /> : <LuEye className="text-lg" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;

