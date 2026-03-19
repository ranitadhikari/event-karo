'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CollegeLayout } from '@/components/college/CollegeLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Mail,
  Phone,
  Calendar,
  Filter,
  ChevronDown,
  Loader2,
  Users,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { getEventEnquiries, Enquiry } from '@/lib/api';

interface EnquiryWithEvent extends Enquiry {
  eventTitle: string;
  eventId: string;
}

interface MyEvent {
  _id: string;
  title: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com';

// Minimal getMyEvents inline to avoid import shape mismatch
async function fetchMyEvents(token: string): Promise<MyEvent[]> {
  const res = await fetch(`${BASE_URL}/api/event/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export default function UserManagement() {
  const { token } = useAuth();
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [allEnquiries, setAllEnquiries] = useState<EnquiryWithEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('All Events');

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const myEvents = await fetchMyEvents(token);
      setEvents(myEvents);

      // Fetch enquiries for all events in parallel
      const results = await Promise.allSettled(
        myEvents.map(async (ev: MyEvent) => {
          const data = await getEventEnquiries(ev._id, token);
          return data.enquiries.map((q: Enquiry) => ({
            ...q,
            eventTitle: ev.title,
            eventId: ev._id,
          }));
        })
      );

      const combined: EnquiryWithEvent[] = [];
      results.forEach(r => {
        if (r.status === 'fulfilled') combined.push(...r.value);
      });
      // Sort newest first
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAllEnquiries(combined);
    } catch (err) {
      setError('Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [token]);

  const filtered = useMemo(() =>
    allEnquiries.filter(q => {
      const matchSearch =
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchEvent = eventFilter === 'All Events' || q.eventTitle === eventFilter;
      return matchSearch && matchEvent;
    }), [allEnquiries, searchQuery, eventFilter]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <CollegeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Enquiries / User Management</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">
              All registrations submitted by students for your events.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadData}
            disabled={isLoading}
            className="h-10 px-4 rounded-lg border-gray-200 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Enquiries</p>
            <p className="text-3xl font-black text-gray-900">{allEnquiries.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Your Events</p>
            <p className="text-3xl font-black text-blue-600">{events.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 col-span-2 md:col-span-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Showing</p>
            <p className="text-3xl font-black text-gray-900">{filtered.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 px-4 rounded-xl border-gray-200 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 min-w-[200px] justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="truncate max-w-[140px]">{eventFilter}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-xl border-gray-200">
              <DropdownMenuItem onClick={() => setEventFilter('All Events')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">
                All Events
              </DropdownMenuItem>
              {events.map(ev => (
                <DropdownMenuItem key={ev._id} onClick={() => setEventFilter(ev.title)} className="font-medium text-sm py-2.5 cursor-pointer">
                  {ev.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-100">
            <AlertTriangle className="h-10 w-10 text-red-400 mb-3" />
            <p className="font-bold text-gray-700">{error}</p>
            <Button onClick={loadData} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">Retry</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-100">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No Enquiries Yet</h3>
            <p className="text-gray-400 text-sm">
              {allEnquiries.length === 0
                ? 'No one has registered for your events yet.'
                : 'No results match your search/filter.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{filtered.length} Enquir{filtered.length === 1 ? 'y' : 'ies'}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(q => (
                    <tr key={q._id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Student */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-black text-sm flex-shrink-0">
                            {q.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{q.name}</span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                            <a href={`mailto:${q.email}`} className="hover:text-blue-600 transition-colors truncate max-w-[160px]">{q.email}</a>
                          </div>
                          {q.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Phone className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                              <a href={`tel:${q.phone}`} className="hover:text-blue-600 transition-colors">{q.phone}</a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Event */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 line-clamp-1 max-w-[160px]">{q.eventTitle}</span>
                        </div>
                      </td>

                      {/* Message */}
                      <td className="px-6 py-4">
                        {q.message ? (
                          <div className="flex items-start gap-2 text-sm text-gray-500 max-w-[180px]">
                            <MessageSquare className="h-3.5 w-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{q.message}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-sm italic">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                        {formatDate(q.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CollegeLayout>
  );
}
