"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Sparkles,
  FileSearch,
  PenTool,
  Briefcase,
  Mail,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileSearch,
    title: "ATS Resume Analyzer",
    description: "Get instant ATS scores with AI-powered feedback and keyword optimization.",
  },
  {
    icon: PenTool,
    title: "Resume Builder",
    description: "Build professional resumes step-by-step with live preview and AI assistance.",
  },
  {
    icon: Briefcase,
    title: "Job Match System",
    description: "Compare your resume against job descriptions and find missing skills.",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description: "Generate tailored cover letters based on your resume and target role.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["5 AI analyses/month", "Resume builder", "ATS scoring", "PDF export"],
  },
  {
    name: "Pro",
    price: "$19",
    popular: true,
    features: [
      "Unlimited AI analyses",
      "Advanced ATS scoring",
      "Cover letter generator",
      "Job match system",
      "Priority support",
    ],
  },
];

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Get Started</Button>
                </SignUpButton>
              </>
            ) : (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-600">
              <Zap className="h-4 w-4" /> Powered by OpenAI
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Build Resumes That{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get You Hired
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
              AI-powered resume builder and analyzer. Get ATS scores, optimize keywords,
              match job descriptions, and generate cover letters — all in one platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isSignedIn ? (
                <SignUpButton mode="modal">
                  <Button size="lg" className="gap-2">
                    Start Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </SignUpButton>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/dashboard" className="gap-2">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See Features</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <Card className="overflow-hidden p-1">
              <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "ATS Score", value: "92", color: "text-emerald-500" },
                    { label: "Keywords Match", value: "87%", color: "text-blue-500" },
                    { label: "Job Fit", value: "High", color: "text-purple-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything You Need to Land Your Dream Job</h2>
            <p className="mt-3 text-slate-500">Professional tools powered by cutting-edge AI</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-slate-500">Start free, upgrade when you need more</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.popular ? "ring-2 ring-purple-500 relative" : ""}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-0.5 text-xs text-white font-medium">
                    Most Popular
                  </span>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-500">/month</span>
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {!isSignedIn ? (
                    <SignUpButton mode="modal">
                      <Button className="w-full mt-8" variant={plan.popular ? "default" : "outline"}>
                        Get Started
                      </Button>
                    </SignUpButton>
                  ) : (
                    <Button className="w-full mt-8" variant={plan.popular ? "default" : "outline"} asChild>
                      <Link href="/dashboard/settings">Choose Plan</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 lg:px-8">
        <Card className="mx-auto max-w-4xl overflow-hidden">
          <CardContent className="p-12 text-center bg-gradient-to-br from-blue-600/10 to-purple-600/10">
            <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Ready to Optimize Your Career?</h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto">
              Join thousands of job seekers using AI to create standout resumes and land interviews faster.
            </p>
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <Button size="lg" className="mt-8 gap-2">
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
            ) : (
              <Button size="lg" className="mt-8 gap-2" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} ResumeAI. Built with Next.js, OpenAI, and Clerk.</p>
      </footer>
    </div>
  );
}
