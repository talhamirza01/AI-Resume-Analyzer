import { Sidebar, MobileNav } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
