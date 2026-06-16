"use client";

import { motion } from "framer-motion";
import { FileText, TrendingUp, Zap, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getScoreColor } from "@/lib/utils";

const icons = {
  resumes: FileText,
  avgScore: TrendingUp,
  analyses: Zap,
  matches: Target,
};

export function StatsCards({ stats }) {
  const cards = [
    { key: "resumes", label: "Total Resumes", value: stats?.totalResumes ?? 0, color: "from-blue-500 to-cyan-500" },
    { key: "avgScore", label: "Avg ATS Score", value: stats?.avgScore ?? 0, color: "from-purple-500 to-pink-500", suffix: "/100" },
    { key: "analyses", label: "Analyses Run", value: stats?.totalAnalyses ?? 0, color: "from-amber-500 to-orange-500" },
    { key: "matches", label: "Job Matches", value: stats?.totalMatches ?? 0, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = icons[card.key];
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{card.label}</p>
                    <p
                      className={cn(
                        "mt-1 text-3xl font-bold",
                        card.key === "avgScore" ? getScoreColor(card.value) : "text-slate-900 dark:text-white"
                      )}
                    >
                      {card.value}
                      {card.suffix && (
                        <span className="text-lg text-slate-400">{card.suffix}</span>
                      )}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                      card.color
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
