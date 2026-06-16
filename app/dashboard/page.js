"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, getScoreColor } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar
        title="Dashboard"
        description="Welcome back! Here's an overview of your resume activity."
      />
      <div className="p-4 lg:p-8 space-y-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <StatsCards stats={data?.stats} />
        )}

        {/* Quick actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/dashboard/upload", label: "Upload Resume", desc: "Analyze a PDF" },
            { href: "/dashboard/builder", label: "Build Resume", desc: "Create from scratch" },
            { href: "/dashboard/job-match", label: "Job Match", desc: "Compare with JD" },
            { href: "/dashboard/cover-letter", label: "Cover Letter", desc: "AI generation" },
          ].map((action, i) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={action.href}>
                <Card className="hover:shadow-xl transition-all cursor-pointer group">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="font-medium group-hover:text-blue-600 transition-colors">
                        {action.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent analyses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Recent Analyses
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/history">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              ) : data?.analyses?.length > 0 ? (
                <div className="space-y-3">
                  {data.analyses.slice(0, 5).map((analysis) => (
                    <div
                      key={analysis.id}
                      className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {analysis.resume?.title || "Resume Analysis"}
                        </p>
                        <p className="text-xs text-slate-500">{formatDate(analysis.createdAt)}</p>
                      </div>
                      <Badge variant={analysis.atsScore >= 80 ? "success" : analysis.atsScore >= 60 ? "warning" : "danger"}>
                        <span className={getScoreColor(analysis.atsScore)}>{analysis.atsScore}/100</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No analyses yet"
                  description="Upload a resume to get your first ATS score."
                  actionLabel="Upload Resume"
                  href="/dashboard/upload"
                />
              )}
            </CardContent>
          </Card>

          {/* Subscription info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-32" />
              ) : (
                <div className="rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary">{data?.subscription?.plan || "FREE"} Plan</Badge>
                      <p className="mt-3 text-sm text-slate-500">
                        {data?.subscription?.plan === "PRO"
                          ? "Unlimited AI analyses and cover letters"
                          : `${data?.subscription?.analysesUsed || 0} / ${data?.subscription?.analysisLimit || 5} analyses used this month`}
                      </p>
                    </div>
                    {data?.subscription?.plan !== "PRO" && (
                      <Button size="sm" asChild>
                        <Link href="/dashboard/settings">Upgrade</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
