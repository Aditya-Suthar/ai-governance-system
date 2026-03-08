'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Upload,
  AlertTriangle,
  Flag,
} from 'lucide-react'
// Mock complaint data

const statusOptions = ['Pending', 'In Progress', 'Resolved', 'Rejected']
const priorityOptions = ['Low', 'Medium', 'High', 'Critical']
const categoryOptions = ['Roads', 'Water', 'Electricity', 'Healthcare', 'Sanitation', 'Safety']

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-500/10 text-red-700 border-red-200'
    case 'High':
      return 'bg-orange-500/10 text-orange-700 border-orange-200'
    case 'Medium':
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
    case 'Low':
      return 'bg-green-500/10 text-green-700 border-green-200'
    default:
      return 'bg-slate-500/10 text-slate-700 border-slate-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending':
      return <Clock className="w-4 h-4" />
    case 'In Progress':
      return <AlertCircle className="w-4 h-4" />
    case 'Resolved':
      return <CheckCircle2 className="w-4 h-4" />
    case 'Rejected':
      return <AlertTriangle className="w-4 h-4" />
    default:
      return null
  }
}


export default function ComplaintManagement() {
    const params = useParams()
    const complaintId = params.id as string
    const [complaint, setComplaint] = useState<any>(null)
    const [aiResult, setAiResult] = useState<any>(null)

   useEffect(() => {
  async function loadComplaint() {
    try {
      const res = await fetch("/api/complaints/" + complaintId)
      const data = await res.json()

      setComplaint(data.complaint)

      const aiRes = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.complaint.title,
          description: data.complaint.description
        })
      })

      const aiData = await aiRes.json()
      setAiResult(aiData.result)

      setFormData({
        status: data.complaint.status,
        priority: data.complaint.priority,
        category: data.complaint.category,
        adminNotes: '',
      })

    } catch (error) {
      console.error("Failed to load complaint", error)
    }
  }

  if (complaintId) {
    loadComplaint()
  }
}, [complaintId])
    const [formData, setFormData] = useState({
  status: '',
  priority: '',
  category: '',
  adminNotes: '',
})

  const handleInputChange = (field: string, value: string) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }))
}

  if (!complaint) {
  return <div className="p-10">Loading complaint...</div>
}

 async function updateComplaint() {
  try {
    await fetch("/api/complaints/" + complaintId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    alert("Complaint updated successfully")
  } catch (error) {
    console.error("Update failed", error)
  }
}

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Complaint Management</h1>
          <p className="text-muted-foreground">Review and manage citizen complaints</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Complaint Details Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-foreground">{complaint.title}</CardTitle>
                <CardDescription className="mt-2">
                  Complaint ID: <span className="font-mono font-semibold text-foreground">{complaint._id}</span>
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={`${getPriorityColor(complaint.priority)} border`}
              >
                {complaint.priority} Priority
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(complaint.status)}
                  <span className="text-foreground font-medium">{complaint.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Submitted Date</p>
                <p className="text-foreground">{new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-foreground">{complaint.category}</p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-foreground">{complaint.location}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <div className="bg-muted p-4 rounded-lg border border-border">
                <p className="text-foreground text-sm leading-relaxed">{complaint.description}</p>
              </div>
            </div>

            {/* Citizen Information */}
            <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Reported By</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-foreground font-medium">{complaint.citizenName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-foreground">{complaint.citizenPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-foreground">{complaint.citizenEmail}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admin Controls Section */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>Update complaint status, priority, and category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Update */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status} className="text-foreground">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Update */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Priority</label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority} value={priority} className="text-foreground">
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Update */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category} className="text-foreground">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Evidence Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Upload Evidence</label>
                <div className="relative">
                  <Input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files or <span className="text-primary font-medium">click to browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Images, PDFs, and documents up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Admin Notes</label>
                <Textarea
                  placeholder="Add your notes about this complaint..."
                  value={formData.adminNotes}
                  onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                  className="min-h-32 bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
<Button
  onClick={updateComplaint}
  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
>                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Update Complaint
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Mark as Spam
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions Panel */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">AI Suggestions</CardTitle>
              <CardDescription>Machine learning insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Suggested Category */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Suggested Category</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
  {aiResult?.category || "Analyzing..."}
</span>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                    92% match
                  </Badge>
                </div>
              </div>

              {/* Suggested Priority */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Suggested Priority</p>
                <div className="flex items-center justify-between">
<span className="font-medium">
  {aiResult?.priority || "Analyzing..."}
</span>                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                    88% confidence
                  </Badge>
                </div>
              </div>

              {/* Spam Detection */}
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-200 space-y-2">
                <p className="text-xs font-medium text-green-700 uppercase">Spam Detection</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Legitimate complaint</span>
                </div>
                <p className="text-xs text-green-600">Low spam probability (4%)</p>
              </div>

              {/* Related Complaints */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Related Complaints</p>
                <div className="space-y-2">
                  <div className="text-sm text-foreground hover:text-primary cursor-pointer">
                    • Pothole near intersection (3 days ago)
                  </div>
                  <div className="text-sm text-foreground hover:text-primary cursor-pointer">
                    • Road surface damage Main St (1 week ago)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
