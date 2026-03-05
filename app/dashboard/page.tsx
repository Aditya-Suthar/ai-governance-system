'use client';

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

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'citizen')) {
      router.push('/login');
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

    if (user) {
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

  if (authLoading || !user) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
              <p className="text-gray-600 mt-2">Track and manage your submitted complaints</p>
            </div>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/complaint/new">Report New Complaint</Link>
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <p className="text-gray-600 text-sm mt-2">Total Complaints</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-gray-600 text-sm mt-2">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
                <p className="text-gray-600 text-sm mt-2">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
                <p className="text-gray-600 text-sm mt-2">Resolved</p>
              </CardContent>
            </Card>
          </div>

          {/* Complaints List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Complaints Yet</h3>
                  <p className="text-gray-600 mb-6">You haven&apos;t reported any complaints yet.</p>
                  <Button asChild>
                    <Link href="/complaint/new">Report Your First Complaint</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card key={complaint._id?.toString()} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(complaint.status)}
                          <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{complaint.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                          <Badge className={getPriorityColor(complaint.priority)}>
                            {complaint.priority} Priority
                          </Badge>
                          <Badge variant="outline">
                            {complaint.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/complaint/${complaint._id}`}>
                          View
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
