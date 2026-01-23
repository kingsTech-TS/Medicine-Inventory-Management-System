"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Activity,
  Package,
  AlertTriangle,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Home,
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  X,
  Clock,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Mock alerts data
const mockAlerts = [
  {
    id: 1,
    type: "critical",
    category: "Low Stock",
    medicine: "Aspirin 75mg",
    message: "Critical stock level - Only 3 units remaining",
    details: "Minimum required: 30 units | Current: 3 units | Batch: ASP2024005",
    timestamp: "2024-01-15T10:30:00Z",
    priority: "high",
    status: "active",
    expiryDate: "2025-11-30",
  },
  {
    id: 2,
    type: "low-stock",
    category: "Low Stock",
    medicine: "Paracetamol 500mg",
    message: "Low stock alert - Only 8 units remaining",
    details: "Minimum required: 25 units | Current: 8 units | Batch: PAR2024002",
    timestamp: "2024-01-15T08:15:00Z",
    priority: "medium",
    status: "active",
    expiryDate: "2024-12-20",
  },
  {
    id: 3,
    type: "expiry",
    category: "Near Expiry",
    medicine: "Insulin Pen",
    message: "Expires in 5 days",
    details: "Expiry Date: 2024-09-10 | Quantity: 45 units | Batch: INS2024003",
    timestamp: "2024-01-15T06:45:00Z",
    priority: "high",
    status: "active",
    expiryDate: "2024-09-10",
  },
  {
    id: 4,
    type: "low-stock",
    category: "Low Stock",
    medicine: "Amoxicillin 500mg",
    message: "Stock running low - 15 units remaining",
    details: "Minimum required: 50 units | Current: 15 units | Batch: AMX2024001",
    timestamp: "2024-01-14T16:20:00Z",
    priority: "medium",
    status: "active",
    expiryDate: "2025-08-15",
  },
  {
    id: 5,
    type: "resolved",
    category: "Low Stock",
    medicine: "Vitamin D3 1000IU",
    message: "Stock replenished successfully",
    details: "Stock increased from 25 to 200 units | Batch: VIT2024004",
    timestamp: "2024-01-14T14:10:00Z",
    priority: "low",
    status: "resolved",
    expiryDate: "2026-03-15",
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("active")
  const [activeTab, setActiveTab] = useState("alerts")
  const router = useRouter()

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || alert.type === filterType
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <Zap className="w-4 h-4" />
      case "low-stock":
        return <AlertTriangle className="w-4 h-4" />
      case "expiry":
        return <Calendar className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getAlertColor = (type: string, priority: string) => {
    if (type === "resolved") {
      return "bg-emerald-50 border-emerald-200 text-emerald-800"
    }
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200 text-red-800"
      case "medium":
        return "bg-orange-50 border-orange-200 text-orange-800"
      case "low":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getPriorityBadge = (priority: string): string => {
    const colors: Record<"high" | "medium" | "low", string> = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-orange-100 text-orange-800 border-orange-200",
      low: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return colors[priority as keyof typeof colors] ?? "bg-gray-100 text-gray-800 border-gray-200"
  }


  const handleResolveAlert = (id: number) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, status: "resolved", type: "resolved" } : alert)))
  }

  const handleDismissAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active")
  const criticalAlerts = activeAlerts.filter((alert) => alert.priority === "high")

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Stock Alerts</h2>
              <p className="text-gray-600">Monitor critical stock levels and expiry dates</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
                <div className="text-sm text-gray-500">Critical Alerts</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{activeAlerts.length}</div>
                <div className="text-sm text-gray-500">Active Alerts</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alert Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {[
            {
              title: "Critical Stock",
              count: alerts.filter((a) => a.type === "critical" && a.status === "active").length,
              color: "from-red-500 to-red-600",
              bgColor: "bg-red-50",
              textColor: "text-red-800",
              icon: Zap,
              animation: "animate-pulse-glow",
            },
            {
              title: "Low Stock",
              count: alerts.filter((a) => a.type === "low-stock" && a.status === "active").length,
              color: "from-orange-500 to-orange-600",
              bgColor: "bg-orange-50",
              textColor: "text-orange-800",
              icon: AlertTriangle,
              animation: "",
            },
            {
              title: "Near Expiry",
              count: alerts.filter((a) => a.type === "expiry" && a.status === "active").length,
              color: "from-yellow-500 to-yellow-600",
              bgColor: "bg-yellow-50",
              textColor: "text-yellow-800",
              icon: Calendar,
              animation: "animate-pulse",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group ${stat.animation}`}
            >
              <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.count}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search alerts..."
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
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="expiry">Near Expiry</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48 border-gray-200">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Alert Details ({filteredAlerts.length} alerts)</span>
              </CardTitle>
              <CardDescription>Manage and track all inventory alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${getAlertColor(alert.type, alert.priority)} ${alert.priority === "high" && alert.status === "active" ? "animate-pulse-glow" : ""
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-800">{alert.medicine}</h3>
                            <Badge className={getPriorityBadge(alert.priority)}>{alert.priority.toUpperCase()}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {alert.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                          <p className="text-xs text-gray-500 mb-2">{alert.details}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(alert.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Expires: {alert.expiryDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {alert.status === "active" && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                            className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredAlerts.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No alerts found</h3>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
