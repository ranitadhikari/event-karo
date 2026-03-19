'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MapPin,
  Building2,
  Loader2,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getSuperAdminEvents, PublicEvent } from '@/lib/api';
import { formatDate } from '@/utils/formatDate';

export default function SuperAdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getSuperAdminEvents(token)
      .then(setEvents)
      .catch(() => setError('Failed to load events'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const getCollegeName = (ev: PublicEvent) => {
    if (!ev.college) return '—';
    if (typeof ev.college === 'string') return ev.college;
    return ev.college.name || '—';
  };

  const getCollegeCity = (ev: PublicEvent) => {
    if (ev.city) return ev.city;
    if (typeof ev.college === 'object' && ev.college?.city) return ev.college.city;
    return '—';
  };

  return (
    <DashboardLayout allowedRoles={['superadmin']}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Events</h1>
          <p className="text-slate-500 font-medium mt-1">Global view of every event across all colleges.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <p className="text-red-500 font-bold text-lg">{error}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                {events.length} Total Events
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">College</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Venue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {events.map(ev => (
                    <tr key={ev._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Title + Poster thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {ev.posters && ev.posters.length > 0 ? (
                            <img
                              src={ev.posters[0]}
                              alt={ev.title}
                              className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Building2 className="h-5 w-5 text-blue-400" />
                            </div>
                          )}
                          <span className="font-bold text-gray-900 text-sm line-clamp-1 max-w-[200px]">
                            {ev.title}
                          </span>
                        </div>
                      </td>

                      {/* College */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          <span className="truncate max-w-[160px]">{getCollegeName(ev)}</span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          {getCollegeCity(ev)}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          {formatDate(ev.eventDate)}
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[160px]">
                        <span className="truncate block">{ev.venue || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
