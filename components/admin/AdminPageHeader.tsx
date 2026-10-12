import { LucideIcon, Plus } from "lucide-react";
import { ReactNode } from "react";

export interface AdminPageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  children?: ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/80 mt-1">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-700/25 transition active:scale-95 shrink-0"
          >
            <ActionIcon className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
