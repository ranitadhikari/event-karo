'use client';

import React, { use, useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Building2,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Info,
  Loader2,
  Ticket,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getEventById, PublicEvent } from '@/lib/api';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    getEventById(resolvedParams.id)
      .then(ev => {
        if (!ev) setError('Event not found');
        else setEvent(ev);
      })
      .catch(() => setError('Failed to load event'))
      .finally(() => setIsLoading(false));
  }, [resolvedParams.id]);

  const handleRegister = () => {
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      setIsRegistered(true);
      toast.success('Successfully registered for ' + event?.title);
    }, 1500);
  };

  const getCollegeName = () => {
    if (!event?.college) return 'EventKaro';
    if (typeof event.college === 'string') return event.college;
    return event.college.name || 'EventKaro';
  };

  const getCollegeCity = () => {
    if (event?.city) return event.city;
    if (typeof event?.college === 'object') return event?.college?.city || '';
    return '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center text-white">
        <div className="space-y-4">
          <p className="text-xl font-bold">{error || 'Event not found'}</p>
          <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const poster = event.posters?.[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary">
      <Navbar />

      <main className="flex-grow pt-20">

        {/* ── Hero ── */}
        <section className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden">
          {/* Blurred bg */}
          <div className="absolute inset-0">
            {poster ? (
              <img src={poster} alt="" className="w-full h-full object-cover blur-3xl opacity-40 scale-110" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-slate-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
            {/* Back */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center md:items-end">
              {/* Poster */}
              {poster && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-60 lg:w-80 shrink-0 aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10"
                >
                  <img src={poster} alt={event.title} className="w-full h-full object-cover" />
                </motion.div>
              )}

              {/* Info */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex-grow space-y-6 text-center md:text-left"
              >
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {event.category && (
                    <Badge className="bg-primary border-primary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                      {event.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-300 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                    {event.status === 'upcoming' ? '🟢 Registration Open' : event.status}
                  </Badge>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                  {event.title}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <GraduationCap className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Organized by</p>
                      <p className="text-xl font-bold text-white">{getCollegeName()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Calendar className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Event Date</p>
                      <p className="text-xl font-bold text-white">{formatDate(event.eventDate)}</p>
                    </div>
                  </div>

                  {getCollegeCity() && (
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <MapPin className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">City</p>
                        <p className="text-xl font-bold text-white">{getCollegeCity()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Details + Action ── */}
        <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

              {/* Left: Description + Venue */}
              <div className="lg:col-span-8 space-y-12">

                {/* About */}
                {event.description && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Info className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">About the Event</h3>
                    </div>
                    <div className="h-1.5 w-24 bg-primary rounded-full" />
                    <p className="text-slate-400 text-xl leading-relaxed font-medium">{event.description}</p>
                  </div>
                )}

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Event Date</h4>
                    <p className="text-slate-400 font-medium text-lg">{formatDate(event.eventDate)}</p>
                  </div>

                  {event.venue && (
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-bold uppercase tracking-tight">Venue</h4>
                      <p className="text-slate-400 font-medium text-lg">{event.venue}</p>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 rounded-[40px] p-10 space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Event Location</h3>
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white">{event.venue || getCollegeName()}</p>
                      <p className="text-slate-400 font-medium text-lg">{getCollegeCity()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sticky action card */}
              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <div className="bg-white/5 backdrop-blur-3xl border border-primary/30 shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)] rounded-[40px] p-10 shadow-2xl">
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Entry Fee</span>
                        <span className="text-4xl font-black text-primary">
                          {event.price && event.price > 0 ? `₹${event.price}` : 'FREE'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {isRegistered ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center space-y-4">
                            <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                            <h5 className="text-2xl font-bold text-emerald-400 uppercase">Registered!</h5>
                            <p className="text-sm text-slate-400">You're all set for this event.</p>
                          </div>
                        ) : (
                          <Button
                            size="lg"
                            onClick={handleRegister}
                            disabled={isRegistering}
                            className="w-full bg-primary hover:bg-primary/90 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] text-white font-black uppercase tracking-widest h-20 rounded-[28px] text-xl group"
                          >
                            {isRegistering ? (
                              <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                              <>
                                Register Now
                                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform ml-2" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="pt-2 space-y-3">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black text-center">Share this event</p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                            className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                          >
                            <Share2 className="h-5 w-5 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
