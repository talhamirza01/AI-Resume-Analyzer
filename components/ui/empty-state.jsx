"use client";

import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon = FileSearch,
  title = "No data yet",
  description = "Get started by uploading or building a resume.",
  actionLabel,
  onAction,
  href,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-16 px-6 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
        <Icon className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      {(actionLabel && onAction) && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {href && actionLabel && (
        <Button className="mt-6" asChild>
          <a href={href}>{actionLabel}</a>
        </Button>
      )}
    </div>
  );
}
