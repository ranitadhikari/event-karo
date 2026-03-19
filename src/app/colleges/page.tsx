'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CollegeCard } from '@/components/CollegeCard';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  School, 
  Filter,
  ArrowUpDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { College } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from '@/context/LocationContext';

// Mock data for colleges
const MOCK_COLLEGES: College[] = [
  {
    id: 'c1',
    name: 'Delhi Technological University',
    email: 'admin@dtu.ac.in',
    city: 'Delhi',
    country: 'India',
    description: 'A premier engineering institution known for its research and technical excellence.',
    status: 'approved',
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b5/DTU%2C_Delhi_official_logo.png'
  },
  {
    id: 'c2',
    name: 'Lady Shri Ram College',
    email: 'admin@lsr.edu.in',
    city: 'Delhi',
    country: 'India',
    description: 'One of India\'s most prestigious liberal arts colleges for women.',
    status: 'approved',
  },
  {
    id: 'c6',
    name: 'IIT Bombay',
    email: 'admin@iitb.ac.in',
    city: 'Mumbai',
    country: 'India',
    description: 'A world-class technical university in Mumbai.',
    status: 'approved',
  },
  {
    id: 'c7',
    name: 'COEP Pune',
    email: 'admin@coep.ac.in',
    city: 'Pune',
    country: 'India',
    description: 'One of the oldest engineering colleges in Asia.',
    status: 'approved',
  }
];

export default function CollegesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCity, setSelectedCity } = useLocation();
  const [sortBy, setSortBy] = useState('name-asc');

  // Get unique cities for filtering
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(MOCK_COLLEGES.map(c => c.city)));
    return ['All Cities', ...uniqueCities];
  }, []);

  // Filter and sort colleges
  const filteredColleges = useMemo(() => {
    return MOCK_COLLEGES
      .filter(college => {
        const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             college.city.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = selectedCity === 'All Cities' || college.city === selectedCity;
        return matchesSearch && matchesCity;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'city-asc') return a.city.localeCompare(b.city);
        return 0;
      });
  }, [searchQuery, selectedCity, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setSortBy('name-asc');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Header Section */}
        <section className="container mx-auto px-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <School className="h-3.5 w-3.5" />
              <span>Partner Institutions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Discover <span className="text-primary">Colleges</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              Explore our network of partner colleges and find the best events, workshops, and opportunities happening across campuses.
            </p>
          </motion.div>
        </section>

        {/* Search and Filters Section */}
        <section className="container mx-auto px-6 mb-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input 
                  placeholder="Search by college name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50 focus:border-primary text-base"
                />
              </div>

              {/* Filters & Sorting */}
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-48">
                  <Select value={selectedCity} onValueChange={(val) => setSelectedCity(val ?? 'All Cities')}>
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <SelectValue placeholder="Select City" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      {cities.map(city => (
                        <SelectItem key={city} value={city} className="focus:bg-primary/20 focus:text-white">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-48">
                  <Select value={sortBy} onValueChange={(val) => setSortBy(val ?? 'name-asc')}>
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4 text-slate-500" />
                        <SelectValue placeholder="Sort By" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="name-asc" className="focus:bg-primary/20 focus:text-white">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc" className="focus:bg-primary/20 focus:text-white">Name (Z-A)</SelectItem>
                      <SelectItem value="city-asc" className="focus:bg-primary/20 focus:text-white">City (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(searchQuery || selectedCity !== 'All Cities' || sortBy !== 'name-asc') && (
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="h-14 px-6 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-slate-500 font-medium px-2">
              Showing {filteredColleges.length} {filteredColleges.length === 1 ? 'college' : 'colleges'}
            </div>
          </div>
        </section>

        {/* Colleges Grid */}
        <section className="container mx-auto px-6 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredColleges.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredColleges.map((college) => (
                  <motion.div
                    key={college.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CollegeCard college={college} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No colleges found</h3>
                <p className="text-slate-500 max-w-md">
                  We couldn't find any colleges matching your current search or filters. Try adjusting them or clear all filters.
                </p>
                <Button 
                  onClick={clearFilters}
                  className="mt-8 bg-primary hover:bg-primary/90"
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  );
}
