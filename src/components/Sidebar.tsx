"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/dashboard" },
    { id: "inventory", label: "Inventory", icon: Package, path: "/inventory" },
    { id: "users", label: "Users", icon: Users, path: "/admin/users" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
  ]

  const activeTab =
    navItems.find((item) => pathname.startsWith(item.path))?.id ?? "overview"

  const NavContent = () => (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className={cn("flex items-center mb-10 px-2", collapsed ? "justify-center" : "space-x-3")}>
        <div className="p-2 bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 shrink-0">
          <Activity className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-serif font-bold text-gray-800"
          >
            MediTrack
          </motion.h1>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              router.push(item.path)
              setMobileOpen(false)
            }}
            className={cn(
              "flex items-center w-full rounded-xl transition-all duration-200 group relative",
              collapsed ? "justify-center p-3" : "px-4 py-3 space-x-3",
              activeTab === item.id
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "group-hover:scale-110 transition-transform")} />
            {!collapsed && (
              <span className="font-medium whitespace-nowrap">{item.label}</span>
            )}
            {collapsed && (
              <div className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-gray-100 space-y-2">
        <button
          onClick={() => {
            router.push("/profile")
            setMobileOpen(false)
          }}
          className={cn(
            "flex items-center w-full rounded-xl transition-all duration-200 group relative",
            collapsed ? "justify-center p-3" : "px-4 py-3 space-x-3",
            pathname === "/profile"
              ? "bg-gray-100 text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          )}
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          {!collapsed && <span className="font-medium">Settings</span>}
          {collapsed && (
            <div className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              Settings
            </div>
          )}
        </button>

        <button
          onClick={() => router.push("/")}
          className={cn(
            "flex items-center w-full rounded-xl transition-all duration-200 group relative text-gray-500 hover:bg-red-50 hover:text-red-600",
            collapsed ? "justify-center p-3" : "px-4 py-3 space-x-3"
          )}
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {!collapsed && <span className="font-medium">Logout</span>}
          {collapsed && (
            <div className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex mt-4 items-center justify-center w-full h-8 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  )

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
          collapsed ? "w-20" : "w-64"
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
                 <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                 </Button>
              </div>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
