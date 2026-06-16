import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getScoreColor(score) {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

export function getScoreGradient(score) {
  if (score >= 80) return "from-emerald-500 to-teal-400";
  if (score >= 60) return "from-amber-500 to-orange-400";
  return "from-red-500 to-rose-400";
}
