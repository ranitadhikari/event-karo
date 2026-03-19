'use client';

import React, { useState, useEffect } from 'react';
import { CollegeLayout } from '@/components/college/CollegeLayout';
import { CollegeEventCard } from '@/components/college/CollegeEventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon,
  ChevronDown,
  CalendarDays,
  CheckCircle2,
  Clock,
  History,
  Trash2,
  Edit3
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Type for backend event response
interface BackendEvent {
  _id: string;
  title: string;
  eventDate: string;
  posters: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Type for frontend component
interface FrontendEvent {
  id: string;
  title: string;
  date: string;
  registrationCount: number;
  poster: string;
  isFeatured: boolean;
  status: 'upcoming' | 'ongoing' | 'past';
}

export default function ListedEvents() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<FrontendEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com'}/api/event/my`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        // Map backend events to frontend interface
        const mappedEvents: FrontendEvent[] = data.map((ev: BackendEvent) => ({
          id: ev._id,
          title: ev.title,
          date: ev.eventDate,
          registrationCount: 0, // Not available in current backend response
          poster: ev.posters && ev.posters.length > 0 ? ev.posters[0] : 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800',
          isFeatured: false,
          status: ev.status === 'completed' ? 'past' : ev.status
        }));
        setEvents(mappedEvents);
      } else {
        toast.error(data.message || 'Failed to fetch events');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com'}/api/event/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        toast.success('Event deleted');
        setEvents(events.filter(ev => ev.id !== id));
      } else {
        toast.error('Failed to delete event');
      }
    } catch {
      toast.error('Server error');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <CollegeLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Listed Events</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Manage and track all events hosted by your college.</p>
          </div>
          <Link href="/college/events/manage">
            <Button className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search events by title..." 
              className="pl-10 h-11 rounded-xl border-gray-200 bg-white focus:bg-white transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-4 rounded-xl border-gray-200 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Status: {filterStatus}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-gray-200">
                <DropdownMenuItem onClick={() => setFilterStatus('all')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">All Events</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('upcoming')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">Upcoming</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('ongoing')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">Ongoing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('past')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">Past</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'table' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Events Display */}
        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            viewMode === 'grid' ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {isLoading ? (
                  <div className="col-span-full py-20 text-center font-bold text-gray-500">Loading events...</div>
                ) : (
                  filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CollegeEventCard 
                        event={event} 
                        onDelete={handleDelete}
                        onEdit={(id) => window.location.href = `/college/events/${id}/edit`} 
                      />
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Registrations</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                              <img src={event.poster} alt="" className="h-full w-full object-cover" />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{event.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-600">{event.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">{event.registrationCount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            event.status === 'upcoming' ? "bg-blue-50 text-blue-600 border-blue-100" :
                            event.status === 'ongoing' ? "bg-green-50 text-green-600 border-green-100" :
                            "bg-gray-50 text-gray-500 border-gray-100"
                          )}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/college/events/${event.id}/edit`}>
                              <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs">
                                <Edit3 className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)} className="text-red-600 font-bold text-xs hover:text-red-700 hover:bg-red-50">
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
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
                <Search className="h-10 w-10 text-gray-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">No events found</h3>
                <p className="text-gray-500 font-medium max-w-xs mt-1">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {setSearchQuery(''); setFilterStatus('all');}}
                className="mt-4 rounded-xl border-gray-200"
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CollegeLayout>
  );
}

// Utility function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
