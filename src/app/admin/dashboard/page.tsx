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

// Mock stats for dashboard (since API not provided)
const MOCK_STATS = [
  { label: 'Total Users', value: '1,250', icon: Users, color: 'indigo' as const, trend: { value: 12, isUp: true } },
  { label: 'Total Colleges', value: '45', icon: GraduationCap, color: 'emerald' as const, trend: { value: 8, isUp: true } },
  { label: 'Total Events', value: '312', icon: Calendar, color: 'amber' as const, trend: { value: 5, isUp: false } },
];

export default function AdminDashboardPage() {
  const [pendingColleges, setPendingColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        // Simulating API call: GET /api/superadmin/pending
        // const response = await axios.get('/api/superadmin/pending');
        // setPendingColleges(response.data);
        
        // Using mock for now to show the UI
        setTimeout(() => {
          setPendingColleges([
            {
              id: 'c4',
              name: 'Hansraj College',
              email: 'admin@hansraj.du.ac.in',
              city: 'Delhi',
              country: 'India',
              description: 'A constituent college of the University of Delhi.',
              status: 'PENDING',
            },
            {
              id: 'c5',
              name: 'IIT Bombay',
              email: 'registrar@iitb.ac.in',
              city: 'Mumbai',
              country: 'India',
              description: 'A premier technical institute in Mumbai.',
              status: 'PENDING',
            },
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch pending colleges:', error);
        toast.error('Failed to load pending requests');
        setIsLoading(false);
      }
    };

    fetchPending();
  }, []);

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
