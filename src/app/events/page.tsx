'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Search,
  Calendar,
  MapPin,
  Building2,
  Loader2,
  X,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEvents, PublicEvent } from '@/lib/api';
import { formatDate } from '@/utils/formatDate';
import { useLocation } from '@/context/LocationContext';

export default function EventsPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCity } = useLocation();

  useEffect(() => {
    getAllEvents()
      .then(setEvents)
      .catch(() => setError('Could not load events. Please try again later.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() =>
    events.filter(ev => {
      const college = typeof ev.college === 'object' ? ev.college : null;
      const name = ev.title.toLowerCase();
      const city = (ev.city || college?.city || '').toLowerCase();
      const matchSearch = name.includes(searchQuery.toLowerCase()) ||
        city.includes(searchQuery.toLowerCase());
      const matchCity = selectedCity === 'All Cities' || ev.city === selectedCity || college?.city === selectedCity;
      return matchSearch && matchCity;
    }),
    [events, searchQuery, selectedCity]);

  const getCollegeName = (ev: PublicEvent) => {
    if (!ev.college) return 'EventKaro';
    if (typeof ev.college === 'string') return ev.college;
    return ev.college.name || 'EventKaro';
  };

  const getCity = (ev: PublicEvent) => {
    if (ev.city) return ev.city;
    if (typeof ev.college === 'object' && ev.college?.city) return ev.college.city;
    return '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="h-3.5 w-3.5" />
              <span>Live Events</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Explore <span className="text-primary">Events</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              Discover the most exciting college events happening across India.
            </p>
          </motion.div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-6 mb-10">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search events by name or city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-primary/50 focus:border-primary"
              />
            </div>
            {(searchQuery || selectedCity !== 'All Cities') && (
              <Button
                variant="ghost"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12 px-4 gap-2 flex-shrink-0"
              >
                <X className="h-4 w-4" /> Clear
              </Button>
            )}
            <div className="text-sm text-slate-500 font-medium flex-shrink-0">
              {isLoading ? '' : `${filtered.length} events`}
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="container mx-auto px-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-red-400 font-bold text-lg">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No events found</h3>
              <p className="text-slate-500">Try adjusting your search or city filter.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((event, index) => (
                  <Link key={event._id} href={`/event/${event._id}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer h-full"
                  >
                    {/* Poster */}
                    <div className="aspect-[4/3] overflow-hidden bg-slate-800 relative">
                      {event.posters && event.posters.length > 0 ? (
                        <img
                          src={event.posters[0]}
                          alt={event.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-slate-800 flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      {event.category && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary/90 text-white border-none text-[10px] font-bold uppercase tracking-wider">
                            {event.category}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <GraduationCap className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                        <span className="truncate">{getCollegeName(event)}</span>
                      </div>
                      {getCity(event) && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                          <span>{getCity(event)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                    </div>
                  </motion.div>
                  </Link>
                ))}
              </div>
            </AnimatePresence>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
