'use client';

import React, { useState, useEffect } from 'react';
import { CollegeLayout } from '@/components/college/CollegeLayout';
import { CollegeEventCard } from '@/components/college/CollegeEventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  Trash2,
  Edit3,
  X,
  Calendar,
  MapPin,
  Building2,
  Users,
  Tag,
  Image as ImageIcon,
  Info,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatDate';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com';

// Full backend event shape
interface BackendEvent {
  _id: string;
  title: string;
  description?: string;
  venue: string;
  city?: string;
  eventDate: string;
  lastDate?: string;
  seats?: number;
  posters: string[];
  price?: number;
  category?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Card shape
interface FrontendEvent {
  id: string;
  title: string;
  date: string;
  registrationCount: number;
  poster: string;
  isFeatured: boolean;
  status: 'upcoming' | 'ongoing' | 'past';
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function ListedEvents() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<FrontendEvent[]>([]);
  const [rawEvents, setRawEvents] = useState<BackendEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<BackendEvent | null>(null);
  const [posterIndex, setPosterIndex] = useState(0);
  const { token } = useAuth();

  useEffect(() => { fetchEvents(); }, []);

  // Lock body scroll when detail modal open
  useEffect(() => {
    document.body.style.overflow = selectedEvent ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/event/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: BackendEvent[] = await response.json();

      if (response.ok) {
        setRawEvents(data);
        const mapped: FrontendEvent[] = data.map(ev => ({
          id: ev._id,
          title: ev.title,
          date: ev.eventDate,
          registrationCount: 0,
          poster: ev.posters?.[0] || 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800',
          isFeatured: false,
          status: (ev.status === 'completed' || ev.status === 'cancelled') ? 'past' : ev.status as 'upcoming' | 'ongoing' | 'past',
        }));
        setEvents(mapped);
      } else {
        toast.error('Failed to fetch events');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await fetch(`${BASE_URL}/api/event/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Event deleted');
        setEvents(events.filter(ev => ev.id !== id));
        setRawEvents(rawEvents.filter(ev => ev._id !== id));
      } else {
        toast.error('Failed to delete event');
      }
    } catch {
      toast.error('Server error');
    }
  };

  const handleViewDetails = (id: string) => {
    const raw = rawEvents.find(ev => ev._id === id) || null;
    setPosterIndex(0);
    setSelectedEvent(raw);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusColor = (s?: string) => {
    if (s === 'upcoming') return 'bg-blue-50 text-blue-600 border-blue-100';
    if (s === 'ongoing') return 'bg-green-50 text-green-600 border-green-100';
    return 'bg-gray-50 text-gray-500 border-gray-100';
  };

  return (
    <CollegeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Listed Events</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Manage and track all events hosted by your college.</p>
          </div>
          <Link href="/college/events/manage">
            <Button className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2">
              <PlusCircle className="h-5 w-5" /> Create Event
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events by title..."
              className="pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-4 rounded-xl border-gray-200 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Status: {filterStatus} <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-gray-200">
                {['all', 'upcoming', 'ongoing', 'past'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterStatus(s as any)} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer capitalize">{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500")}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('table')} className={cn("p-2 rounded-lg transition-all", viewMode === 'table' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500")}>
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Events Display */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredEvents.length > 0 ? (
              viewMode === 'grid' ? (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event, index) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                      <CollegeEventCard
                        event={event}
                        onDelete={handleDelete}
                        onEdit={id => window.location.href = `/college/events/${id}/edit`}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Event', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredEvents.map(event => (
                        <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={event.poster} alt="" className="h-full w-full object-cover" />
                              </div>
                              <span className="font-bold text-gray-900 text-sm">{event.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.date)}</td>
                          <td className="px-6 py-4">
                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusColor(event.status))}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(event.id)} className="text-blue-600 font-bold text-xs">Details</Button>
                              <Link href={`/college/events/${event.id}/edit`}>
                                <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs"><Edit3 className="h-4 w-4 mr-1" /> Edit</Button>
                              </Link>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)} className="text-red-600 font-bold text-xs hover:bg-red-50">
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <Search className="h-10 w-10 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">No events found</h3>
                  <p className="text-gray-500 font-medium max-w-xs mt-1">Try adjusting your search or filters.</p>
                </div>
                <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterStatus('all'); }} className="mt-4 rounded-xl border-gray-200">
                  Clear filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ── Event Details Modal ── */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 h-9 w-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all z-10"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Poster carousel */}
              {selectedEvent.posters && selectedEvent.posters.length > 0 ? (
                <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-gray-100">
                  <img src={selectedEvent.posters[posterIndex]} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  {selectedEvent.posters.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                      {selectedEvent.posters.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPosterIndex(i)}
                          className={cn("h-2 w-2 rounded-full transition-all", i === posterIndex ? "bg-white scale-125" : "bg-white/50")}
                        />
                      ))}
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={cn("border font-bold text-[10px] uppercase tracking-wider", statusColor(selectedEvent.status))}>
                      {selectedEvent.status}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-t-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-blue-300" />
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedEvent.title}</h2>
                  {selectedEvent.category && (
                    <Badge className="mt-2 bg-blue-50 text-blue-600 border-blue-100 text-xs font-bold uppercase tracking-wider">
                      {selectedEvent.category}
                    </Badge>
                  )}
                </div>

                {/* Key info grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" /> Event Date
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedEvent.eventDate)}</p>
                  </div>

                  {selectedEvent.lastDate && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <Calendar className="h-3.5 w-3.5 text-orange-500" /> Last Registration
                      </div>
                      <p className="text-sm font-bold text-gray-900">{formatDate(selectedEvent.lastDate)}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <Building2 className="h-3.5 w-3.5 text-blue-500" /> Venue
                    </div>
                    <p className="text-sm font-bold text-gray-900">{selectedEvent.venue}</p>
                  </div>

                  {selectedEvent.city && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <MapPin className="h-3.5 w-3.5 text-blue-500" /> City
                      </div>
                      <p className="text-sm font-bold text-gray-900">{selectedEvent.city}</p>
                    </div>
                  )}

                  {selectedEvent.seats !== undefined && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <Users className="h-3.5 w-3.5 text-blue-500" /> Total Seats
                      </div>
                      <p className="text-sm font-bold text-gray-900">{selectedEvent.seats}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <Tag className="h-3.5 w-3.5 text-blue-500" /> Entry Fee
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedEvent.price && selectedEvent.price > 0 ? `₹${selectedEvent.price}` : 'Free'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <Info className="h-3.5 w-3.5 text-blue-500" /> Description
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Multiple poster thumbnails */}
                {selectedEvent.posters && selectedEvent.posters.length > 1 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">All Posters ({selectedEvent.posters.length})</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedEvent.posters.map((p, i) => (
                        <button key={i} onClick={() => setPosterIndex(i)} className={cn("h-16 w-16 rounded-lg overflow-hidden border-2 transition-all", i === posterIndex ? "border-blue-500" : "border-gray-200 hover:border-blue-300")}>
                          <img src={p} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <Link href={`/college/events/${selectedEvent._id}/edit`} className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11">
                      <Edit3 className="h-4 w-4 mr-2" /> Edit Event
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => { handleDelete(selectedEvent._id); setSelectedEvent(null); }}
                    className="border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl h-11 px-5"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CollegeLayout>
  );
}
