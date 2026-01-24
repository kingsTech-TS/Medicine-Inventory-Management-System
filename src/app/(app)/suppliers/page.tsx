"use client"

import { Users } from "lucide-react"

export default function SuppliersPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-500" />
                Suppliers
            </h1>
            <p className="text-gray-600">Supplier management and alerts.</p>
        </div>
    )
}
