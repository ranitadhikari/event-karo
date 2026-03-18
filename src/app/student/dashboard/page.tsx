'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { EventCard } from '@/components/EventCard';
import { Search, Sparkles, Filter, LayoutGrid, List } from 'lucide-react';
import { Event } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

// Mock all events with posters
const MOCK_ALL_EVENTS: (Event & { poster?: string })[] = [
  {
    id: '1',
    title: 'CodeFest 2026',
    description: 'A 24-hour hackathon to build innovative solutions for urban problems in Delhi.',
    eventDate: '2026-04-15',
    lastRegistrationDate: '2026-04-10',
    collegeId: 'c1',
    collegeName: 'DTU, Delhi',
    type: 'Hackathon',
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '2',
    title: 'Cultural Fest: Tarang',
    description: 'The annual cultural festival of LSR featuring music, dance, and arts.',
    eventDate: '2026-05-20',
    lastRegistrationDate: '2026-05-15',
    collegeId: 'c2',
    collegeName: 'LSR, DU',
    type: 'Cultural',
    poster: 'https://images.unsplash.com/photo-1514525253344-99a4299962c3?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '3',
    title: 'Marketing Summit',
    description: 'Learn from industry experts about the latest trends in digital marketing and branding.',
    eventDate: '2026-04-25',
    lastRegistrationDate: '2026-04-20',
    collegeId: 'c3',
    collegeName: 'SRCC, DU',
    type: 'Academic',
    poster: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '4',
    title: 'RoboWars 2.0',
    description: 'The ultimate robot fighting competition. Build your bot and fight for the title.',
    eventDate: '2026-05-10',
    lastRegistrationDate: '2026-05-05',
    collegeId: 'c1',
    collegeName: 'DTU, Delhi',
    type: 'Competition',
    poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '5',
    title: 'Eco-Entrepreneurship Workshop',
    description: 'Building sustainable businesses for a greener future. Workshop for budding entrepreneurs.',
    eventDate: '2026-04-30',
    lastRegistrationDate: '2026-04-25',
    collegeId: 'c2',
    collegeName: 'LSR, DU',
    type: 'Workshop',
    poster: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000'
  }
];

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredEvents = MOCK_ALL_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.collegeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const eventTypes = ['all', ...Array.from(new Set(MOCK_ALL_EVENTS.map(e => e.type)))];

  return (
    <DashboardLayout allowedRoles={['STUDENT']}>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personalized for you</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              Discover <span className="text-primary">Events</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg">Browse through the most exciting college events in Delhi.</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-grow group w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search by event name, college or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto w-full lg:w-auto pb-2 no-scrollbar">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`h-14 px-8 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all whitespace-nowrap ${
                  filterType === type 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid (Masonry-like with columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                layout
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-32 text-center space-y-6">
            <div className="h-24 w-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-10 w-10 text-slate-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">No events found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or filters to find what you're looking for.</p>
            </div>
            <button 
              onClick={() => {setSearchTerm(''); setFilterType('all');}}
              className="text-primary font-bold uppercase tracking-widest text-xs hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
