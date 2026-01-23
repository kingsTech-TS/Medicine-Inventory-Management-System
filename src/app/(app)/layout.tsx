"use client"

import Sidebar from "@/components/Sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 md:pl-20 transition-all duration-300 ease-in-out md:group-hover:pl-64">
        {/* The sidebar handles its own collapsed/expanded state, 
            but the main content needs to be offset. 
            However, since the sidebar is 'fixed', we use padding. 
            Actually, the simple approach is a fixed padding for collapsed and 
            then a responsive one.
        */}
        <div className="pt-20 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
