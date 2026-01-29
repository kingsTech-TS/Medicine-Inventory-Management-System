"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  Activity,
  Home,
  Package,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await api.getProfile();
        setUserRole(profile.role);
      } catch (e) {
        console.error("Failed to fetch user profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const allNavItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      path: "/dashboard",
      roles: ["admin", "pharmacist", "supplier"],
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      path: "/inventory",
      roles: ["admin", "pharmacist"],
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/admin/users",
      roles: ["admin"],
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      path: "/reports",
      roles: ["admin", "pharmacist", "supplier"],
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: Bell,
      path: "/alerts",
      roles: ["admin", "pharmacist", "supplier"],
    },
    {
      id: "activities",
      label: "Activities",
      icon: Activity,
      path: "/activities",
      roles: ["admin"],
    },
    {
      id: "suppliers",
      label: "Suppliers",
      icon: Users,
      path: "/suppliers",
      roles: ["pharmacist"],
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      path: "/messages",
      roles: ["admin", "pharmacist", "supplier"],
    },
    {
      id: "chat-inspection",
      label: "Chat Inspection",
      icon: Shield,
      path: "/admin/chat-inspection",
      roles: ["admin"],
    },
  ];

  const navItems = allNavItems.filter(
    (item) => userRole && item.roles.includes(userRole.toLowerCase()),
  );

  const activeTab =
    navItems.find((item) => pathname.startsWith(item.path))?.id ?? "overview";

  const NavContent = () => (
    <div
      className={cn("flex flex-col h-full py-6", collapsed ? "px-0" : "px-4")}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center mb-10 px-2 h-10",
          collapsed ? "justify-center" : "space-x-3",
        )}
      >
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 shrink-0">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.h1
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-xl font-serif font-bold text-gray-800 whitespace-nowrap overflow-hidden"
            >
              MediTrack
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <nav
        className={cn(
          "flex-1 space-y-2 custom-scrollbar",
          collapsed ? "overflow-visible" : "overflow-y-auto pr-2",
        )}
      >
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                router.push(item.path);
                setMobileOpen(false);
              }}
              className={cn(
                "flex items-center w-full transition-all duration-200 group relative",
                collapsed
                  ? "justify-center h-12"
                  : "px-4 py-3 space-x-3 rounded-xl",
                activeTab === item.id
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600",
                collapsed && activeTab === item.id && "rounded-none",
                !collapsed && "rounded-xl",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  activeTab === item.id
                    ? "text-white"
                    : "group-hover:scale-110 transition-transform",
                )}
              />
              {!collapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-1 group-hover:translate-x-0 z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-gray-900" />
                </div>
              )}
            </button>
          ))
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-gray-100 space-y-2">
        <button
          onClick={() => {
            router.push("/profile");
            setMobileOpen(false);
          }}
          className={cn(
            "flex items-center w-full transition-all duration-200 group relative",
            collapsed
              ? "justify-center h-12"
              : "px-4 py-3 space-x-3 rounded-xl",
            pathname === "/profile"
              ? "bg-gray-100 text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
          )}
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          {!collapsed && <span className="font-medium">Settings</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-1 group-hover:translate-x-0 z-50 whitespace-nowrap shadow-xl">
              Settings
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-gray-900" />
            </div>
          )}
        </button>

        <button
          onClick={() => router.push("/")}
          className={cn(
            "flex items-center w-full transition-all duration-200 group relative text-gray-500 hover:bg-red-50 hover:text-red-600",
            collapsed
              ? "justify-center h-12"
              : "px-4 py-3 space-x-3 rounded-xl",
          )}
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {!collapsed && <span className="font-medium">Logout</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-1 group-hover:translate-x-0 z-50 whitespace-nowrap shadow-xl">
              Logout
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-gray-900" />
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex mt-4 items-center justify-center w-full h-8 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header (Mobile only) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-emerald-500" />
          <h1 className="font-serif font-bold text-gray-800">MediTrack</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMobileOpen(true)}>
          <Menu className="w-6 h-6 text-gray-600" />
        </Button>
      </div>

      {/* Desktop Sidebar (Fixed left) */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-40 transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-72 bg-white z-[70] md:hidden"
            >
              <div className="absolute top-4 right-4 focus:outline-none">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-6 h-6 text-gray-400" />
                </Button>
              </div>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
