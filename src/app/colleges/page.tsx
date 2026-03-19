'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CollegeCard } from '@/components/CollegeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, School, X, ArrowUpDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getColleges, PublicCollege } from '@/lib/api';
import { useLocation } from '@/context/LocationContext';

export default function CollegesPage() {
  const [colleges, setColleges] = useState<PublicCollege[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const { selectedCity, setSelectedCity } = useLocation();
  const router = useRouter();

  useEffect(() => {
    getColleges()
      .then(setColleges)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(colleges.map(c => c.city).filter(Boolean)));
    return ['All Cities', ...unique.sort()];
  }, [colleges]);

  const filtered = useMemo(() =>
    colleges
      .filter(c => {
        const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.city?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCity = selectedCity === 'All Cities' || c.city === selectedCity;
        return matchSearch && matchCity;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'city-asc') return (a.city || '').localeCompare(b.city || '');
        return 0;
      }),
    [colleges, searchQuery, selectedCity, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setSortBy('name-asc');
  };

  // Map PublicCollege → College interface shape for CollegeCard
  const toCardCollege = (c: PublicCollege) => ({
    id: c._id,
    name: c.name,
    email: c.email || '',
    city: c.city,
    country: 'India',
    description: c.description,
    status: 'approved' as const,
    logo: c.logo,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Header */}
        <section className="container mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <School className="h-3.5 w-3.5" />
              <span>Partner Institutions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Discover <span className="text-primary">Colleges</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              Explore our network of approved colleges and find the best events, workshops, and opportunities happening across campuses.
            </p>
          </motion.div>
        </section>

        {/* Search & Filters */}
        <section className="container mx-auto px-6 mb-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  placeholder="Search by college name or city..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50 focus:border-primary text-base"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-48">
                  <Select value={selectedCity} onValueChange={v => setSelectedCity(v ?? 'All Cities')}>
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
                  <Select value={sortBy} onValueChange={v => setSortBy(v ?? 'name-asc')}>
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
                  <Button variant="ghost" onClick={clearFilters} className="h-14 px-6 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl">
                    <X className="h-4 w-4 mr-2" /> Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="text-sm text-slate-500 font-medium px-2">
              {isLoading ? 'Loading...' : `Showing ${filtered.length} ${filtered.length === 1 ? 'college' : 'colleges'}`}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map(college => (
                    <motion.div
                      key={college._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CollegeCard college={toCardCollege(college)} />
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
                    We couldn't find any colleges matching your current search or filters.
                  </p>
                  <Button onClick={clearFilters} className="mt-8 bg-primary hover:bg-primary/90">
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
