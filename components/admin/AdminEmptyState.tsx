import { LucideIcon, Plus } from "lucide-react";

export interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: AdminEmptyStateProps) {
  return (
    <div className="text-center py-12 rounded-3xl p-6 border border-slate-300 dark:border-teal-800/60 bg-white/80 dark:bg-[#07191d]/80">
      <Icon className="w-8 h-8 text-teal-400 mx-auto mb-2" />
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1 max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
