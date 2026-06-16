"use client";

import { useEffect, useState } from "react";
import { History, Briefcase, Mail } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, getScoreColor } from "@/lib/utils";

export default function HistoryPage() {
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
      <Navbar title="History" description="View your past analyses, job matches, and cover letters" />
      <div className="p-4 lg:p-8">
        <Tabs defaultValue="analyses">
          <TabsList>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
            <TabsTrigger value="matches">Job Matches</TabsTrigger>
            <TabsTrigger value="letters">Cover Letters</TabsTrigger>
          </TabsList>

          <TabsContent value="analyses">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-5 w-5" /> Analysis History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
                ) : data?.analyses?.length > 0 ? (
                  <div className="space-y-3">
                    {data.analyses.map((a) => (
                      <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{a.resume?.title || "Resume Analysis"}</p>
                            <p className="text-xs text-slate-500 mt-1">{formatDate(a.createdAt)}</p>
                          </div>
                          <span className={`text-2xl font-bold ${getScoreColor(a.atsScore)}`}>{a.atsScore}</span>
                        </div>
                        {a.strengths?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {a.strengths.slice(0, 3).map((s, i) => (
                              <Badge key={i} variant="success">{s}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No analyses yet" description="Your ATS analysis history will appear here." href="/dashboard/upload" actionLabel="Analyze Resume" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Job Match History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
                ) : data?.jobMatches?.length > 0 ? (
                  <div className="space-y-3">
                    {data.jobMatches.map((m) => (
                      <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">{formatDate(m.createdAt)}</p>
                          <span className={`text-xl font-bold ${getScoreColor(m.matchScore)}`}>{m.matchScore}%</span>
                        </div>
                        <p className="text-sm mt-2 line-clamp-2 text-slate-600">{m.jobDescription}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No job matches yet" href="/dashboard/job-match" actionLabel="Match a Job" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="letters">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-5 w-5" /> Cover Letters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
                ) : data?.coverLetters?.length > 0 ? (
                  <div className="space-y-3">
                    {data.coverLetters.map((l) => (
                      <div key={l.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{l.jobTitle || "Cover Letter"}</p>
                            <p className="text-xs text-slate-500">{l.companyName} • {formatDate(l.createdAt)}</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2 line-clamp-3 text-slate-600">{l.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No cover letters yet" href="/dashboard/cover-letter" actionLabel="Generate Cover Letter" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
