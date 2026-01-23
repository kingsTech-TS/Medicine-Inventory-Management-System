"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { api, UserProfile, UserCreate } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Shield,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Sidebar from "@/components/Sidebar"
import UserForm from "@/components/UserForm"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await api.getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users", error)
      toast({
        title: "Error",
        description: "Could not load users. Please check your permissions.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (userData: UserCreate) => {
    try {
      await api.createUser(userData)
      toast({
        title: "User Created",
        description: `${userData.username} has been added successfully.`,
        className: "bg-emerald-500 text-white border-none",
      })
      setIsAddModalOpen(false)
      fetchUsers()
    } catch (error) {
      toast({
        title: "Failed to create user",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (userData: UserCreate) => {
    if (!selectedUser) return
    try {
      await api.updateUser(selectedUser.username, userData)
      toast({
        title: "User Updated",
        description: `${selectedUser.username}'s profile has been updated.`,
        className: "bg-emerald-500 text-white border-none",
      })
      setIsAddModalOpen(false)
      setIsEditMode(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (username: string) => {
    if (!confirm(`Are you sure you want to delete user ${username}?`)) return
    try {
      await api.deleteUser(username)
      toast({
        title: "User Deleted",
        description: "The user has been removed from the system.",
        className: "bg-emerald-500 text-white border-none",
      })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "from-blue-500 to-indigo-600" },
    { label: "Administrators", value: users.filter(u => u.role === "admin").length, icon: Shield, color: "from-emerald-500 to-teal-600" },
    { label: "Staff Members", value: users.filter(u => u.role === "staff" || u.role === "pharmacist").length, icon: Briefcase, color: "from-purple-500 to-pink-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <main className="min-h-screen pt-16 md:pt-0 md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-serif font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500">Manage system users, roles, and access permissions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button 
              onClick={() => {
                setIsEditMode(false)
                setSelectedUser(null)
                setIsAddModalOpen(true)
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* User Table Card */}
        <Card className="border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-md">
          <CardHeader className="border-b border-gray-100 bg-white/50 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search users by name, email or username..." 
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={fetchUsers}>Refresh</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4} className="h-16 text-center text-gray-400">Loading...</TableCell>
                        </TableRow>
                      ))
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Users className="w-8 h-8 mb-2" />
                            <p>No users found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow 
                          key={user.username}
                          className="group hover:bg-slate-50/80 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold overflow-hidden border-2 border-white shadow-sm">
                                {user.profilePic ? (
                                  <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                  user.firstName?.charAt(0) || user.username.charAt(0)
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 truncate">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`capitalize font-medium ${
                              user.role === 'admin' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              user.role === 'pharmacist' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              <span className="text-sm text-gray-600">Active</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsDetailsOpen(true)
                                }}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-primary transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsEditMode(true)
                                  setIsAddModalOpen(true)
                                }}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-emerald-500 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.username)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl p-0 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
               <div className="absolute -bottom-12 left-8">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden">
                       {selectedUser?.profilePic ? (
                          <img src={selectedUser.profilePic} className="w-full h-full object-cover" />
                       ) : selectedUser?.firstName?.charAt(0) || selectedUser?.username.charAt(0)}
                    </div>
                  </div>
               </div>
            </div>
            <div className="px-8 pt-16 pb-8 space-y-6 bg-white">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedUser?.firstName} {selectedUser?.lastName}
                  </h2>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 capitalize">
                    {selectedUser?.role}
                  </Badge>
                </div>
                <p className="text-gray-500">@{selectedUser?.username}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-sm text-gray-700">{selectedUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</p>
                      <p className="text-sm text-gray-700">{selectedUser?.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Address</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{selectedUser?.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Joined Date</p>
                      <p className="text-sm text-gray-700">January 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex space-x-3 border-t border-gray-100">
                <Button 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => {
                    setIsDetailsOpen(false)
                    setIsEditMode(true)
                    setIsAddModalOpen(true)
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => {
                    if (selectedUser) handleDeleteUser(selectedUser.username)
                    setIsDetailsOpen(false)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit User Dialog */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[600px] border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-gray-900">
                {isEditMode ? 'Edit User Profile' : 'Add New Team Member'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? `Update the information for @${selectedUser?.username}` 
                  : 'Create a new user account with specific roles and permissions.'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <UserForm 
                initialData={selectedUser || undefined}
                onSubmit={isEditMode ? handleUpdateUser : handleCreateUser}
                onCancel={() => setIsAddModalOpen(false)}
                loading={loading}
              />
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </main>
    </div>
  )
}
