'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import {
  Users,
  GraduationCap,
  Calendar,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { College } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com';
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface PublicEvent {
  _id: string;
  title: string;
  eventDate: string;
  status: string;
  category?: string;
  city?: string;
  college?: { _id: string; name: string; city?: string } | string;
}

interface PublicCollege {
  _id: string;
  name: string;
  city: string;
  status: string;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [pendingColleges, setPendingColleges] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<PublicCollege[]>([]);
  const [allEvents, setAllEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) loadAll();
  }, [token]);

  const loadAll = async () => {
    try {
      const [pendingRes, collegesRes, eventsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/superadmin/pending`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/college/public`),
        fetch(`${BASE_URL}/api/event/admin/all`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingColleges(Array.isArray(data) ? data : []);
      }
      if (collegesRes.ok) {
        const data = await collegesRes.json();
        setAllColleges(Array.isArray(data) ? data : []);
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setAllEvents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Derived stats ──
  const upcomingEvents = allEvents.filter(e => e.status === 'upcoming').length;

  // Events by city (bar chart)
  const eventsByCity = useMemo(() => {
    const map: Record<string, number> = {};
    allEvents.forEach(ev => {
      const city = ev.city || (typeof ev.college === 'object' ? ev.college?.city : '') || 'Unknown';
      map[city] = (map[city] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [allEvents]);

  // Events by status (pie)
  const eventStatusData = useMemo(() => {
    const map: Record<string, number> = {};
    allEvents.forEach(ev => { map[ev.status] = (map[ev.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [allEvents]);

  // Colleges by city (bar chart)
  const collegesByCity = useMemo(() => {
    const map: Record<string, number> = {};
    allColleges.forEach(c => { map[c.city] = (map[c.city] || 0) + 1; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [allColleges]);

  // Pending columns
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
      cell: () => (
        <Link href="/admin/requests" className="text-primary hover:text-primary/80 font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
          Review
        </Link>
      )
    }
  ];

  const chartStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
  };

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Approved Colleges"
          value={isLoading ? '…' : String(allColleges.length)}
          icon={GraduationCap}
          color="emerald"
          trend={{ value: allColleges.length, isUp: true }}
        />
        <StatCard
          label="Pending Requests"
          value={isLoading ? '…' : String(pendingColleges.length)}
          icon={ClipboardList}
          color="amber"
        />
        <StatCard
          label="Total Events"
          value={isLoading ? '…' : String(allEvents.length)}
          icon={Calendar}
          color="indigo"
          trend={{ value: upcomingEvents, isUp: true }}
        />
        <StatCard
          label="Upcoming Events"
          value={isLoading ? '…' : String(upcomingEvents)}
          icon={TrendingUp}
          color="rose"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events by City */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Events by City</h3>
            <Badge variant="outline" className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Live</Badge>
          </div>
          {isLoading ? (
            <div className="h-[240px] flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : eventsByCity.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-gray-400 font-medium text-sm">No events yet</div>
          ) : (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventsByCity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar dataKey="count" name="Events" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Colleges by City */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Colleges by City</h3>
            <Badge variant="outline" className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Live</Badge>
          </div>
          {isLoading ? (
            <div className="h-[240px] flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : collegesByCity.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-gray-400 font-medium text-sm">No colleges yet</div>
          ) : (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collegesByCity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar dataKey="count" name="Colleges" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Status Pie */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Event Status</h3>
          {isLoading ? (
            <div className="h-[230px] flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : eventStatusData.length === 0 ? (
            <div className="h-[230px] flex items-center justify-center text-gray-400 text-sm">No event data</div>
          ) : (
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={eventStatusData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={6} dataKey="value">
                    {eventStatusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartStyle} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '14px', fontSize: '11px', fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Pending College Requests */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Pending College Requests</h3>
                <p className="text-xs text-gray-500 font-medium">Colleges awaiting your approval</p>
              </div>
            </div>
            <Link href="/admin/requests" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </Link>
          </div>
          <AdminTable
            columns={columns}
            data={pendingColleges.slice(0, 4)}
            isLoading={isLoading}
            emptyMessage="No pending requests at the moment."
          />
        </motion.div>
      </div>

      {/* Recent Events Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm pb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Recent Events Across Platform</h3>
          <Link href="/admin/events" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />)}</div>
        ) : allEvents.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No events on the platform yet.</p>
        ) : (
          <div className="space-y-2">
            {allEvents.slice(0, 5).map(ev => {
              const collegeName = typeof ev.college === 'object' ? ev.college?.name : ev.college || 'Unknown';
              return (
                <div key={ev._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{ev.title}</p>
                      <p className="text-xs text-gray-400">{collegeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{new Date(ev.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <Badge className={`text-[10px] font-bold uppercase tracking-wider border ${
                      ev.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      ev.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                      {ev.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
