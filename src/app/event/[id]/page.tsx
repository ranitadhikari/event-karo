'use client';

import React, { useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Building2, 
  Users, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Loader2, 
  Ticket,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Event } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { EventCard } from '@/components/EventCard';

// Mock event detail with poster
const MOCK_EVENT: Event & { poster: string } = {
  id: '1',
  title: 'CodeFest 2026',
  description: 'A 24-hour hackathon to build innovative solutions for urban problems in Delhi. This event brings together the brightest minds from colleges across Delhi to compete and innovate. Participants will have 24 hours to develop a working prototype that addresses one of the many challenges faced by the city of Delhi, ranging from waste management and traffic congestion to water conservation and air quality improvement. Join us for a weekend of intense coding, mentorship, and the chance to win prizes worth ₹1,00,000!',
  eventDate: '2026-04-15',
  lastRegistrationDate: '2026-04-10',
  collegeId: 'c1',
  collegeName: 'Delhi Technological University (DTU)',
  type: 'Hackathon',
  poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200'
};

const SIMILAR_EVENTS = [
  {
    id: '2',
    title: 'RoboWars 2.0',
    description: 'The ultimate battle of machines.',
    eventDate: '2026-06-10',
    lastRegistrationDate: '2026-06-05',
    collegeId: 'c1',
    collegeName: 'IIT Delhi',
    type: 'Technical',
    poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '3',
    title: 'Cultural Fest: Tarang',
    description: 'The annual cultural festival of LSR featuring music, dance, and arts.',
    eventDate: '2026-05-20',
    lastRegistrationDate: '2026-05-15',
    collegeId: 'c2',
    collegeName: 'LSR, DU',
    type: 'Cultural',
    poster: 'https://images.unsplash.com/photo-1514525253344-99a4299962c3?auto=format&fit=crop&q=80&w=1000'
  }
];

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const event = MOCK_EVENT;

  const handleRegister = async () => {
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      setIsRegistered(true);
      toast.success('Successfully registered for ' + event.title);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* 1. Cinematic Hero Section */}
        <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
          {/* Background Poster Blur */}
          <div className="absolute inset-0">
            <img 
              src={event.poster} 
              alt="" 
              className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent" />
          </div>

          <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-end">
              {/* Left: Large Poster */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden md:block w-72 lg:w-96 shrink-0 aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
              >
                <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
              </motion.div>

              {/* Right: Event Brief Info */}
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex-grow space-y-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                    {event.type}
                  </Badge>
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-300 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Registration open
                  </Badge>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight max-w-4xl">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-8 pt-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <Building2 className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Organized by</p>
                      <p className="text-lg font-bold text-white group-hover:text-primary transition-colors">{event.collegeName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Event Date</p>
                      <p className="text-lg font-bold text-white">{formatDate(event.eventDate)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. Detailed Content & Actions */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left Column: Description & Details */}
              <div className="lg:col-span-8 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                    About the Event
                  </h3>
                  <div className="h-1 w-20 bg-primary rounded-full" />
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 hover:bg-white/10 transition-colors duration-300">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Registration Deadline</h4>
                    <p className="text-slate-400 font-medium">Last date to apply is <span className="text-white font-bold">{formatDate(event.lastRegistrationDate)}</span>. Don't miss your chance!</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 hover:bg-white/10 transition-colors duration-300">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Eligibility</h4>
                    <p className="text-slate-400 font-medium">Open to all students from recognized colleges across Delhi-NCR region.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 rounded-3xl p-10 space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Event Location</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <MapPin className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{event.collegeName}</p>
                      <p className="text-slate-400 font-medium">Delhi, India</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-widest h-12 rounded-xl">
                    Get Directions
                  </Button>
                </div>
              </div>

              {/* Right Column: Sticky Action Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-6">
                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Entry Fee</span>
                        <span className="text-3xl font-black text-primary">FREE</span>
                      </div>

                      <div className="space-y-4">
                        {isRegistered ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4">
                            <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                              <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                            <h5 className="text-xl font-bold text-emerald-400 uppercase tracking-tight">Registered!</h5>
                            <p className="text-sm text-slate-400 font-medium">Check your dashboard for details.</p>
                            <Link href="/student/my-events" className="block">
                              <Button variant="outline" className="w-full border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 h-12 rounded-xl">
                                View My Events
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <Button 
                            size="lg" 
                            onClick={handleRegister}
                            disabled={isRegistering}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-16 rounded-2xl shadow-2xl shadow-primary/20 text-lg group"
                          >
                            {isRegistering ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                              <>
                                Register Now
                                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        )}
                        <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/5 h-14 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                          <Share2 className="h-5 w-5" />
                          Share Event
                        </Button>
                      </div>

                      <div className="pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Verified Event by EventKaro
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Organizer Details */}
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                    <h5 className="text-sm font-black uppercase tracking-widest text-slate-500">Organizer</h5>
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                        <Building2 className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-white line-clamp-1">{event.collegeName}</p>
                        <Link href={`/college/${event.collegeId}`} className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                          View Profile <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Similar Events Section */}
        <section className="py-24 bg-slate-900/30">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter uppercase">Similar Events</h2>
                <div className="h-1 w-20 bg-primary rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SIMILAR_EVENTS.map((item) => (
                <EventCard key={item.id} event={item as any} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
