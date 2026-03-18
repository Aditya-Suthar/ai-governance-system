'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react'

interface Complaint {
  _id: string
  title: string
  description: string
  category: string
  status: 'Pending' | 'In Progress' | 'Resolved'
    priority: 'Low' | 'Medium' | 'High' | 'Critical'
  location: string
  createdAt: string
  userId: {
  name: string
  phone: string
  email: string
}
  images?: string[]
  adminNotes?: string
  lastUpdate?: string
  suggestedCategory?: string
  priorityLevel?: string
  spamProbability?: number
}

const statusConfig = {
  "Pending": { label: 'Pending', color: 'bg-blue-100 text-blue-800' },
  "In Progress": { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  "Resolved": { label: 'Resolved', color: 'bg-green-100 text-green-800' },
}

const priorityConfig = {
  "Low": { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  "Medium": { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  "High": { label: 'High', color: 'bg-orange-100 text-orange-800' },
  "Critical": { label: 'Critical', color: 'bg-red-100 text-red-800' },
}

const statusSteps: Array<Complaint['status']> = [
  'Pending',
  'In Progress',
  'Resolved'
]

export default function ComplaintDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/complaints/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch complaint')
        }
        const data = await response.json()
        setComplaint(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchComplaint()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <p className="text-red-800">
                 {error ?? "Complaint not found or removed"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentStatusIndex = statusSteps.indexOf(
  complaint.status ?? "Pending"
)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {complaint.title}
              </h1>
              <p className="text-sm text-slate-600">
                Complaint ID: <span className="font-mono font-semibold">{complaint._id}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={statusConfig[complaint.status as keyof typeof statusConfig].color}>
                {statusConfig[complaint.status as keyof typeof statusConfig].label}
                </Badge>

                <Badge className={priorityConfig[complaint.priority as keyof typeof priorityConfig].color}>
                {priorityConfig[complaint.priority as keyof typeof priorityConfig].label}
                </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complaint Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Category</p>
                    <p className="font-semibold text-slate-900">{complaint.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Submitted Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Location</p>
                  <div className="flex items-center gap-2 text-slate-900">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold">{complaint.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Description</p>
                  <p className="text-slate-700 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Section */}
            {complaint.images && complaint.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Evidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {complaint.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={image}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between relative">
                  {statusSteps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                          index <= currentStatusIndex
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {index <= currentStatusIndex ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <p className="text-xs text-center text-slate-600 font-medium">
                        {statusConfig[step as keyof typeof statusConfig].label}
                      </p>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute h-1 w-16 mx-auto ${
                            index < currentStatusIndex
                              ? 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}
                          style={{
                            width: 'calc(100% / 4 - 20px)',
                            marginTop: '40px',
                            marginLeft: 'calc(50% + 20px)',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Updates Section */}
            {complaint.adminNotes && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Admin Updates</CardTitle>
                  {complaint.lastUpdate && (
                    <CardDescription>
                      Last updated:{' '}
                      {new Date(complaint.lastUpdate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{complaint.adminNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Citizen Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Citizen Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-slate-600" />
                    <p className="text-sm text-slate-600">Name</p>
                  </div>
                  <p className="font-semibold text-slate-900">{complaint.userId?.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <p className="text-sm text-slate-600">Phone</p>
                  </div>
                  <p className="font-semibold text-slate-900">{complaint.userId?.phone}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-slate-600" />
                    <p className="text-sm text-slate-600">Email</p>
                  </div>
                  <p className="font-semibold text-slate-900 break-all">
                    {complaint.userId?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Panel */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaint.suggestedCategory && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Suggested Category</p>
                    <p className="font-semibold text-slate-900">
                      {complaint.suggestedCategory}
                    </p>
                  </div>
                )}
                {complaint.priorityLevel && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">AI Priority Level</p>
                    <p className="font-semibold text-slate-900">
                      {complaint.priorityLevel}
                    </p>
                  </div>
                )}
                {complaint.spamProbability !== undefined && (
                  <div>
                    <div className="mb-2">
  <Badge
    className={
      complaint.spamProbability > 50
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }
  >
    {complaint.spamProbability > 50 ? "Likely Spam" : "Legitimate"}
  </Badge>
</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          complaint.spamProbability > 50
                            ? 'bg-red-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${complaint.spamProbability}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {complaint.spamProbability.toFixed(1)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
