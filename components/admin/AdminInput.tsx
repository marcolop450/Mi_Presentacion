import { InputHTMLAttributes, forwardRef } from "react";

export interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isMono?: boolean;
}

const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, helperText, isMono = false, id, className = "", required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          required={required}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border ${
            error
              ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
              : "border-slate-300 dark:border-teal-800 focus:ring-teal-500"
          } text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-teal-400/50 focus:outline-none focus:ring-2 transition ${
            isMono ? "font-mono" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] text-slate-500 dark:text-teal-300/70 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

AdminInput.displayName = "AdminInput";

export default AdminInput;
