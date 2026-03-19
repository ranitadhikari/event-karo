'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  GraduationCap,
  Calendar,
  ExternalLink,
  ArrowRight,
  Info,
  ShieldCheck,
  Loader2,
  CalendarX,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getCollegeById, CollegeWithEvents, PublicEvent } from '@/lib/api';
import { formatDate } from '@/utils/formatDate';

export default function CollegeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

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
        <div className="space-y-4">
          <p className="text-xl font-bold">{error || 'College not found'}</p>
          <Link href="/colleges">
            <Button variant="outline">Back to Colleges</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { college, events } = data;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary">
      <Navbar />

      <main className="flex-grow pt-20">

        {/* ── SECTION 1: Hero ── */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">

              {/* Logo */}
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[40px]" />
                <div className="h-48 w-48 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center p-8 relative z-10 shadow-2xl">
                  {college.logo ? (
                    <img src={college.logo} alt={college.name} className="w-full h-full object-contain" />
                  ) : (
                    <GraduationCap className="h-24 w-24 text-primary opacity-80" />
                  )}
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-grow space-y-6 text-center md:text-left"
              >
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified Partner
                  </Badge>
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-400 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin className="h-3 w-3 mr-1" /> {college.city}
                  </Badge>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                  {college.name}
                </h1>

                <p className="text-xl text-slate-400 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
                  {college.description || 'A premier educational institution dedicated to academic excellence.'}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-sm px-4 py-2">
                    {events.length} Upcoming Event{events.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: About + Contact ── */}
        <section className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

              {/* About */}
              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                    About the Institution
                  </h3>
                  <div className="h-1 w-20 bg-primary rounded-full" />
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    {college.description || 'No additional information available for this college.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {college.email && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-bold uppercase tracking-tight">Contact Email</h4>
                      <p className="text-slate-400 font-medium break-all">{college.email}</p>
                    </div>
                  )}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">City</h4>
                    <p className="text-slate-400 font-medium">{college.city}</p>
                  </div>
                </div>
              </div>

              {/* Side panel */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 rounded-[32px] p-8 space-y-6">
                  <h4 className="text-xl font-black uppercase tracking-tighter">Quick Info</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-300">
                      <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{college.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{college.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{events.length} upcoming events</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: Events ── */}
        <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Upcoming Events</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter uppercase">Events by {college.name}</h2>
                <div className="h-1 w-20 bg-primary rounded-full" />
              </div>
            </div>

            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <CalendarX className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Upcoming Events</h3>
                <p className="text-slate-500">This college hasn't posted any upcoming events yet. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event: PublicEvent, index: number) => (
                  <Link key={event._id} href={`/event/${event._id}`} className="block">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group cursor-pointer"
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
                          {event.venue && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Building2 className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          )}
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
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
