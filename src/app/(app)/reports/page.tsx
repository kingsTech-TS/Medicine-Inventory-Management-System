"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Activity,
  Package,
  Bell,
  Settings,
  LogOut,
  Home,
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for various reports
const monthlyUsageData = [
  { month: "Jan", usage: 2400, cost: 12000, efficiency: 85 },
  { month: "Feb", usage: 1398, cost: 8500, efficiency: 78 },
  { month: "Mar", usage: 9800, cost: 15200, efficiency: 92 },
  { month: "Apr", usage: 3908, cost: 11800, efficiency: 88 },
  { month: "May", usage: 4800, cost: 13500, efficiency: 90 },
  { month: "Jun", usage: 3800, cost: 10200, efficiency: 87 },
  { month: "Jul", usage: 4300, cost: 12800, efficiency: 89 },
  { month: "Aug", usage: 5200, cost: 14100, efficiency: 91 },
]

const categoryDistribution = [
  { name: "Antibiotics", value: 35, cost: 15400, color: "#10B981" },
  { name: "Pain Relief", value: 25, cost: 8200, color: "#14B8A6" },
  { name: "Vitamins", value: 20, cost: 5600, color: "#6366F1" },
  { name: "Vaccines", value: 12, cost: 12800, color: "#F59E0B" },
  { name: "Insulin", value: 8, cost: 9200, color: "#EF4444" },
]

const stockTurnoverData = [
  { category: "Antibiotics", turnover: 4.2, target: 4.0 },
  { category: "Pain Relief", turnover: 6.8, target: 6.0 },
  { category: "Vitamins", turnover: 3.1, target: 3.5 },
  { category: "Vaccines", turnover: 2.9, target: 3.0 },
  { category: "Insulin", turnover: 5.4, target: 5.0 },
]

const expiryAnalysis = [
  { month: "Current", expired: 5, nearExpiry: 12, safe: 1230 },
  { month: "Next Month", expired: 0, nearExpiry: 18, safe: 1229 },
  { month: "2 Months", expired: 0, nearExpiry: 25, safe: 1222 },
  { month: "3 Months", expired: 0, nearExpiry: 32, safe: 1215 },
]

const supplierPerformance = [
  { name: "PharmaCorp", reliability: 95, cost: 85, quality: 92 },
  { name: "MediLab", reliability: 88, cost: 78, quality: 89 },
  { name: "HealthPlus", reliability: 92, cost: 82, quality: 94 },
  { name: "VitaHealth", reliability: 87, cost: 75, quality: 86 },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("reports")
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedReport, setSelectedReport] = useState("overview")
  const router = useRouter()

  const handleDownload = (reportType: string) => {
    // Simulate download with animation
    console.log(`Downloading ${reportType} report...`)
  }

  const reportSummary = {
    totalValue: 156780,
    monthlyChange: 12.5,
    efficiency: 89,
    criticalItems: 8,
  }

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left side: title + subtitle */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                Reports & Analytics
              </h2>
              <p className="text-gray-600">
                Comprehensive insights into your medicine inventory performance
              </p>
            </div>

            {/* Right side: filters + button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-40 border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleDownload("comprehensive")}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Inventory Value",
              value: `$${reportSummary.totalValue.toLocaleString()}`,
              change: `+${reportSummary.monthlyChange}%`,
              changeType: "positive",
              icon: DollarSign,
              color: "from-emerald-500 to-teal-600",
            },
            {
              title: "Inventory Efficiency",
              value: `${reportSummary.efficiency}%`,
              change: "+2.3%",
              changeType: "positive",
              icon: TrendingUp,
              color: "from-blue-500 to-indigo-600",
            },
            {
              title: "Critical Items",
              value: reportSummary.criticalItems.toString(),
              change: "-3",
              changeType: "positive",
              icon: AlertTriangle,
              color: "from-orange-500 to-red-500",
            },
            {
              title: "Active Suppliers",
              value: "12",
              change: "+1",
              changeType: "positive",
              icon: Users,
              color: "from-purple-500 to-indigo-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="flex items-center space-x-1">
                    <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-gray-500">from last period</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Usage & Cost Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span>Usage & Cost Trends</span>
                  </CardTitle>
                  <CardDescription>Monthly medicine usage and associated costs</CardDescription>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload("usage-trends")}
                    className="border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlyUsageData}>
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#usageGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#6366F1"
                      fillOpacity={1}
                      fill="url(#costGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span>Category Analysis</span>
                  </CardTitle>
                  <CardDescription>Distribution and cost analysis by category</CardDescription>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload("category-analysis")}
                    className="border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value, name, props) => [`${value}% ($${props.payload.cost.toLocaleString()})`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">${item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Turnover Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Stock Turnover Rate</span>
                  </CardTitle>
                  <CardDescription>Inventory turnover vs target rates</CardDescription>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload("turnover-analysis")}
                    className="border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockTurnoverData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="target" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="turnover" fill="url(#turnoverGradient)" radius={[0, 4, 4, 0]} />
                    <defs>
                      <linearGradient id="turnoverGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#14B8A6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expiry Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Expiry Forecast</span>
                  </CardTitle>
                  <CardDescription>Upcoming expiry analysis and projections</CardDescription>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload("expiry-forecast")}
                    className="border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={expiryAnalysis}>
                    <defs>
                      <linearGradient id="expiredGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="nearExpiryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="expired"
                      stackId="1"
                      stroke="#EF4444"
                      fill="url(#expiredGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="nearExpiry"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="url(#nearExpiryGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-600">Expired</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm text-gray-600">Near Expiry</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Report Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Quick Reports</span>
              </CardTitle>
              <CardDescription>Generate and download specific reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Inventory Summary", type: "inventory-summary", icon: Package },
                  { name: "Financial Report", type: "financial", icon: DollarSign },
                  { name: "Supplier Analysis", type: "supplier", icon: Users },
                  { name: "Compliance Report", type: "compliance", icon: FileText },
                ].map((report, index) => (
                  <motion.div
                    key={report.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(report.type)}
                      className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                    >
                      <report.icon className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium">{report.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
