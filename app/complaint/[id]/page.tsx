'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { Navigation } from '@/components/shared/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { IComplaint } from '@/lib/models/Complaint';

export default function ComplaintDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user, isLoading: authLoading } = useAuth();
  const [complaint, setComplaint] = useState<IComplaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await fetch(`/api/complaints/${id}`);
        if (response.ok) {
          const data = await response.json();
          setComplaint(data.complaint);
        } else if (response.status === 403) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch complaint:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && id) {
      fetchComplaint();
    }
  }, [user, id, router]);

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

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-slate-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-gray-600">Loading complaint details...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!complaint) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-slate-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Complaint not found</p>
              <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {getStatusIcon(complaint.status)}
                    <h1 className="text-3xl font-bold text-gray-900">{complaint.title}</h1>
                  </div>
                  <CardDescription className="text-base">
                    Submitted on {new Date(complaint.createdAt).toLocaleDateString()} at{' '}
                    {new Date(complaint.createdAt).toLocaleTimeString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status and Priority */}
              <div className="flex flex-wrap gap-2">
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

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-700">{complaint.location}</p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Complaint ID</p>
                  <p className="font-mono text-sm text-gray-900">{complaint._id?.toString().slice(0, 12)}...</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="text-gray-900">{new Date(complaint.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                      <div className="w-1 h-12 bg-gray-300 mt-2"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Submitted</p>
                      <p className="text-sm text-gray-600">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {complaint.status !== 'Pending' && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                        <div className={`w-1 h-12 ${complaint.status === 'Resolved' ? 'bg-gray-300' : 'bg-green-300'} mt-2`}></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Status Updated</p>
                        <p className="text-sm text-gray-600">{complaint.status}</p>
                      </div>
                    </div>
                  )}

                  {complaint.status === 'Resolved' && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full mt-1"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Resolved</p>
                        <p className="text-sm text-gray-600">
                          {new Date(complaint.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h4>
                <p className="text-sm text-blue-800">
                  {complaint.status === 'Pending' &&
                    'Your complaint is being reviewed by the authorities. You will receive updates as soon as there are any changes.'}
                  {complaint.status === 'In Progress' &&
                    'Your complaint is being actively worked on. Check back soon for more updates.'}
                  {complaint.status === 'Resolved' &&
                    'Your complaint has been resolved. Thank you for helping us improve our community!'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
