'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EventCard } from '@/components/EventCard';
import { FilterDropdown } from '@/components/FilterDropdown';
import { Search, Sparkles } from 'lucide-react';
import { Event } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '@/context/LocationContext';
import { useSearchParams } from 'next/navigation';

// Mock all events with posters
const MOCK_ALL_EVENTS: (Event & { poster?: string })[] = [
  {
    id: 'codesphere-hackathon',
    title: 'CodeSphere Hackathon',
    tagline: 'Think • Build • Ship',
    description: 'A premium 36-hour hackathon where developers, designers, and innovators come together to build cutting-edge solutions.',
    eventDate: '2026-03-18',
    lastRegistrationDate: '2026-03-05',
    collegeId: 'sgt-university',
    collegeName: 'SGT University',
    city: 'Gurugram',
    state: 'Haryana',
    type: 'Hackathon',
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000', // Placeholder
    prizePool: '₹1.5 Lakh',
    isFeatured: true,
  },
  {
    id: '1',
    title: 'CodeFest 2026',
    description: 'A 24-hour hackathon to build innovative solutions for urban problems.',
    eventDate: '2026-04-15',
    lastRegistrationDate: '2026-04-10',
    collegeId: 'c1',
    collegeName: 'DTU',
    city: 'Delhi',
    type: 'Hackathon',
    poster: 'https://res.cloudinary.com/dwserksvu/image/upload/v1773907689/WhatsApp_Image_2026-03-18_at_8.49.39_PM_lzvxo4.jpg'
  },
  {
    id: '2',
    title: 'Cultural Fest: Tarang',
    description: 'The annual cultural festival featuring music, dance, and arts.',
    eventDate: '2026-05-20',
    lastRegistrationDate: '2026-05-15',
    collegeId: 'c2',
    collegeName: 'LSR',
    city: 'Delhi',
    type: 'Cultural',
    poster: 'https://res.cloudinary.com/dwserksvu/image/upload/v1773907689/WhatsApp_Image_2026-03-18_at_8.49.39_PM_lzvxo4.jpg'
  },
  {
    id: '3',
    title: 'Marketing Summit',
    description: 'Learn from industry experts about the latest trends in digital marketing and branding.',
    eventDate: '2026-04-25',
    lastRegistrationDate: '2026-04-20',
    collegeId: 'c3',
    collegeName: 'SRCC',
    city: 'Delhi',
    type: 'Academic',
    poster: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '4',
    title: 'RoboWars 2.0',
    description: 'The ultimate robot fighting competition.',
    eventDate: '2026-05-10',
    lastRegistrationDate: '2026-05-05',
    collegeId: 'c1',
    collegeName: 'DTU',
    city: 'Delhi',
    type: 'Competition',
    poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '6',
    title: 'TechX Mumbai',
    description: 'The biggest tech conference in Mumbai.',
    eventDate: '2026-07-10',
    lastRegistrationDate: '2026-07-01',
    collegeId: 'c6',
    collegeName: 'IIT Bombay',
    city: 'Mumbai',
    type: 'Technical',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '7',
    title: 'Pune Design Week',
    description: 'Exploring the future of design and creativity.',
    eventDate: '2026-08-15',
    lastRegistrationDate: '2026-08-10',
    collegeId: 'c7',
    collegeName: 'COEP',
    city: 'Pune',
    type: 'Workshop',
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000'
  }
];

function EventsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterType, setFilterType] = useState('all');
  const { selectedCity } = useLocation();

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const filteredEvents = MOCK_ALL_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesCity = selectedCity === 'All Cities' || event.city === selectedCity;
    return matchesSearch && matchesType && matchesCity;
  }).sort((a, b) => {
    // Always pin featured events to top
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  const eventTypes = ['all', ...Array.from(new Set(MOCK_ALL_EVENTS.map(e => e.type)))];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Discover the Best</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                {selectedCity === 'All Cities' ? 'All Events' : `Events in ${selectedCity}`}
              </h1>
              <p className="text-slate-400 font-medium text-lg">
                {selectedCity === 'All Cities' 
                  ? 'Browse through the most exciting college events across India.' 
                  : `Browse through the most exciting college events in ${selectedCity}.`}
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 p-2 rounded-3xl border border-white/10">
            <div className="w-full md:w-auto">
              <FilterDropdown
                options={eventTypes}
                selectedValue={filterType}
                onChange={setFilterType}
              />
            </div>
            
            <div className="relative flex-grow group w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search by event name, college or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-2xl pl-14 pr-6 text-white focus:outline-none focus:ring-4 focus:ring-primary/10 md:focus:ring-0 transition-all font-medium"
              />
            </div>
          </div>

          {/* Events Grid */}
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
      </main>

      <Footer />
    </div>
  );
}

export default function EventsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading events...</div>}>
      <EventsContent />
    </React.Suspense>
  );
}
