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
  ChevronRight,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { Event } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { EventCard } from '@/components/EventCard';

// Mock event detail with poster
const MOCK_EVENTS_DATA: Record<string, Event & { poster: string, tagline?: string, prizePool?: string, isFeatured?: boolean }> = {
  'codesphere-hackathon': {
    id: 'codesphere-hackathon',
    title: 'CodeSphere Hackathon',
    tagline: 'Think • Build • Ship',
    description: 'CodeSphere Hackathon is a premier 36-hour hackathon where developers, designers, and innovators come together to build cutting-edge solutions. Organized by SGT University, this event aims to foster innovation and creativity in the student community. With a massive prize pool of ₹1.5 Lakh, participants will have the opportunity to showcase their skills, network with industry experts, and turn their ideas into reality.',
    eventDate: '2026-03-18',
    lastRegistrationDate: '2026-03-05',
    collegeId: 'sgt-university',
    collegeName: 'SGT University',
    city: 'Gurugram',
    state: 'Haryana',
    type: 'Hackathon',
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    prizePool: '₹1.5 Lakh',
    isFeatured: true
  },
  '1': {
    id: '1',
    title: 'CodeFest 2026',
    description: 'A 24-hour hackathon to build innovative solutions for urban problems. This event brings together the brightest minds from colleges to compete and innovate. Participants will have 24 hours to develop a working prototype that addresses one of the many challenges faced by the city, ranging from waste management and traffic congestion to water conservation and air quality improvement. Join us for a weekend of intense coding, mentorship, and the chance to win prizes worth ₹1,0,000!',
    eventDate: '2026-04-15',
    lastRegistrationDate: '2026-04-10',
    collegeId: 'c1',
    collegeName: 'Delhi Technological University (DTU)',
    city: 'Delhi',
    type: 'Hackathon',
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200'
  }
};

const SIMILAR_EVENTS = Object.values(MOCK_EVENTS_DATA);

