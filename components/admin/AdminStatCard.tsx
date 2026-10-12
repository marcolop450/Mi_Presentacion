import { LucideIcon, ChevronRight } from "lucide-react";

export interface AdminStatCardProps {
  label: string;
  count: number | string;
  sub?: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  actionText?: string;
}

export default function AdminStatCard({
  label,
  count,
  sub,
  icon: Icon,
  color,
  onClick,
  actionText = "Gestionar sección",
}: AdminStatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-700/60 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group hover:scale-[1.01] w-full"
    >
      <div className="flex items-center justify-between mb-4 w-full">
        <span className="text-xs font-bold text-slate-600 dark:text-teal-200/80">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center text-white shadow-sm shrink-0`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white">
          {count}
        </div>
        {sub && (
          <div className="text-[11px] text-slate-500 dark:text-teal-300/70 mt-0.5">
            {sub}
          </div>
        )}
        <div className="text-[11px] font-mono text-teal-700 dark:text-teal-300 mt-1 flex items-center gap-1 font-semibold">
          <span>{actionText}</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );
}
