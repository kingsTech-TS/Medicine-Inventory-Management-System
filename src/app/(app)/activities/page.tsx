"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Activity } from "lucide-react"

export default function ActivitiesPage() {
    // There is no api.getActivities yet, checking api.ts... 
    // Wait, api.ts does not have getActivities?
    // Let's double check openapi.json. /activities exists.
    // I need to add getActivities to api.ts as well if it's missing.
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-500" />
                Activities
            </h1>
            <p className="text-gray-600">Recent system activities.</p>
        </div>
    )
}
