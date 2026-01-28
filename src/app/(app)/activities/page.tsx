"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, type Activity } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Activity as ActivityIcon,
  RefreshCw,
  User,
  Clock,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await api.getActivities();
      setActivities(data || []);
    } catch (error) {
      console.error("Failed to fetch activities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActionColor = (action: string) => {
    if (!action) return "bg-gray-100 text-gray-800";
    const lower = action.toLowerCase();
    if (lower.includes("add") || lower.includes("create"))
      return "bg-emerald-100 text-emerald-800";
    if (lower.includes("delete") || lower.includes("remove"))
      return "bg-red-100 text-red-800";
    if (lower.includes("update") || lower.includes("edit"))
      return "bg-blue-100 text-blue-800";
    if (lower.includes("login")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatTimestamp = (ts: string) => {
    if (!ts) return "N/A";
    try {
      return new Date(ts).toLocaleString();
    } catch (e) {
      return ts;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800 flex items-center gap-3">
              <ActivityIcon className="w-8 h-8 text-emerald-500" />
              System Activities
            </h1>
            <p className="text-gray-600 mt-2">
              Log of all important actions within the system
            </p>
          </div>
          <Button
            onClick={fetchActivities}
            variant="outline"
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity Log</CardTitle>
            <CardDescription>
              Monitor user actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <Clock className="w-4 h-4 inline mr-1" /> Timestamp
                    </TableHead>
                    <TableHead className="w-[200px]">
                      <User className="w-4 h-4 inline mr-1" /> User
                    </TableHead>
                    <TableHead className="w-[150px]">
                      <ActivityIcon className="w-4 h-4 inline mr-1" /> Action
                    </TableHead>
                    <TableHead>
                      <FileText className="w-4 h-4 inline mr-1" /> Details
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <TableRow key={index} className="hover:bg-gray-50/50">
                        <TableCell className="font-mono text-sm text-gray-500 whitespace-nowrap">
                          {formatTimestamp(activity.timestamp)}
                        </TableCell>
                        <TableCell className="font-medium text-gray-700">
                          {activity.user}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${getActionColor(activity.action)} border-0`}
                          >
                            {activity.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {activity.details}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-gray-500"
                      >
                        No activities recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
