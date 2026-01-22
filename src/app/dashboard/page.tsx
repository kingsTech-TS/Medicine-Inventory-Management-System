"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  LineChart,
  Line,
} from "recharts"
import {
  Activity,
  Package,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Users,
  Bell,
  Settings,
  LogOut,
  Home,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"

// Mock data for charts
const stockData = [
  { name: "Antibiotics", current: 450, minimum: 200 },
  { name: "Pain Relief", current: 320, minimum: 150 },
  { name: "Vitamins", current: 180, minimum: 100 },
  { name: "Vaccines", current: 95, minimum: 50 },
  { name: "Insulin", current: 75, minimum: 80 },
]

const categoryData = [
  { name: "Prescription", value: 45, color: "#10B981" },
  { name: "OTC", value: 30, color: "#14B8A6" },
  { name: "Vaccines", value: 15, color: "#6366F1" },
  { name: "Supplies", value: 10, color: "#F59E0B" },
]

const trendData = [
  { month: "Jan", usage: 2400, stock: 4000 },
  { month: "Feb", usage: 1398, stock: 3800 },
  { month: "Mar", usage: 9800, stock: 3600 },
  { month: "Apr", usage: 3908, stock: 3400 },
  { month: "May", usage: 4800, stock: 3200 },
  { month: "Jun", usage: 3800, stock: 3000 },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [dashboardStats, setDashboardStats] = useState({
    totalMedicines: "0",
    lowStock: "23", // Static
    nearExpiry: "8", // Static
    activeUsers: "45" // Static
  })

  useEffect(() => {
    const fetchData = async () => {
      // Check for token before fetching
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      if (!token) {
        router.push("/")
        return
      }

      try {
        const medicinesData = await api.getMedicines()
        const statusData = await api.getMedicinesStatus()
        
        setMedicines(medicinesData)
        setDashboardStats(prev => ({
          ...prev,
          totalMedicines: medicinesData.length.toLocaleString(),
          lowStock: (statusData.low_stock_count || 0).toString(),
          nearExpiry: (statusData.near_expiry_count || 0).toString()
        }))
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
        // If error is 401, the API helper already handles logout/redirect
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const stats = [
    {
      title: "Total Medicines",
      value: dashboardStats.totalMedicines,
      change: "+12%", // Static
      changeType: "positive",
      icon: Package,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Low Stock Items",
      value: dashboardStats.lowStock,
      change: "+5",
      changeType: "negative",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Near Expiry",
      value: dashboardStats.nearExpiry,
      change: "-2",
      changeType: "positive",
      icon: Calendar,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Active Users",
      value: dashboardStats.activeUsers,
      change: "+3",
      changeType: "positive",
      icon: Users,
      color: "from-purple-500 to-indigo-600",
    },
  ]

  const recentAlerts = [
    { id: 1, type: "low-stock", item: "Amoxicillin 500mg", message: "Only 15 units remaining", time: "2 hours ago" },
    { id: 2, type: "expiry", item: "Insulin Pen", message: "Expires in 5 days", time: "4 hours ago" },
    { id: 3, type: "low-stock", item: "Paracetamol 500mg", message: "Only 8 units remaining", time: "6 hours ago" },
  ]
  
  // Use real medicines for the stock chart, limiting to top 5
  const realStockData = medicines.slice(0, 5).map(m => ({
      name: m.name,
      current: m.quantity,
      minimum: m.minStock || 20
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
       {/* Navigation Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Monitor your medicine inventory and track key metrics</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                    <span className="text-xs text-gray-500">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Levels Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>Current Stock Levels</span>
                </CardTitle>
                <CardDescription>Current inventory vs minimum required levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={realStockData.length > 0 ? realStockData : stockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="current" fill="url(#currentGradient)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="minimum" fill="#f3f4f6" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#14B8A6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Medicine Categories</span>
                </CardTitle>
                <CardDescription>Distribution by medicine type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
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
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Usage Trends and Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Usage Trends</span>
                </CardTitle>
                <CardDescription>Monthly usage vs stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
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
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stock"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>Recent Alerts</span>
                </CardTitle>
                <CardDescription>Latest notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div
                      className={`p-1 rounded-full ${alert.type === "low-stock" ? "bg-orange-100" : "bg-yellow-100"}`}
                    >
                      {alert.type === "low-stock" ? (
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Calendar className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{alert.item}</p>
                      <p className="text-xs text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
