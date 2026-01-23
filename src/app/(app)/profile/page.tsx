"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown
} from "lucide-react"
import { api, UserProfile, UserProfileUpdate, UserLoginUpdate } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState("personal")
  const { toast } = useToast()

  // Profile Form States
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [gender, setGender] = useState("")

  // Login Details Form States
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await api.getProfile()
      setProfile(data)
      
      // Initialize form states
      setFirstName(data.firstName || "")
      setLastName(data.lastName || "")
      setPhoneNumber(data.phoneNumber || "")
      setAddress(data.address || "")
      setGender(data.gender || "")
      
      setUsername(data.username || "")
      setEmail(data.email || "")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile information.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const updates: UserProfileUpdate = {
        firstName,
        lastName,
        phoneNumber,
        address,
        gender,
      }
      const updatedProfile = await api.updateProfile(updates)
      setProfile(updatedProfile)
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved.",
        className: "bg-emerald-500 text-white border-none",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const updates: UserLoginUpdate = {
        username,
        email,
        currentPassword,
      }
      if (newPassword) updates.newPassword = newPassword

      await api.updateLoginDetails(updates)
      
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      toast({
        title: "Credentials Updated",
        description: "Your login details have been updated successfully.",
        className: "bg-emerald-500 text-white border-none",
      })
      
      // Refresh profile to show updated username/email
      fetchProfile()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-10" />
      <div className="absolute top-20 right-[-10%] w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-[-5%] w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-30" />

      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10 pt-20 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-1">
                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  {profile?.profilePic ? (
                    <img src={profile.profilePic || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-emerald-500" />
                  )}
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg shadow-lg border border-gray-100 text-gray-600 hover:text-emerald-500 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-3xl font-serif font-bold text-gray-800">
                {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : profile?.username}
              </h1>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" /> {profile?.email}
              </p>
              <div className="pt-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium uppercase tracking-wider">
                  {profile?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-center mb-8">
              <div className="bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white/40 shadow-sm flex">
                <button 
                  onClick={() => setActiveTab("personal")}
                  className={`px-8 py-2.5 rounded-xl transition-all ${activeTab === "personal" ? "bg-white shadow-md text-emerald-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Personal Info
                </button>
                <button 
                  onClick={() => setActiveTab("security")}
                  className={`px-8 py-2.5 rounded-xl transition-all ${activeTab === "security" ? "bg-white shadow-md text-emerald-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Login & Security
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "personal" ? (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-white/80 backdrop-blur-md border-white/40 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-xl font-serif">Personal Information</CardTitle>
                      <CardDescription>Update your personal details for your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input 
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="John"
                              className="bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input 
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Doe"
                              className="bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <Input 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className="pl-10 bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={gender} onValueChange={setGender}>
                              <SelectTrigger className="bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl w-full">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Address</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <Input 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="123 Medical St, Health City"
                                className="pl-10 bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-4">
                          <Button 
                            disabled={saving}
                            className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 rounded-xl h-11 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-white/80 backdrop-blur-md border-white/40 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-xl font-serif">Login & Security</CardTitle>
                      <CardDescription>Manage your credentials and account security.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateLogin} className="space-y-8">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Username</Label>
                              <Input 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email Address</Label>
                              <Input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="h-px bg-gray-100 my-4" />

                          <div className="space-y-4">
                            <h3 className="font-medium text-gray-800 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-emerald-500" /> Change Password
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2 md:col-span-2">
                                <Label>Current Password <span className="text-red-500">*</span></Label>
                                <Input 
                                  type="password"
                                  placeholder="Necessary to confirm changes"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  className="bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input 
                                  type="password"
                                  placeholder="Leave blank to keep current"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Confirm New Password</Label>
                                <Input 
                                  type="password"
                                  placeholder="Confirm new password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button 
                            disabled={saving}
                            className="bg-gray-800 hover:bg-gray-900 text-white px-8 rounded-xl h-11 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                            Update Credentials
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Security Alert */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div className="text-sm text-emerald-800">
              <p className="font-medium">Your account is secure</p>
              <p className="opacity-80">Connected to secure MediTrack backend • {new Date().toLocaleDateString()}</p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
