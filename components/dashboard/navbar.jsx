"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";

export function Navbar({ title, description }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl px-4 lg:px-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 hidden sm:block">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-500 hover:bg-white/20 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9",
            },
          }}
        />
      </div>
    </header>
  );
}
