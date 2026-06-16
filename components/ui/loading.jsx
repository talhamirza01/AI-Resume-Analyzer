"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, size = "md" }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={cn(
        "rounded-full border-2 border-blue-500/30 border-t-blue-500",
        sizes[size],
        className
      )}
    />
  );
}

export function LoadingOverlay({ message = "Analyzing your resume..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-slate-500 animate-pulse">{message}</p>
    </div>
  );
}
