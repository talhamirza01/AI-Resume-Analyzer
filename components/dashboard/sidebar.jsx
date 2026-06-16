"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  PenTool,
  Briefcase,
  Mail,
  History,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload Resume", icon: Upload },
  { href: "/dashboard/analyzer", label: "Analyzer", icon: FileSearch },
  { href: "/dashboard/builder", label: "Resume Builder", icon: PenTool },
  { href: "/dashboard/job-match", label: "Job Match", icon: Briefcase },
  { href: "/dashboard/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex w-64 flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ResumeAI
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-600"
                    : "text-slate-600 hover:bg-white/10 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-4 border border-blue-500/20">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-slate-500">Unlimited AI analyses & cover letters</p>
          <Link
            href="/dashboard/settings"
            className="mt-3 inline-block text-xs font-medium text-blue-600 hover:underline"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex lg:hidden gap-1 overflow-x-auto border-b border-white/10 bg-white/5 backdrop-blur-xl p-2">
      {navItems.slice(0, 6).map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              isActive ? "bg-blue-600 text-white" : "text-slate-500"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label.split(" ")[0]}
          </Link>
        );
      })}
    </nav>
  );
}
