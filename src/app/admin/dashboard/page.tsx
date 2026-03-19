'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { 
  Users, 
  GraduationCap, 
  Calendar,
  ClipboardList,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { College } from '@/types';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';

// Mock stats for dashboard (since specific stats API not provided yet)
const MOCK_STATS = [
  { label: 'Total Users', value: '1,250', icon: Users, color: 'indigo' as const, trend: { value: 12, isUp: true } },
  { label: 'Total Colleges', value: '45', icon: GraduationCap, color: 'emerald' as const, trend: { value: 8, isUp: true } },
  { label: 'Total Events', value: '312', icon: Calendar, color: 'amber' as const, trend: { value: 5, isUp: false } },
];

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [pendingColleges, setPendingColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchPending();
    }
  }, [token]);

  const fetchPending = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com'}/api/superadmin/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch');
      setPendingColleges(data);
    } catch (error: any) {
      console.error('Failed to fetch pending colleges:', error);
      toast.error(error.message || 'Failed to load pending requests');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: 'College Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'City', accessorKey: 'city' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (item: College) => (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold px-2.5 py-0.5 rounded-lg">
          <Clock className="h-3 w-3 mr-1.5" />
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: (item: College) => (
        <div className="flex items-center space-x-2">
          <Link
            href="/admin/requests"
            className="text-primary hover:text-primary/80 hover:bg-primary/10 font-bold text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_STATS.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">Recent Pending Requests</h2>
              <p className="text-sm font-medium text-muted-foreground">Colleges waiting for your approval</p>
            </div>
          </div>
          <Link 
            href="/admin/requests"
            className="flex items-center border border-border text-muted-foreground font-bold hover:bg-accent hover:text-accent-foreground rounded-xl px-6 h-11 transition-all active:scale-95 text-sm"
          >
            View All Requests
          </Link>
        </div>

        <AdminTable 
          columns={columns} 
          data={pendingColleges.slice(0, 5)} 
          isLoading={isLoading}
          emptyMessage="No pending requests at the moment."
        />
      </div>
    </AdminLayout>
  );
}
