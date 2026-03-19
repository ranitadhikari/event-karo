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
  Users,
  MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '@/context/LocationContext';

// Mock data with posters for cinematic look
const FEATURED_EVENTS = [
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
    poster: 'https://res.cloudinary.com/dwserksvu/image/upload/v1773847448/WhatsApp_Image_2026-03-18_at_8.49.46_PM_n6833k.jpg', // Placeholder
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
    country: 'India',
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
    country: 'India',
    type: 'Cultural',
    poster: 'https://res.cloudinary.com/dwserksvu/image/upload/v1773907412/WhatsApp_Image_2026-03-18_at_3.25.39_PM_nbmlu2.jpg'
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
    country: 'India',
    type: 'Academic',
    poster: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000'
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
    country: 'India',
    type: 'Technical',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000'
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
    collegeName: 'DTU',
    city: 'Delhi',
    country: 'India',
    type: 'Technical',
    poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000'
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
    country: 'India',
    type: 'Workshop',
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000'
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
    id: 'sgt-university',
    name: 'SGT University',
    email: 'admin@sgtuniversity.ac.in',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    description: 'A premier educational institution in Gurugram, Haryana, dedicated to excellence in teaching and research.',
    status: 'APPROVED' as const,
  },
  {
    id: 'c1',
    name: 'Delhi Technological University',
    email: 'admin@dtu.ac.in',
    city: 'Delhi',
    country: 'India',
    description: 'One of the oldest and most prestigious engineering colleges in India.',
    status: 'APPROVED' as const,
  },
  {
    id: 'c2',
    name: 'Lady Shri Ram College',
    email: 'admin@lsr.edu.in',
    city: 'Delhi',
    country: 'India',
    description: 'A premier institution for higher education for women in India.',
    status: 'APPROVED' as const,
  },
  {
    id: 'c6',
    name: 'IIT Bombay',
    email: 'admin@iitb.ac.in',
    city: 'Mumbai',
    country: 'India',
    description: 'The top engineering institute in Mumbai.',
    status: 'APPROVED' as const,
  }
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { selectedCity } = useLocation();

  const featuredEvent = FEATURED_EVENTS.find(e => e.id === 'codesphere-hackathon');
  const otherFeaturedEvents = FEATURED_EVENTS.filter(e => e.id !== 'codesphere-hackathon');

  const filteredFeaturedEvents = selectedCity === 'All Cities' 
    ? otherFeaturedEvents 
    : otherFeaturedEvents.filter(e => e.city === selectedCity);

  const displayEvents = filteredFeaturedEvents.length > 0 ? filteredFeaturedEvents : otherFeaturedEvents;

  // Reset slide index when displayEvents changes to avoid out-of-bounds error
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedCity]);

  useEffect(() => {
    if (displayEvents.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayEvents.length]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* 0. Main Featured Event Hero (CodeSphere) */}
        {featuredEvent && (
          <section className="relative h-[90vh] w-full overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              {/* Poster Background with Zoom Effect */}
              <motion.img 
                src={featuredEvent.poster} 
                alt={featuredEvent.title}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="h-full w-full object-cover"
              />
              
              {/* Dark Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-slate-950/20" />
              
              {/* Content */}
              <div className="absolute inset-0 container mx-auto px-6 flex flex-col justify-center">
                <div className="max-w-4xl space-y-8">
                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-500 font-black text-[10px] uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                      {/* <Sparkles className="h-3.5 w-3.5 fill-current" /> */}
                      {/* <span>🔥 Featured Event</span> */}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-primary font-black text-base md:text-xl uppercase tracking-[0.4em]">
                        {featuredEvent.tagline}
                      </p>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] md:leading-[1] uppercase drop-shadow-2xl">
                        {featuredEvent.title.split(' ')[0]}<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">
                          {featuredEvent.title.split(' ').slice(1).join(' ')}
                        </span>
                      </h1>
                    </div>

                    <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                      {featuredEvent.description}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 py-6 border-y border-white/10"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Prize Pool</span>
                      <span className="text-xl md:text-2xl font-black text-amber-400 flex items-center gap-2">
                        <Trophy className="h-5 w-5 md:h-6 md:w-6 shrink-0" /> {featuredEvent.prizePool}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Date</span>
                      <span className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" /> {formatDate(featuredEvent.eventDate)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Location</span>
                      <span className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" /> {featuredEvent.collegeName}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="flex flex-wrap gap-6 pt-4"
                  >
                    <Link href={`/event/${featuredEvent.id}`}>
                      <Button size="lg" className="h-16 px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] flex items-center gap-3 group">
                        Register Now 
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-4 px-6 border border-white/10 rounded-2xl backdrop-blur-md bg-white/5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                        Registrations Open Until {formatDate(featuredEvent.lastRegistrationDate)}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* 1. Hero Banner Carousel Section (Existing Featured Events) */}
        {displayEvents.length > 0 && displayEvents[currentSlide] && (
          <section className="relative h-[60vh] w-full overflow-hidden border-t border-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCity}-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                {/* Poster Background */}
                <img 
                  src={displayEvents[currentSlide].poster} 
                  alt={displayEvents[currentSlide].title}
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
                    className="max-w-3xl space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                        {displayEvents[currentSlide].type}
                      </Badge>
                      <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        {displayEvents[currentSlide].city}
                      </div>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[1.1] md:leading-none">
                      {displayEvents[currentSlide].title}
                    </h2>
                    
                    <p className="text-base md:text-lg text-slate-300 font-medium max-w-xl leading-relaxed">
                      {displayEvents[currentSlide].description}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <Link href={`/event/${displayEvents[currentSlide].id}`}>
                        <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold uppercase tracking-widest px-8 h-12 rounded-xl">
                          View Details
                        </Button>
                      </Link>
                      <div className="flex items-center gap-3 px-4 rounded-xl border border-white/10 backdrop-blur-md bg-white/5">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-widest">{formatDate(displayEvents[currentSlide].eventDate)}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Slider Controls */}
            <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
              <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + displayEvents.length) % displayEvents.length)}
                className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex gap-2">
                {displayEvents.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 transition-all duration-300 rounded-full ${i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`} 
                  />
                ))}
              </div>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % displayEvents.length)}
                className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>
        )}

        {/* 2. Trending Events Section */}
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Happening Now</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                  {selectedCity === 'All Cities' ? 'Explore Events Across India' : `Events in ${selectedCity}`}
                </h2>
                <p className="text-slate-400 font-medium text-lg max-w-xl">
                  {selectedCity === 'All Cities' 
                    ? 'Discover the most exciting college events happening all over the country.' 
                    : `Check out what's happening in ${selectedCity}'s top colleges.`}
                </p>
              </div>
              <Link href="/events">
                <Button variant="outline" className="bg-white text-slate-950 hover:bg-slate-200 font-bold uppercase tracking-widest px-10 h-16 rounded-2xl shadow-2xl">
                  View All Events <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(selectedCity === 'All Cities' 
                ? TRENDING_EVENTS 
                : TRENDING_EVENTS.filter(e => e.city === selectedCity)
              ).map((event) => (
                <EventCard key={event.id} event={event} />
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
                <Button variant="outline" className="bg-white text-slate-950 hover:bg-slate-200 font-bold uppercase tracking-widest px-10 h-16 rounded-2xl shadow-2xl">
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
                  <Button size="lg" variant="outline" className="bg-white text-slate-950 hover:bg-slate-200 font-bold uppercase tracking-widest px-10 h-16 rounded-2xl shadow-2xl">
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
