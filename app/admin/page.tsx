'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { Navigation } from '@/components/shared/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowRight } from 'lucide-react';

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

const COLORS = ['#eab308', '#3b82f6', '#10b981'];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'authority')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/complaints');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const chartData = [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Resolved', value: stats.resolved },
  ];

  const pieData = [
    { name: 'Pending', value: stats.pending, fill: '#eab308' },
    { name: 'In Progress', value: stats.inProgress, fill: '#3b82f6' },
    { name: 'Resolved', value: stats.resolved, fill: '#10b981' },
  ];

  if (authLoading || !user) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Overview of all complaints and their status</p>
            </div>
            <Button asChild size="lg" variant="outline">
              <Link href="/admin/complaints">View All Complaints</Link>
            </Button>
          </div>

          {/* Statistics Cards */}
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
                <p className="text-xs text-gray-500 mt-2">
                  {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(0) : 0}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
                <p className="text-gray-600 text-sm mt-2">In Progress</p>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.total > 0 ? ((stats.inProgress / stats.total) * 100).toFixed(0) : 0}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
                <p className="text-gray-600 text-sm mt-2">Resolved</p>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(0) : 0}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Status</CardTitle>
                <CardDescription>Distribution of complaints across different statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Percentage breakdown of complaint statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for managing complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="justify-start h-auto flex-col items-start p-4">
                  <Link href="/admin/complaints?status=Pending">
                    <span className="font-semibold">View Pending</span>
                    <span className="text-sm text-gray-600">{stats.pending} complaints waiting for action</span>
                    <ArrowRight className="w-4 h-4 mt-2 ml-auto" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start h-auto flex-col items-start p-4">
                  <Link href="/admin/complaints?status=In Progress">
                    <span className="font-semibold">View In Progress</span>
                    <span className="text-sm text-gray-600">{stats.inProgress} complaints being worked on</span>
                    <ArrowRight className="w-4 h-4 mt-2 ml-auto" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start h-auto flex-col items-start p-4">
                  <Link href="/admin/complaints?status=Resolved">
                    <span className="font-semibold">View Resolved</span>
                    <span className="text-sm text-gray-600">{stats.resolved} complaints completed</span>
                    <ArrowRight className="w-4 h-4 mt-2 ml-auto" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
