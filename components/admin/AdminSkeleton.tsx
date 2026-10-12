"use client";

export function AdminCardSkeleton() {
  return (
    <div className="p-5 rounded-3xl bg-white/70 dark:bg-[#07191d]/70 border border-slate-200 dark:border-teal-900/50 shadow-xs flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-teal-950 shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex gap-2">
                <div className="h-4 w-16 rounded-md bg-slate-200 dark:bg-teal-950" />
                <div className="h-4 w-12 rounded-md bg-slate-200 dark:bg-teal-950" />
              </div>
              <div className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-teal-950" />
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-3">
          <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-teal-950" />
          <div className="h-3.5 w-4/5 rounded bg-slate-200 dark:bg-teal-950" />
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-teal-950/80 flex items-center justify-between">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-teal-950" />
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-teal-950 flex items-center justify-end gap-2">
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-teal-950" />
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-teal-950" />
      </div>
    </div>
  );
}

export function AdminStatCardSkeleton() {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-[#07191d]/70 border border-slate-200 dark:border-teal-900/50 shadow-xs animate-pulse flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="h-4 w-28 rounded bg-slate-200 dark:bg-teal-950" />
        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-teal-950 shrink-0" />
      </div>
      <div>
        <div className="h-9 w-16 rounded-lg bg-slate-200 dark:bg-teal-950 mb-2" />
        <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-teal-950" />
      </div>
    </div>
  );
}

export function AdminPageSkeleton({
  cardCount = 6,
  hasFilter = true,
}: {
  cardCount?: number;
  hasFilter?: boolean;
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Encabezado Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-slate-200 dark:bg-teal-950" />
          <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200 dark:bg-teal-950" />
        </div>
        <div className="h-11 w-36 rounded-2xl bg-slate-200 dark:bg-teal-950 shrink-0" />
      </div>

      {/* Barra de Filtros Skeleton */}
      {hasFilter && (
        <div className="flex flex-col sm:flex-row gap-3 animate-pulse">
          <div className="h-10 w-full sm:max-w-md rounded-2xl bg-slate-200 dark:bg-teal-950" />
        </div>
      )}

      {/* Grid de Tarjetas Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: cardCount }).map((_, i) => (
          <AdminCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-7 animate-in fade-in duration-150">
      {/* Encabezado */}
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-72 rounded-xl bg-slate-200 dark:bg-teal-950" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200 dark:bg-teal-950" />
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <AdminStatCardSkeleton key={i} />
        ))}
      </div>

      {/* Secciones Administrativas */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#07191d]/70 border border-slate-200 dark:border-teal-900/50 shadow-xs animate-pulse">
        <div className="h-5 w-56 rounded bg-slate-200 dark:bg-teal-950 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-teal-950/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
