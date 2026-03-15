'use client';

type Message = {
  role: "user" | "ai";
  content: string;
};
import dynamic from "next/dynamic"

const DashboardComplaintMap = dynamic(
  () => import("@/components/maps/DashboardComplaintMap"),
  { ssr: false }
)
import AIBot from "@/components/AIBot";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { Navigation } from '@/components/shared/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { IComplaint } from '@/lib/models/Complaint';


function generateAlerts(complaints: any[]) {
  const wardCategoryCount: Record<string, number> = {}
  const alerts: { ward: string; category: string; count: number }[] = []

  complaints.forEach((c) => {
    if (!c.ward || !c.category) return

    const key = `${c.ward}__${c.category}`

    if (!wardCategoryCount[key]) {
      wardCategoryCount[key] = 0
    }

    wardCategoryCount[key]++
  })

  Object.entries(wardCategoryCount).forEach(([key, count]) => {
    if (count >= 3) {
      const [ward, category] = key.split("__")

      alerts.push({
        ward,
        category,
        count,
      })
    }
  })

  return alerts
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);  
  const [input, setInput] = useState("");
  const [alertPage, setAlertPage] = useState(0);

  const sendMessage = async () => {
  if (!input.trim()) return;
  
  const userMessage: Message = { role: "user", content: input };
  setMessages(prev => [...prev, userMessage]);

  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: input })
  });

  const data = await response.json();

  const aiMessage: Message = {
  role: "ai",
  content: data.reply
};

  setMessages(prev => [...prev, aiMessage]);
  setInput("");
};

  useEffect(() => {
  if (!authLoading && user?.role !== "authority") {
    router.push("/dashboard");
  }
}, [user, authLoading, router]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('/api/complaints');
        if (response.ok) {
          const data = await response.json();
          setComplaints(data.complaints);
        }
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "authority") {
  fetchComplaints();
}
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
  return <div className="min-h-screen bg-slate-50">Loading...</div>;
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  const alerts = generateAlerts(complaints)

  const alertsPerPage = 3;

const visibleAlerts = alerts.slice(
  alertPage * alertsPerPage,
  alertPage * alertsPerPage + alertsPerPage
);
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 items-start">
          <div className={`transition-all duration-300 ${showAI ? "w-[70%]" : "w-full"}`}>
            {/* Header Section */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Project Zero Point</h1>
                  <p className="text-gray-500 mt-2 text-lg">Track and manage your civic complaints</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => setShowAI(!showAI)}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    {showAI ? "Hide AI" : "Show AI"} Assistant
                  </Button>
                  {user?.role === "citizen" && (
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  <Link href="/complaints/new">+ Report New Complaint</Link>
                </Button>
              )}
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 tracking-wide uppercase">Your Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Total Complaints</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{stats.total}</span>
                      <span className="text-xs text-gray-500">submitted</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-yellow-700 mb-2">Pending</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-yellow-600">{stats.pending}</span>
                      <span className="text-xs text-gray-500">awaiting</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-blue-700 mb-2">In Progress</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-blue-600">{stats.inProgress}</span>
                      <span className="text-xs text-gray-500">being worked on</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-green-700 mb-2">Resolved</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-green-600">{stats.resolved}</span>
                      <span className="text-xs text-gray-500">completed</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Alerts Section */}
{alerts.length > 0 && (
  <div className="mb-6">
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-700 flex items-center gap-2">
          ⚠ System Alerts
        </CardTitle>
        <CardDescription>
          Areas with unusually high complaint activity
        </CardDescription>
      </CardHeader>

     <CardContent className="space-y-2">
  {visibleAlerts.map((alert, i) => (
    <div key={i} className="text-red-700 font-medium">
      {alert.category} complaints rising in {alert.ward} ({alert.count})
    </div>
  ))}

  <div className="flex justify-between mt-4">
    <Button
      variant="outline"
      disabled={alertPage === 0}
      onClick={() => setAlertPage(alertPage - 1)}
    >
      Previous
    </Button>

    <Button
      variant="outline"
      disabled={(alertPage + 1) * alertsPerPage >= alerts.length}
      onClick={() => setAlertPage(alertPage + 1)}
    >
      Next
    </Button>
  </div>
</CardContent>
    </Card>
  </div>
)}

{/* Complaint Map */}
<DashboardComplaintMap complaints={complaints as any} />

            {/* Complaints List Section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-4 tracking-wide uppercase">Recent Complaints</h2>
              {isLoading ? (
                <Card className="border-0 bg-white shadow-sm">
                  <CardContent className="py-16">
                    <div className="text-center">
                      <div className="animate-pulse flex justify-center">
                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                      </div>
                      <p className="text-gray-600 mt-4">Loading your complaints...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : complaints.length === 0 ? (
                <Card className="border-0 bg-white shadow-sm">
                  <CardContent className="py-16">
                    <div className="text-center">
                      <AlertCircle className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Complaints Yet</h3>
                      <p className="text-gray-600 mb-8">Start by reporting your first civic complaint to track and resolve issues.</p>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/complaints/new">Report Your First Complaint</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <Card 
                      key={complaint._id?.toString()} 
                      className="border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-200 hover:border-blue-200 cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="shrink-0">
                                {getStatusIcon(complaint.status)}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{complaint.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{complaint.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className={`${getStatusColor(complaint.status)} border-0 font-medium`}>
                                {complaint.status}
                              </Badge>
                              <Badge className={`${getPriorityColor(complaint.priority)} border-0 font-medium`}>
                                {complaint.priority} Priority
                              </Badge>
                              <Badge variant="outline" className="border-gray-200 bg-gray-50">
                                {complaint.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">
                              {new Date(complaint.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild 
                            className="shrink-0 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                          >
                            <Link href={`/admin/complaints/${complaint._id}`} className="gap-2">
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          {showAI && (
            <div className="w-[30%] sticky top-8">
              <AIBot />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
