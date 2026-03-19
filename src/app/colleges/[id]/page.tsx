'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  Loader2,
  CalendarX,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getCollegeById, CollegeWithEvents, PublicEvent } from '@/lib/api';
import { formatDate } from '@/utils/formatDate';

export default function CollegeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<CollegeWithEvents | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getCollegeById(id)
      .then(setData)
      .catch(() => setError('Failed to load college data'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center text-white">
        <div>
          <p className="text-xl font-bold mb-4">{error || 'College not found'}</p>
          <Link href="/colleges">
            <Button variant="outline">Back to Colleges</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { college, events } = data;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Back */}
        <div className="container mx-auto px-6 mb-8">
          <Link href="/colleges">
            <Button variant="ghost" className="text-slate-400 hover:text-white gap-2 px-0">
              <ArrowLeft className="h-4 w-4" /> Back to Colleges
            </Button>
          </Link>
        </div>

        {/* ─── SECTION 1: College Profile ─── */}
        <section className="container mx-auto px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start"
          >
            {/* Logo */}
            <div className="flex-shrink-0 h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-inner">
              {college.logo ? (
                <img src={college.logo} alt={college.name} className="h-16 w-16 md:h-24 md:w-24 object-contain rounded-xl" />
              ) : (
                <GraduationCap className="h-12 w-12 text-primary" />
              )}
            </div>

            {/* Info */}
            <div className="space-y-4 flex-grow">
              <div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
                  {college.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    {college.city}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    ✓ Verified College
                  </Badge>
                </div>
              </div>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl">
                {college.description || 'A premier educational institution dedicated to academic excellence and student development.'}
              </p>
            </div>
          </motion.div>
        </section>

        {/* ─── SECTION 2: Events ─── */}
        <section className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
              <Calendar className="h-3.5 w-3.5" />
              <span>Upcoming Events</span>
            </div>
            <span className="text-slate-500 text-sm font-medium">{events.length} event{events.length !== 1 ? 's' : ''}</span>
          </div>

          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <CalendarX className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Upcoming Events</h3>
              <p className="text-slate-500">This college hasn't posted any upcoming events yet. Check back later!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: PublicEvent, index: number) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors group"
                >
                  {/* Poster */}
                  <div className="aspect-[16/9] overflow-hidden bg-slate-800">
                    {event.posters && event.posters.length > 0 ? (
                      <img
                        src={event.posters[0]}
                        alt={event.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-slate-800 flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-primary/40" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                    )}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Building2 className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      {event.city && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                          <span>{event.city}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
