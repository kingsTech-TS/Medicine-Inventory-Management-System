"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Calendar,
  Bell,
  Search,
  Filter,
  CheckCircle,
  X,
  Clock,
  Zap,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api, type Alert } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type EnhancedAlert = Alert & {
  alertType: "stock" | "expiry";
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<EnhancedAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const router = useRouter();
  const { toast } = useToast();

  // Restock State
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<Alert | null>(null);
  const [restockAmount, setRestockAmount] = useState("");

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      // Fetch from both endpoints
      const [stockAlerts, expiringMedicines] = await Promise.all([
        api.getAlerts(),
        api.getExpiringMedicines(),
      ]);

      // Process stock alerts
      const processedStock: EnhancedAlert[] = stockAlerts.map((a) => ({
        ...a,
        alertType: "stock",
      }));

      // Process expiring medicines (map Medicine type to Alert type structure roughly)
      const processedExpiry: EnhancedAlert[] = (expiringMedicines || []).map(
        (m: any) => ({
          medicineId: m.id,
          medicineName: m.name,
          currentStock: m.quantity,
          minStock: m.minStock,
          status: m.status,
          category: m.category,
          manufacturer: m.manufacturer,
          batchNumber: m.batchNumber,
          expiryDate: m.expiryDate,
          price: m.price,
          timestamp: new Date().toISOString(), // Fallback
          daysRemaining: m.daysRemaining || null,
          alertType: "expiry" as const,
        }),
      );

      // Merge and de-duplicate by ID, but prioritize stock alerts if both exist
      const alertMap = new Map<number, EnhancedAlert>();

      processedExpiry.forEach((a) => alertMap.set(a.medicineId, a));
      processedStock.forEach((a) => alertMap.set(a.medicineId, a));

      setAlerts(Array.from(alertMap.values()));
    } catch (error) {
      console.error("Failed to fetch alerts", error);
      toast({
        title: "Error",
        description: "Failed to fetch stock and expiry alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      router.push("/");
      return;
    }
    fetchAlerts();
  }, [router]);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.medicineName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let typeFilterMatch = true;
    if (filterType === "critical") typeFilterMatch = alert.currentStock === 0;
    else if (filterType === "low-stock")
      typeFilterMatch =
        alert.currentStock > 0 && alert.currentStock <= alert.minStock;
    else if (filterType === "expiring")
      typeFilterMatch =
        alert.alertType === "expiry" || alert.status === "Near Expiry";

    return matchesSearch && typeFilterMatch;
  });

  const getAlertIcon = (alert: EnhancedAlert) => {
    if (alert.currentStock === 0) return <Zap className="w-4 h-4" />;
    if (alert.alertType === "expiry" || alert.status === "Near Expiry")
      return <AlertCircle className="w-4 h-4" />;
    if (alert.currentStock <= alert.minStock)
      return <AlertTriangle className="w-4 h-4" />;
    return <Bell className="w-4 h-4" />;
  };

  const getAlertColor = (alert: EnhancedAlert) => {
    if (alert.currentStock === 0)
      return "bg-red-50 border-red-200 text-red-800";
    if (alert.status === "Near Expiry" || alert.alertType === "expiry")
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    if (alert.currentStock <= alert.minStock)
      return "bg-orange-50 border-orange-200 text-orange-800";
    return "bg-gray-50 border-gray-200 text-gray-800";
  };

  const getPriorityBadge = (alert: EnhancedAlert): string => {
    if (alert.currentStock === 0)
      return "bg-red-100 text-red-800 border-red-200";
    if (alert.status === "Near Expiry" || alert.alertType === "expiry")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  const handleRestockClick = (alert: Alert) => {
    setRestockItem(alert);
    setRestockAmount("");
    setIsRestockModalOpen(true);
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem || !restockAmount) return;

    try {
      setLoading(true);
      await api.restockMedicine(
        restockItem.medicineId,
        parseInt(restockAmount),
      );
      toast({
        title: "Restocked Successfully",
        description: `Added ${restockAmount} units to ${restockItem.medicineName}`,
        className: "bg-emerald-500 text-white border-none",
      });
      setIsRestockModalOpen(false);
      fetchAlerts();
    } catch (error) {
      toast({
        title: "Restock Failed",
        description:
          error instanceof Error ? error.message : "Could not restock medicine",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (isNaN(diffInHours)) return "Recently";
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const criticalCount = alerts.filter((a) => a.currentStock === 0).length;
  const lowStockCount = alerts.filter(
    (a) => a.currentStock > 0 && a.currentStock <= a.minStock,
  ).length;
  const expiringCount = alerts.filter(
    (a) => a.alertType === "expiry" || a.status === "Near Expiry",
  ).length;

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                Stock & Expiry Alerts
              </h2>
              <p className="text-gray-600">
                Monitor critical stock levels and upcoming medicine expiries
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={fetchAlerts}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {criticalCount}
                </div>
                <div className="text-sm text-gray-500">Critical</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {lowStockCount}
                </div>
                <div className="text-sm text-gray-500">Low Stock</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">
                  {expiringCount}
                </div>
                <div className="text-sm text-gray-500">Expiring</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alert Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Out of Stock
                    </p>
                    <p className="text-3xl font-bold text-red-800">
                      {criticalCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Low Stock
                    </p>
                    <p className="text-3xl font-bold text-orange-800">
                      {lowStockCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Expiring Soon
                    </p>
                    <p className="text-3xl font-bold text-yellow-800">
                      {expiringCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by medicine name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-200">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="critical">Critical (0)</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>Active Alerts ({filteredAlerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {loading ? (
                <div className="text-center py-12">Loading alerts...</div>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={`${alert.alertType}-${alert.medicineId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${getAlertColor(alert)}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getAlertIcon(alert)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {alert.medicineName}
                            </h3>
                            <Badge className={getPriorityBadge(alert)}>
                              {alert.currentStock === 0
                                ? "CRITICAL"
                                : alert.alertType === "expiry" ||
                                    alert.status === "Near Expiry"
                                  ? "EXPIRING"
                                  : "LOW STOCK"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {alert.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {alert.currentStock === 0
                              ? "Item is completely out of stock!"
                              : alert.alertType === "expiry" ||
                                  alert.status === "Near Expiry"
                                ? `Item is expiring on ${alert.expiryDate}. Please prioritize dispensing.`
                                : `Stock level: ${alert.currentStock} units remaining (Minimum: ${alert.minStock})`}
                            {alert.daysRemaining !== null && (
                              <span className="ml-2 font-medium text-red-600">
                                ({alert.daysRemaining} days remaining)
                              </span>
                            )}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(alert.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Expires: {alert.expiryDate || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => handleRestockClick(alert)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Restock
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {!loading && filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">
                  No alerts found
                </h3>
                <p className="text-gray-400">
                  Inventory levels and expiries are currently within safe
                  limits.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Restock Modal */}
        <Dialog open={isRestockModalOpen} onOpenChange={setIsRestockModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restock Medicine</DialogTitle>
              <DialogDescription>
                Add stock to <strong>{restockItem?.medicineName}</strong>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Quantity to Add</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  placeholder="Enter units..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRestockModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Confirm Restock
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
