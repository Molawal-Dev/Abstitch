"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, FolderTree } from "lucide-react";
import { useConfirm } from "@/components/ui/ConfirmModal";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Products", href: "/admin/products", icon: <Package size={18} /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingBag size={18} /> },
  { label: "Categories", href: "/admin/categories", icon: <FolderTree size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const confirm = useConfirm();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const confirmed = await confirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out of the admin panel?",
      confirmLabel: "Yes, Sign Out",
      cancelLabel: "Cancel",
      variant: "warning",
      icon: "logout",
    });
    if (!confirmed) return;
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <span className="font-serif text-xl font-bold text-white tracking-wider">ABSTITCH</span>
        <p className="font-sans text-[10px] tracking-widest text-white/40 mt-0.5 uppercase">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors",
                isActive
                  ? "bg-burgundy-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-56 bg-gray-900 flex-shrink-0 fixed top-0 left-0 h-screen z-40">
        <SidebarContent />
      </aside>

      <div className="hidden md:block w-56 flex-shrink-0" />

      <div className="md:hidden flex items-center justify-between bg-gray-900 px-4 py-3">
        <span className="font-serif text-lg font-bold text-white">ABSTITCH Admin</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-56 bg-gray-900">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
