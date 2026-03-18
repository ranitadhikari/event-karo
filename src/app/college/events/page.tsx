'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, Filter, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Event } from '@/types';

// Mock my events
const MOCK_MY_EVENTS: Event[] = [
  {
    id: '1',
    title: 'CodeFest 2026',
    description: 'A 24-hour hackathon to build innovative solutions for urban problems in Delhi.',
    eventDate: '2026-04-15',
    lastRegistrationDate: '2026-04-10',
    collegeId: 'c1',
    collegeName: 'DTU, Delhi',
    type: 'Hackathon'
  },
  {
    id: '4',
    title: 'RoboWars 2.0',
    description: 'The ultimate robot fighting competition. Build your bot and fight for the title.',
    eventDate: '2026-05-10',
    lastRegistrationDate: '2026-05-05',
    collegeId: 'c1',
    collegeName: 'DTU, Delhi',
    type: 'Competition'
  }
];

export default function CollegeEvents() {
  const [events, setEvents] = useState<Event[]>(MOCK_MY_EVENTS);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (id: string) => {
    // Simulate API: DELETE /api/event/:id
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
      toast.success('Event deleted successfully!');
    }
  };

  const handleEdit = (event: Event) => {
    // Redirect to edit page or open modal
    toast.info(`Editing event: ${event.title}`);
  };

  return (
    <DashboardLayout allowedRoles={['COLLEGE_ADMIN']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Event Management</h1>
            <p className="text-slate-500 font-medium mt-1">Manage and publish your college's upcoming events.</p>
          </div>
          <Link href="/college/events/new">
            <Button className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Event
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="Search your events..." 
              className="w-full pl-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 font-bold bg-white shadow-sm hover:bg-slate-50 transition-all">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 font-bold bg-white shadow-sm hover:bg-slate-50 transition-all">
            <Calendar className="mr-2 h-4 w-4" />
            Sort by Date
          </Button>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                showActions 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-slate-100 space-y-6">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
              <Calendar className="h-10 w-10" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">No events found</p>
              <p className="text-slate-500 font-medium mt-2">You haven't created any events yet. Get started by creating your first event!</p>
            </div>
            <Link href="/college/events/new" className="inline-block">
              <Button className="h-14 px-10 rounded-2xl font-bold shadow-lg shadow-primary/20">
                Create First Event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
