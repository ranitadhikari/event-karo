'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/EventCard';
import { CollegeCard } from '@/components/CollegeCard';
import { 
  ArrowRight, 
  Calendar, 
  Search, 
  GraduationCap, 
  Zap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Code,
  Music,
  Lightbulb,
  Trophy,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data with posters for cinematic look
const FEATURED_EVENTS = [
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
  }
];

const TRENDING_EVENTS = [
  ...FEATURED_EVENTS,
  {
    id: '4',
    title: 'RoboWars 2.0',
    description: 'The ultimate battle of machines.',
    eventDate: '2026-06-10',
    lastRegistrationDate: '2026-06-05',
    collegeId: 'c1',
    collegeName: 'IIT Delhi',
    type: 'Technical',
    poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000'
  }
];

const CATEGORIES = [
  { name: 'Hackathons', icon: Code, color: 'from-blue-600 to-cyan-500' },
  { name: 'Workshops', icon: Zap, color: 'from-amber-500 to-orange-600' },
  { name: 'Tech Talks', icon: Lightbulb, color: 'from-purple-600 to-pink-500' },
  { name: 'Cultural Fest', icon: Music, color: 'from-rose-500 to-red-600' },
  { name: 'Competitions', icon: Trophy, color: 'from-emerald-500 to-teal-600' },
];

const PARTICIPATING_COLLEGES = [
  {
    id: 'c1',
    name: 'Delhi Technological University',
    email: 'admin@dtu.ac.in',
    city: 'Delhi',
    description: 'One of the oldest and most prestigious engineering colleges in India.',
    status: 'APPROVED' as const,
  },
  {
    id: 'c2',
    name: 'Lady Shri Ram College',
    email: 'admin@lsr.edu.in',
    city: 'Delhi',
    description: 'A premier institution for higher education for women in India.',
    status: 'APPROVED' as const,
  },
  {
    id: 'c3',
    name: 'SRCC',
    email: 'admin@srcc.edu',
    city: 'Delhi',
    description: 'The top college in India for commerce and economics.',
    status: 'APPROVED' as const,
  }
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_EVENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* 1. Hero Banner Carousel Section */}
        <section className="relative h-[85vh] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              {/* Poster Background */}
              <img 
                src={FEATURED_EVENTS[currentSlide].poster} 
                alt={FEATURED_EVENTS[currentSlide].title}
                className="h-full w-full object-cover scale-105"
              />
              {/* Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 container mx-auto px-6 flex flex-col justify-center">
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="max-w-2xl space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary font-bold text-xs uppercase tracking-widest">
                    <Sparkles className="h-4 w-4" />
                    <span>Featured Event</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                    {FEATURED_EVENTS[currentSlide].title.split(':').map((part, i) => (
                      <span key={i} className={i === 1 ? "text-primary block" : "block"}>
                        {part}
                      </span>
                    ))}
                  </h1>
                  <p className="text-xl text-slate-300 max-w-lg line-clamp-2 font-medium">
                    {FEATURED_EVENTS[currentSlide].description}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <Link href={`/event/${FEATURED_EVENTS[currentSlide].id}`}>
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest px-10 h-14 rounded-xl shadow-2xl shadow-primary/20">
                        Register Now
                      </Button>
                    </Link>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Event Date</span>
                      <span className="text-lg font-bold">{FEATURED_EVENTS[currentSlide].eventDate}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 right-10 flex gap-3">
            {FEATURED_EVENTS.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-primary' : 'w-6 bg-white/20'}`}
              />
            ))}
          </div>
        </section>

        {/* 2. Trending Events Section */}
        <section className="py-24 bg-slate-950 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter uppercase">Trending Events</h2>
                <div className="h-1 w-20 bg-primary rounded-full" />
              </div>
              <Link href="/events">
                <Button variant="ghost" className="text-slate-400 hover:text-white uppercase tracking-widest font-bold text-xs flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-12 snap-x no-scrollbar">
              {TRENDING_EVENTS.map((event, i) => (
                <div key={event.id} className="min-w-[320px] md:min-w-[380px] snap-start">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Explore by Category */}
        <section className="py-24 bg-slate-900/50 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Browse Categories</h2>
              <p className="text-slate-400 font-medium">Find what excites you the most</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`group relative aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-2xl`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <cat.icon className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-xl font-bold text-white tracking-tight uppercase leading-tight">{cat.name}</h3>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Featured Colleges */}
        <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <GraduationCap className="h-3 w-3" />
                <span>Premium Partners</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase">Featured Colleges</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PARTICIPATING_COLLEGES.map((college) => (
                <CollegeCard key={college.id} college={college as any} />
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/colleges">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest px-8 h-12 rounded-xl">
                  Explore All Colleges
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 blur-[150px] -z-10" />
          <div className="container mx-auto px-6">
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none max-w-4xl mx-auto">
                Ready to Experience the Best Events?
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                Join thousands of students and never miss out on the most happening events in Delhi.
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-6">
                <Link href="/login">
                  <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 font-bold uppercase tracking-widest px-10 h-16 rounded-2xl shadow-2xl">
                    Get Started
                  </Button>
                </Link>
                <Link href="/college/register">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 font-bold uppercase tracking-widest px-10 h-16 rounded-2xl">
                    Register College
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
