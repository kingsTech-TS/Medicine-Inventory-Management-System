"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  AlertTriangle,
  Calendar,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// --- Types ---
type Medicine = {
  id: number
  name: string
  category: string
  manufacturer: string
  batchNumber: string
  quantity: number
  minStock: number
  expiryDate: string
  price: number
  status: string
}

// Form uses string values for inputs
type MedicineFormData = Omit<Medicine, "id" | "status" | "quantity" | "minStock" | "price"> & {
  quantity: string
  minStock: string
  price: string
}

// --- Mock medicine data ---
const mockMedicines: Medicine[] = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    category: "Antibiotic",
    manufacturer: "PharmaCorp",
    batchNumber: "AMX2024001",
    quantity: 150,
    minStock: 50,
    expiryDate: "2025-08-15",
    price: 12.5,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    manufacturer: "MediLab",
    batchNumber: "PAR2024002",
    quantity: 8,
    minStock: 25,
    expiryDate: "2024-12-20",
    price: 5.75,
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Insulin Pen",
    category: "Diabetes",
    manufacturer: "DiabetesPlus",
    batchNumber: "INS2024003",
    quantity: 45,
    minStock: 20,
    expiryDate: "2024-09-10",
    price: 85.0,
    status: "Near Expiry",
  },
  {
    id: 4,
    name: "Vitamin D3 1000IU",
    category: "Supplement",
    manufacturer: "VitaHealth",
    batchNumber: "VIT2024004",
    quantity: 200,
    minStock: 75,
    expiryDate: "2026-03-15",
    price: 18.25,
    status: "In Stock",
  },
  {
    id: 5,
    name: "Aspirin 75mg",
    category: "Cardiovascular",
    manufacturer: "HeartCare",
    batchNumber: "ASP2024005",
    quantity: 3,
    minStock: 30,
    expiryDate: "2025-11-30",
    price: 8.9,
    status: "Critical",
  },
]

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [activeTab, setActiveTab] = useState("inventory")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const categories = ["Antibiotic", "Pain Relief", "Diabetes", "Supplement", "Cardiovascular", "Vaccine", "Unknown"]

  // Form state
  const [formData, setFormData] = useState<MedicineFormData>({
    name: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
    quantity: "",
    minStock: "",
    expiryDate: "",
    price: "",
  })

  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false)
  const [dispenseItem, setDispenseItem] = useState<Medicine | null>(null)
  const [dispenseAmount, setDispenseAmount] = useState("")

  const handleDispenseClick = (medicine: Medicine) => {
    setDispenseItem(medicine)
    setDispenseAmount("")
    setIsDispenseModalOpen(true)
  }

  const handleDispenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dispenseItem || !dispenseAmount) return

    try {
      setLoading(true)
      await api.dispenseMedicine(dispenseItem.id, parseInt(dispenseAmount))
      toast({
        title: "Dispensed Successfully",
        description: `Dispensed ${dispenseAmount} units of ${dispenseItem.name}`,
        className: "bg-emerald-500 text-white border-none",
      })
      setIsDispenseModalOpen(false)
      fetchMedicines()
    } catch (error) {
      toast({
        title: "Dispense Failed",
        description: error instanceof Error ? error.message : "Could not dispense medicine",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  // Fetch data
  const fetchMedicines = async () => {
    try {
      setLoading(true)
      const data = await api.getMedicines()
      // Map API data to local Medicine type
      const mapped: Medicine[] = data.map((m: any) => ({
        id: m.id,
        name: m.name,
        category: m.category || "Unknown",
        manufacturer: m.manufacturer || "-",
        batchNumber: m.batchNumber || "-",
        quantity: m.quantity,
        minStock: m.minStock || 10,
        expiryDate: m.expiryDate || "-",
        price: m.price,
        status: m.status || (m.quantity < (m.minStock || 10) ? "Low Stock" : "In Stock")
      }))
      setMedicines(mapped)
    } catch (error) {
      toast({
        title: "Error fetching medicines",
        description: "Could not load inventory data",
        variant: "destructive"
      })
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
    if (!token) {
      router.push("/")
      return
    }
    fetchMedicines()
  }, [router])

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || medicine.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Low Stock":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Near Expiry":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Low Stock":
      case "Critical":
        return <AlertTriangle className="w-3 h-3" />
      case "Near Expiry":
        return <Calendar className="w-3 h-3" />
      default:
        return <Package className="w-3 h-3" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
        if (editingMedicine) {
            // Check for quantity changes to use specific restock/dispense endpoints
            const newQty = Number(formData.quantity)
            const oldQty = editingMedicine.quantity
            const diff = newQty - oldQty

            if (diff > 0) {
                await api.restockMedicine(editingMedicine.id, diff)
            } else if (diff < 0) {
                await api.dispenseMedicine(editingMedicine.id, Math.abs(diff))
            }

            // Update other fields
            await api.updateMedicine(editingMedicine.id, {
                name: formData.name,
                category: formData.category,
                manufacturer: formData.manufacturer,
                batchNumber: formData.batchNumber,
                quantity: Number(formData.quantity),
                minStock: Number(formData.minStock),
                expiryDate: formData.expiryDate,
                price: Number(formData.price)
            })
            
            toast({ title: "Updated", description: "Medicine updated successfully", className: "bg-emerald-500 text-white" })
        } else {
            // Add mode
            await api.addMedicine({
                name: formData.name,
                category: formData.category,
                manufacturer: formData.manufacturer,
                batchNumber: formData.batchNumber,
                quantity: Number(formData.quantity),
                minStock: Number(formData.minStock),
                expiryDate: formData.expiryDate,
                price: Number(formData.price)
            })
            toast({ title: "Added", description: "Medicine added successfully", className: "bg-emerald-500 text-white" })
        }
        
        await fetchMedicines()
        resetForm()

    } catch (error) {
        toast({
            title: "Operation Failed",
            description: "Could not save changes to API",
            variant: "destructive"
        })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      manufacturer: "",
      batchNumber: "",
      quantity: "",
      minStock: "",
      expiryDate: "",
      price: "",
    })
    setEditingMedicine(null)
    setIsAddModalOpen(false)
  }

  const handleEdit = (medicine: any) => {
    setEditingMedicine(medicine)
    setFormData({
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      batchNumber: medicine.batchNumber,
      quantity: medicine.quantity.toString(),
      minStock: medicine.minStock.toString(),
      expiryDate: medicine.expiryDate,
      price: medicine.price.toString(),
    })
    setIsAddModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
        try {
            await api.deleteMedicine(id)
            toast({ title: "Deleted", description: "Medicine removed from inventory", className: "bg-emerald-500 text-white" })
            await fetchMedicines()
        } catch (error) {
            toast({ title: "Error", description: "Could not delete medicine", variant: "destructive" })
        }
    }
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
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Medicine Inventory</h2>
          <p className="text-gray-600">Manage your medicine stock and track inventory levels</p>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search Bar */}
                  <motion.div
                    className="relative flex-1 max-w-md"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </motion.div>

                  {/* Category Filter */}
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-48 border-gray-200">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/5 bg-transparent"
                    onClick={() => api.exportMedicines("csv")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>

                  <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Medicine
                        </Button>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <DialogHeader>
                          <DialogTitle className="font-serif">
                            {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingMedicine ? "Update medicine information" : "Enter the details for the new medicine"}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Medicine Name</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="category">Category</Label>
                              <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="manufacturer">Manufacturer</Label>
                              <Input
                                id="manufacturer"
                                value={formData.manufacturer}
                                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="batchNumber">Batch Number</Label>
                              <Input
                                id="batchNumber"
                                value={formData.batchNumber}
                                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="quantity">Quantity</Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="minStock">Minimum Stock</Label>
                              <Input
                                id="minStock"
                                type="number"
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="price">Price ($)</Label>
                              <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={resetForm}
                              className="flex-1 bg-transparent"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            >
                              {editingMedicine ? "Update" : "Add"} Medicine
                            </Button>
                          </div>
                        </form>
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medicine Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-primary" />
                <span>Medicine Inventory ({filteredMedicines.length} items)</span>
              </CardTitle>
              <CardDescription>Complete list of medicines in your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {loading ? (
                         <TableRow>
                             <TableCell colSpan={9} className="text-center py-10">Loading inventory...</TableCell>
                         </TableRow>
                      ) : filteredMedicines.map((medicine, index) => (
                        <motion.tr
                          key={medicine.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                          className="group cursor-pointer"
                        >
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>{medicine.category}</TableCell>
                          <TableCell>{medicine.manufacturer}</TableCell>
                          <TableCell className="font-mono text-sm">{medicine.batchNumber}</TableCell>
                          <TableCell>
                            <span
                              className={medicine.quantity <= medicine.minStock ? "text-red-600 font-semibold" : ""}
                            >
                              {medicine.quantity}
                            </span>
                            <span className="text-gray-400 text-sm ml-1">/ {medicine.minStock}</span>
                          </TableCell>
                          <TableCell>{medicine.expiryDate}</TableCell>
                          <TableCell>${medicine.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(medicine.status)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(medicine.status)}
                              {medicine.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDispenseClick(medicine)}
                                className="hover:bg-orange-50 hover:text-orange-600"
                                title="Dispense"
                              >
                                <Package className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(medicine)}
                                className="hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(medicine.id)}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <Dialog open={isDispenseModalOpen} onOpenChange={setIsDispenseModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Dispense Medicine</DialogTitle>
              <DialogDescription>
                Dispensing {dispenseItem?.name}. Current Stock: {dispenseItem?.quantity}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDispenseSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dispense-amount">Amount to Dispense</Label>
                <Input
                  id="dispense-amount"
                  type="number"
                  min="1"
                  max={dispenseItem?.quantity}
                  value={dispenseAmount}
                  onChange={(e) => setDispenseAmount(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDispenseModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Dispense
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
