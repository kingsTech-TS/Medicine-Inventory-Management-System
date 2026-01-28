"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api, type UserProfile, type Alert } from "@/lib/api";
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
import { Button } from "@/components/ui/button";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [suppliersData, alertsData] = await Promise.all([
        api.getSuppliers(),
        api.getAlerts(), // Using general alerts to see which ones have suppliers
      ]);
      setSuppliers(suppliersData || []);
      setAlerts(alertsData || []);
    } catch (error) {
      console.error("Failed to fetch supplier data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAlertsForSupplier = (username: string) => {
    return alerts.filter((a: any) => a.supplier === username);
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
              <Users className="w-8 h-8 text-emerald-500" />
              Supplier Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage medicine suppliers and their stock alerts
            </p>
          </div>
          <Button
            onClick={fetchData}
            variant="outline"
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Active Suppliers</CardTitle>
              <CardDescription>
                List of registered suppliers and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Stock Alerts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4}>
                            <div className="h-8 bg-gray-100 animate-pulse rounded" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : suppliers.length > 0 ? (
                      suppliers.map((supplier) => {
                        const supplierAlerts = getAlertsForSupplier(
                          supplier.username,
                        );
                        return (
                          <TableRow
                            key={supplier.username}
                            className="hover:bg-gray-50/50"
                          >
                            <TableCell>
                              <div className="font-medium text-gray-800">
                                {supplier.firstName} {supplier.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{supplier.username}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col space-y-1">
                                <span className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail className="w-3 h-3" /> {supplier.email}
                                </span>
                                <span className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-3 h-3" />{" "}
                                  {supplier.phoneNumber || "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-start gap-2 text-sm text-gray-600 max-w-xs">
                                <MapPin className="w-3 h-3 mt-1 shrink-0" />
                                <span>
                                  {supplier.address || "No address provided"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {supplierAlerts.length > 0 ? (
                                <Badge
                                  variant="destructive"
                                  className="flex items-center gap-1 w-fit"
                                >
                                  <AlertCircle className="w-3 h-3" />
                                  {supplierAlerts.length} Alerts
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="bg-emerald-100 text-emerald-800 border-0"
                                >
                                  All good
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-gray-500"
                        >
                          No suppliers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
