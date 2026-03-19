'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Calendar,
  MapPin,
  Building2,
  Loader2,
  AlertTriangle,
  GraduationCap,
  Edit3,
  Trash2,
  Eye,
  Info,
  X,
  Image as ImageIcon,
  Tag,
  Users,
  Search,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSuperAdminEvents, deleteEvent, getManagedEventById, PublicEvent } from '@/lib/api';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SuperAdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Detail Modal State
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEvents = () => {
    if (!token) return;
    setIsLoading(true);
    getSuperAdminEvents(token)
      .then(setEvents)
      .catch(() => setError('Failed to load events'))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    if (!token) return;

    try {
      await deleteEvent(id, token);
      toast.success('Event deleted successfully');
      setEvents(events.filter(ev => ev._id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete event');
    }
  };

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

  // ── Filtering Logic ──
  const filteredEvents = React.useMemo(() => {
    return events.filter(ev => {
      const matchesSearch = 
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCollegeName(ev).toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
      const matchesCity = selectedCity === 'all' || getCollegeCity(ev) === selectedCity;
      
      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [events, searchQuery, selectedCategory, selectedCity]);

  // Unique cities/categories for filters
  const cities = React.useMemo(() => {
    const set = new Set(events.map(ev => getCollegeCity(ev)));
    return Array.from(set).sort();
  }, [events]);

  const categories = React.useMemo(() => {
    const set = new Set(events.map(ev => ev.category).filter(Boolean));
    return Array.from(set).sort();
  }, [events]);

  return (
    <>
      <AdminLayout 
        showSearch={true} 
        searchValue={searchQuery} 
        onSearchChange={setSearchQuery}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Events</h1>
              <p className="text-slate-500 font-medium mt-1">Global view of every event across all colleges.</p>
            </div>
            
            {/* Quick Filter Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-40">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white border-slate-200 rounded-xl h-10 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-blue-500" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c} value={c!}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-white border-slate-200 rounded-xl h-10 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                      <SelectValue placeholder="City" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(selectedCategory !== 'all' || selectedCity !== 'all' || searchQuery !== '') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedCity('all');
                    setSearchQuery('');
                  }}
                  className="text-slate-400 hover:text-slate-900 h-10 px-3 rounded-xl"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
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
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
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
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredEvents.map(ev => (
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

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setSelectedEvent(ev)}
                              className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Link href={`/admin/events/${ev._id}/edit`}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(ev._id, ev.title)}
                              className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </AdminLayout>

      {/* ── Event Details Modal ── */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all z-20"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Poster */}
              <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-slate-100">
                {selectedEvent.posters && selectedEvent.posters.length > 0 ? (
                  <img src={selectedEvent.posters[0]} alt={selectedEvent.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <ImageIcon className="h-12 w-12 text-slate-200" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm border border-blue-100">
                    {selectedEvent.category || 'General'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm font-bold text-blue-600">
                    <GraduationCap className="h-4 w-4" />
                    {getCollegeName(selectedEvent)}
                  </div>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Calendar className="h-3.5 w-3.5" /> Date
                    </div>
                    <p className="text-sm font-bold text-slate-900">{formatDate(selectedEvent.eventDate)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <MapPin className="h-3.5 w-3.5" /> Location
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">{selectedEvent.venue}, {getCollegeCity(selectedEvent)}</p>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Info className="h-3.5 w-3.5" /> About the Event
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <Link href={`/admin/events/${selectedEvent._id}/edit`} className="flex-1">
                    <Button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-200">
                      <Edit3 className="h-4 w-4 mr-2" /> Edit Event
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => { handleDelete(selectedEvent._id, selectedEvent.title); setSelectedEvent(null); }}
                    className="h-12 px-6 rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