const HACKATHON_SCHEDULE = [
  {
    day: 'Day 1: 18 March 2026',
    items: [
      { time: '09:00 AM', event: 'Registration & Breakfast' },
      { time: '11:00 AM', event: 'Opening Ceremony' },
      { time: '12:00 PM', event: 'Hacking Begins' },
      { time: '02:00 PM', event: 'Lunch' },
      { time: '08:00 PM', event: 'Dinner' }
    ]
  },
  {
    day: 'Day 2: 19 March 2026',
    items: [
      { time: '08:00 AM', event: 'Breakfast' },
      { time: '01:00 PM', event: 'Lunch' },
      { time: '06:00 PM', event: 'Project Submission' },
      { time: '08:00 PM', event: 'Final Presentations' },
      { time: '10:00 PM', event: 'Award Ceremony' }
    ]
  }
];

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const event = MOCK_EVENTS_DATA[resolvedParams.id] || MOCK_EVENTS_DATA['1'];
  const isCodeSphere = event.id === 'codesphere-hackathon';

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
        <section className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden">
          {/* Background Poster Blur */}
          <div className="absolute inset-0">
            <img 
              src={event.poster} 
              alt="" 
              className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-end">
              {/* Left: Large Poster */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className={`${isCodeSphere ? 'w-80 lg:w-[450px]' : 'w-72 lg:w-96'} shrink-0 aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 relative group`}
              >
                <img src={event.poster} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {isCodeSphere && (
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-amber-500 text-slate-950 border-none px-4 py-2 text-xs font-black uppercase tracking-widest shadow-2xl">
                      🔥 Trending
                    </Badge>
                  </div>
                )}
              </motion.div>

              {/* Right: Event Brief Info */}
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex-grow space-y-6 text-center md:text-left"
              >
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                  <Badge className={`${isCodeSphere ? 'bg-primary' : 'bg-primary/20 text-primary'} border-primary/30 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest`}>
                    {event.type}
                  </Badge>
                  {isCodeSphere && (
                    <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                      🏆 Premium Event
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-300 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Registration open
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {isCodeSphere && event.tagline && (
                    <p className="text-primary font-black text-xl uppercase tracking-[0.3em]">
                      {event.tagline}
                    </p>
                  )}
                  <h1 className={`${isCodeSphere ? 'text-6xl md:text-8xl' : 'text-5xl md:text-7xl'} font-black tracking-tighter leading-none max-w-4xl uppercase`}>
                    {event.title}
                  </h1>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 pt-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <Building2 className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Organized by</p>
                      <p className="text-xl font-bold text-white group-hover:text-primary transition-colors">{event.collegeName}</p>
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

                  {isCodeSphere && event.prizePool && (
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Trophy className="h-7 w-7 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Prize Pool</p>
                        <p className="text-2xl font-black text-amber-400">{event.prizePool}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. Detailed Content & Actions */}
        <section className="py-24 bg-slate-950 relative">
          {/* Background Decorative Gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-primary/5 blur-[120px] -z-10" />
          
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left Column: Description & Details */}
              <div className="lg:col-span-8 space-y-16">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">About the Event</h3>
                  </div>
                  <div className="h-1.5 w-24 bg-primary rounded-full" />
                  <p className="text-slate-400 text-xl leading-relaxed font-medium">
                    {event.description}
                  </p>
                </div>

                {isCodeSphere && (
                  <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Trophy className="h-40 w-40 text-primary" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-amber-500" />
                        36 Hour Hackathon
                      </h3>
                      <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                        Get ready for an adrenaline-fueled 36-hour coding marathon! Build, innovate, and compete with the best minds in the country. From agriculture to AIOT, pick your track and build something that matters.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        {['Agriculture', 'Healthcare', 'Community', 'AIOT'].map((track) => (
                          <div key={track} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                            <span className="text-white font-bold uppercase tracking-widest text-[10px]">{track}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {isCodeSphere && (
                  <div className="space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">Hackathon Schedule</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {HACKATHON_SCHEDULE.map((day, idx) => (
                        <div key={idx} className="space-y-6">
                          <h4 className="text-xl font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-4">{day.day}</h4>
                          <div className="space-y-4">
                            {day.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-6 group">
                                <span className="text-slate-500 font-black text-sm w-20 shrink-0 group-hover:text-primary transition-colors">{item.time}</span>
                                <div className="h-2 w-2 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                <span className="text-white font-bold text-lg">{item.event}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-4 hover:bg-white/10 transition-colors duration-300">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Registration Deadline</h4>
                    <p className="text-slate-400 font-medium">Last date to apply is <span className="text-white font-bold">{formatDate(event.lastRegistrationDate)}</span>. Don't miss your chance!</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-4 hover:bg-white/10 transition-colors duration-300">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Eligibility</h4>
                    <p className="text-slate-400 font-medium">Open to all students from recognized colleges across the country.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 rounded-[40px] p-10 space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Event Location</h3>
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white">{event.collegeName}</p>
                      <p className="text-slate-400 font-medium text-lg">{event.city}, {event.state || 'India'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-widest h-14 px-8 rounded-2xl">
                    Get Directions
                  </Button>
                </div>
              </div>

              {/* Right Column: Sticky Action Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <div className={`bg-white/5 backdrop-blur-3xl border ${isCodeSphere ? 'border-primary/30 shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]' : 'border-white/10'} rounded-[40px] p-10 shadow-2xl`}>
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Entry Fee</span>
                        <span className="text-4xl font-black text-primary">FREE</span>
                      </div>

                      <div className="space-y-4">
                        {isRegistered ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center space-y-6">
                            <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                              <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                            <h5 className="text-2xl font-bold text-emerald-400 uppercase tracking-tight">Registered!</h5>
                            <p className="text-sm text-slate-400 font-medium">Check your dashboard for details.</p>
                            <Link href="/student/my-events" className="block">
                              <Button variant="outline" className="w-full border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 h-14 rounded-2xl font-bold">
                                View My Events
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <Button 
                            size="lg" 
                            onClick={handleRegister}
                            disabled={isRegistering}
                            className={`w-full ${isCodeSphere ? 'bg-primary shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)]' : 'bg-primary'} hover:bg-primary/90 text-white font-black uppercase tracking-widest h-20 rounded-[28px] text-xl group`}
                          >
                            {isRegistering ? (
                              <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                              <>
                                Register Now
                                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="pt-4 space-y-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black text-center">Share this event</p>
                        <div className="flex justify-center gap-4">
                          <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                            <Share2 className="h-5 w-5 text-slate-400" />
                          </button>
                          <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-slate-400 font-bold text-xs">
                            TW
                          </button>
                          <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-slate-400 font-bold text-xs">
                            IN
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isCodeSphere && (
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-[40px] p-8 text-center space-y-4">
                      <Trophy className="h-10 w-10 text-amber-500 mx-auto" />
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter">Grand Prizes</h4>
                      <p className="text-slate-400 text-sm font-medium">Winner takes home ₹75,000 + Sponsored Trip!</p>
                    </div>
                  )}
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
