'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CollegeLayout } from '@/components/college/CollegeLayout';
import { CollegeStatCard } from '@/components/college/CollegeStatCard';
import {
  Calendar,
  Users,
  Zap,
  Clock,
  Mail,
  Phone,
  TrendingUp,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/formatDate';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com';
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface BackendEvent {
  _id: string;
  title: string;
  eventDate: string;
  status: string;
  category?: string;
  posters: string[];
}

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface EventWithEnquiries {
  event: BackendEvent;
  enquiries: Enquiry[];
}

export default function CollegeDashboard() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [eventsWithEnquiries, setEventsWithEnquiries] = useState<EventWithEnquiries[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    loadAll();
  }, [token]);

  const loadAll = async () => {
    try {
      // Fetch my events
      const evRes = await fetch(`${BASE_URL}/api/event/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const evData: BackendEvent[] = evRes.ok ? await evRes.json() : [];
      setEvents(evData);

      // Fetch enquiries for each event in parallel
      const enquiryResults = await Promise.allSettled(
        evData.map(async (ev) => {
          const res = await fetch(`${BASE_URL}/api/event-registration/event/${ev._id}/enquiries`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return { event: ev, enquiries: [] };
          const data = await res.json();
          return { event: ev, enquiries: data.enquiries ?? [] };
        })
      );
      const combined: EventWithEnquiries[] = enquiryResults
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<EventWithEnquiries>).value);
      setEventsWithEnquiries(combined);
    } catch (e) {
      // silently handle
    } finally {
      setIsLoading(false);
    }
  };

  // ── Derived stats ──
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalEnquiries = eventsWithEnquiries.reduce((acc, x) => acc + x.enquiries.length, 0);

  // Events per month (bar chart)
  const eventsByMonth = useMemo(() => {
    const monthMap: Record<string, number> = {};
    events.forEach(ev => {
      const month = new Date(ev.eventDate).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      monthMap[month] = (monthMap[month] || 0) + 1;
    });
    return Object.entries(monthMap)
      .map(([name, count]) => ({ name, count }))
      .slice(-6); // last 6 months
  }, [events]);

  // Category distribution (pie)
  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    events.forEach(ev => {
      const cat = ev.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [events]);

  // Enquiries per event (bar — top 6)
  const enquiryBarData = useMemo(() =>
    eventsWithEnquiries
      .sort((a, b) => b.enquiries.length - a.enquiries.length)
      .slice(0, 6)
      .map(x => ({
        name: x.event.title.length > 14 ? x.event.title.slice(0, 14) + '…' : x.event.title,
        enquiries: x.enquiries.length,
      })),
    [eventsWithEnquiries]);

  // Recent enquiries (latest 5 across all events)
  const recentEnquiries = useMemo(() => {
    const all = eventsWithEnquiries.flatMap(x =>
      x.enquiries.map(q => ({ ...q, eventTitle: x.event.title }))
    );
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [eventsWithEnquiries]);

  const skeletonCard = (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
      <div className="h-8 w-16 bg-gray-200 rounded" />
    </div>
  );

  return (
    <CollegeLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 font-medium mt-1 text-sm">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Here's what's happening with your events.
          </p>
        </div>
        {!isLoading && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 font-bold text-sm shadow-sm">
            <TrendingUp className="h-4 w-4" />
            {totalEnquiries} total enquiries
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{skeletonCard}{skeletonCard}{skeletonCard}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CollegeStatCard label="Total Events" value={String(totalEvents)} icon={Calendar} color="blue" />
          <CollegeStatCard label="Upcoming Events" value={String(upcomingEvents)} icon={Zap} color="amber" />
          <CollegeStatCard label="Total Enquiries" value={String(totalEnquiries)} icon={Users} color="emerald" />
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events per Month */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Events by Month</h3>
            <Badge variant="outline" className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Real Data</Badge>
          </div>
          {isLoading ? (
            <div className="h-[260px] flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : eventsByMonth.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-gray-400 font-medium">No event data yet</div>
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" name="Events" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Enquiries per Event */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Enquiries per Event</h3>
            <Badge variant="outline" className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Top 6</Badge>
          </div>
          {isLoading ? (
            <div className="h-[260px] flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : enquiryBarData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-gray-400 font-medium">No enquiry data yet</div>
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enquiryBarData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Bar dataKey="enquiries" name="Enquiries" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
        {/* Category Pie */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Event Categories</h3>
          {isLoading ? (
            <div className="h-[240px] flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categoryData.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-gray-400 font-medium text-sm">No category data</div>
          ) : (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={6} dataKey="value">
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Recent Enquiries */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">Recent Enquiries</h3>
            <a href="/college/users" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</a>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentEnquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users className="h-10 w-10 mb-2 text-gray-200" />
              <p className="font-medium text-sm">No enquiries yet</p>
              <p className="text-xs mt-1">Students will appear here when they register for your events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map(q => (
                <div key={q._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                      {q.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{q.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {q.email}
                        </span>
                        {q.phone && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {q.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-500 font-medium mt-0.5 truncate max-w-[200px]">{q.eventTitle}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {new Date(q.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </CollegeLayout>
  );
}
