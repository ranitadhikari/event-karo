'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Users, 
  ExternalLink,
  ArrowRight,
  Info,
  ShieldCheck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { College, Event } from '@/types';
import { motion } from 'framer-motion';

// Mock college detail data with poster
const MOCK_COLLEGE: College & { recentEvents: Event[] } = {
  id: 'c1',
  name: 'Delhi Technological University',
  email: 'admin@dtu.ac.in',
  city: 'Delhi',
  description: 'Delhi Technological University (DTU), formerly known as Delhi College of Engineering (DCE), is a premier government university located in New Delhi, India.',
  status: 'APPROVED',
  website: 'https://www.dtu.ac.in',
  address: 'Shahbad Daulatpur, Main Bawana Road, Delhi, 110042',
  phone: '011-27871018',
  about: 'Established in 1941, it is one of the oldest and most prestigious engineering colleges in the country. DTU has been a pioneer in engineering education and research for over eight decades. The university offers undergraduate, postgraduate, and doctoral programs in various disciplines of engineering, technology, science, and management.',
  logo: '',
  recentEvents: [
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
      id: '4',
      title: 'RoboWars 2.0',
      description: 'The ultimate robot fighting competition. Build your bot and fight for the title.',
      eventDate: '2026-05-10',
      lastRegistrationDate: '2026-05-05',
      collegeId: 'c1',
      collegeName: 'DTU, Delhi',
      type: 'Competition',
      poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000'
    }
  ]
};

export default function CollegeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const college = MOCK_COLLEGE;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* 1. Modern Glassmorphism Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />
          
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
              {/* College Logo with glow */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative shrink-0"
              >
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[40px]" />
                <div className="h-48 w-48 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center p-8 relative z-10 shadow-2xl">
                  {college.logo ? (
                    <img src={college.logo} alt={college.name} className="w-full h-full object-contain" />
                  ) : (
                    <GraduationCap className="h-24 w-24 text-primary opacity-80" />
                  )}
                </div>
              </motion.div>

              {/* College Info */}
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
                  {college.description}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total Events</span>
                    <span className="text-2xl font-black text-white">45+</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Students</span>
                    <span className="text-2xl font-black text-white">12K+</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Established</span>
                    <span className="text-2xl font-black text-white">1941</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-8">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-primary/20">
                    Follow College
                  </Button>
                  <Link href={college.website || '#'}>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest px-8 h-12 rounded-xl">
                      Visit Website <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. Detailed About Section */}
        <section className="py-24 bg-slate-900/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                    About the Institution
                  </h3>
                  <div className="h-1 w-20 bg-primary rounded-full" />
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    {college.about}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Contact Email</h4>
                    <p className="text-slate-400 font-medium">{college.email}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Phone Number</h4>
                    <p className="text-slate-400 font-medium">{college.phone}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 rounded-[32px] p-8 space-y-6">
                  <h4 className="text-xl font-black uppercase tracking-tighter">Location</h4>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <p className="text-slate-300 font-medium">{college.address}</p>
                  </div>
                  <Button className="w-full bg-white text-slate-950 hover:bg-slate-200 font-bold uppercase tracking-widest h-12 rounded-xl">
                    Get Directions
                  </Button>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                  <h4 className="text-xl font-black uppercase tracking-tighter">Social Presence</h4>
                  <div className="flex gap-4">
                    {[Globe, MessageSquare, ExternalLink].map((Icon, i) => (
                      <div key={i} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
                        <Icon className="h-5 w-5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Recent Events Section */}
        <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Happening Now</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter uppercase">Recent Events</h2>
                <div className="h-1 w-20 bg-primary rounded-full" />
              </div>
              <Button variant="ghost" className="text-slate-400 hover:text-white uppercase tracking-widest font-bold text-xs flex items-center gap-2">
                View All Events <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {college.recentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
              {/* Extra mock cards to fill space */}
              <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">More events coming soon</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
