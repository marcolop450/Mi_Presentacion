import { SelectHTMLAttributes, forwardRef, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface AdminSelectOption {
  value: string | number;
  label: string;
}

export interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: AdminSelectOption[];
  children?: ReactNode;
}

const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, error, helperText, options, children, id, className = "", required, ...props }, ref) => {
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
        <div className="relative w-full">
          <select
            ref={ref}
            id={id}
            required={required}
            className={`w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border ${
              error
                ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
                : "border-slate-300 dark:border-teal-800 focus:ring-teal-500"
            } text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition cursor-pointer ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#07191d] text-slate-900 dark:text-white">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-teal-400 flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] text-slate-500 dark:text-teal-300/70 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

AdminSelect.displayName = "AdminSelect";

export default AdminSelect;
