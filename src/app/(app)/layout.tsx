"use client"

import Sidebar from "@/components/Sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      {/* Main content with proper offset for desktop sidebar and mobile header */}
      <main className="min-h-screen pt-16 md:pt-0 md:pl-64">
        {children}
      </main>
    </div>
  )
}
