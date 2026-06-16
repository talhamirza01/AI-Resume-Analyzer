"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Crown } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const planFeatures = {
  FREE: ["5 AI analyses per month", "Resume builder", "ATS scoring", "PDF export", "Job matching"],
  PRO: ["Unlimited AI analyses", "Advanced ATS scoring", "Cover letter generator", "Job match system", "Priority support", "Analysis report export"],
};

export default function SettingsPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setSubscription(data?.subscription))
      .finally(() => setLoading(false));
  }, []);

  async function handlePlanChange(plan) {
    setUpgrading(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubscription(data.subscription);
      toast.success(`Switched to ${plan} plan!`);
    } catch (err) {
      toast.error(err.message || "Failed to update plan");
    } finally {
      setUpgrading(false);
    }
  }

  return (
    <div>
      <Navbar title="Settings" description="Manage your subscription and account preferences" />
      <div className="p-4 lg:p-8 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>Choose the plan that fits your job search needs</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-48" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {["FREE", "PRO"].map((plan) => {
                  const isCurrent = subscription?.plan === plan;
                  return (
                    <div
                      key={plan}
                      className={`rounded-2xl border p-6 transition-all ${
                        isCurrent
                          ? "border-purple-500 bg-purple-500/5 ring-2 ring-purple-500/20"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {plan === "PRO" && <Crown className="h-5 w-5 text-amber-500" />}
                          <h3 className="font-bold text-lg">{plan}</h3>
                        </div>
                        {isCurrent && <Badge variant="success">Current</Badge>}
                      </div>
                      <p className="text-3xl font-bold mt-3">
                        {plan === "FREE" ? "$0" : "$19"}
                        <span className="text-sm font-normal text-slate-500">/mo</span>
                      </p>
                      <ul className="mt-4 space-y-2">
                        {planFeatures[plan].map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {!isCurrent && (
                        <Button
                          className="w-full mt-6"
                          variant={plan === "PRO" ? "default" : "outline"}
                          onClick={() => handlePlanChange(plan)}
                          disabled={upgrading}
                        >
                          {upgrading ? "Updating..." : `Switch to ${plan}`}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-20" />
            ) : (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm text-slate-500">Analyses used this month</p>
                <p className="text-2xl font-bold mt-1">
                  {subscription?.analysesUsed || 0}
                  {subscription?.plan === "FREE" && (
                    <span className="text-base font-normal text-slate-400">
                      {" "}/ {subscription?.analysisLimit || 5}
                    </span>
                  )}
                  {subscription?.plan === "PRO" && (
                    <span className="text-base font-normal text-slate-400"> (Unlimited)</span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
