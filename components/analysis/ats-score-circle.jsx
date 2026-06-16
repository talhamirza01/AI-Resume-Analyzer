"use client";

import { motion } from "framer-motion";
import { cn, getScoreColor, getScoreGradient } from "@/lib/utils";

export function AtsScoreCircle({ score = 0, size = 160, label = "ATS Score" }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/10"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={cn("stop-color-blue-500")} stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("text-4xl font-bold", getScoreColor(score))}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-medium text-slate-700 dark:text-slate-200">{label}</p>
        <div
          className={cn(
            "mt-1 h-1.5 w-20 rounded-full bg-gradient-to-r",
            getScoreGradient(score)
          )}
        />
      </div>
    </motion.div>
  );
}
