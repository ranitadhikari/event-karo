'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { getSponsors, assignSponsor } from '@/lib/sponsorApi';
import { getSuperAdminEvents, PublicEvent } from '@/lib/api';
import { Sponsor } from '@/types';
import { 
  Gem, 
  Plus, 
  ExternalLink, 
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SponsorsPage() {
  const { token } = useAuth();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Assignment State
  const [selectedSponsor, setSelectedSponsor] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const loadData = async () => {
    setIsLoading(true);
    console.log('SponsorsPage: Loading data with token:', token ? 'exists' : 'null');
    try {
      const [sponsorsData, eventsData] = await Promise.all([
        getSponsors(token!),
        getSuperAdminEvents(token!)
      ]);
      console.log('SponsorsPage: Data loaded', { sponsorsCount: sponsorsData.length, eventsCount: eventsData.length });
      setSponsors(sponsorsData);
      setEvents(eventsData);
    } catch (err: any) {
      console.error('SponsorsPage: loadData error', err);
      toast.error('Failed to load sponsors or events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSponsor || !selectedEvent) {
      toast.error('Please select both a sponsor and an event');
      return;
    }

    setIsAssigning(true);
    try {
      await assignSponsor(token!, selectedSponsor, selectedEvent);
      toast.success('Sponsor assigned to event successfully!');
      setSelectedEvent('');
      // Reload to show updated data if needed (though backend might not show assignments in getSponsors yet)
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign sponsor');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <Gem className="h-8 w-8 text-blue-600" />
              Sponsor Management
            </h1>
            <p className="text-slate-500 font-medium">Manage platform partners and assign them to upcoming events</p>
          </div>
          <Link 
            href="/superadmin/create-sponsor" 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="h-5 w-5" />
            Add New Sponsor
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Registered Sponsors
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg text-xs">{sponsors.length}</span>
              </h2>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
                  <p className="font-medium">Loading sponsors...</p>
                </div>
              ) : sponsors.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <div className="bg-slate-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold">No sponsors found</p>
                  <p className="text-slate-400 text-sm mt-1">Start by adding your first sponsor partner</p>
                  <Link href="/superadmin/create-sponsor" className="text-blue-600 text-sm font-bold mt-4 inline-block hover:underline">
                    Add Sponsor Now
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sponsors.map((sponsor) => (
                    <motion.div 
                      layout
                      key={sponsor._id}
                      className="group relative bg-slate-50/50 border border-slate-100 p-5 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-blue-100 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
                          {sponsor.logo ? (
                            <img src={sponsor.logo} alt={sponsor.name} className="h-full w-full object-contain p-2" />
                          ) : (
                            <Building2 className="h-6 w-6 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 truncate">{sponsor.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sponsor.tier === 'title' ? 'bg-purple-100 text-purple-600' :
                              sponsor.tier === 'gold' ? 'bg-amber-100 text-amber-600' :
                              sponsor.tier === 'silver' ? 'bg-slate-100 text-slate-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {sponsor.tier}
                            </span>
                            {sponsor.website && (
                              <a 
                                href={sponsor.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-blue-600 transition-colors"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedSponsor(sponsor._id)}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                            selectedSponsor === sponsor._id 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                              : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignment Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">Assign to Event</h2>
              </div>

              <form onSubmit={handleAssign} className="space-y-5">
                {/* Sponsor Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Select Sponsor</label>
                  <select
                    value={selectedSponsor}
                    onChange={(e) => setSelectedSponsor(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50 font-medium"
                    required
                  >
                    <option value="">Choose a sponsor...</option>
                    {sponsors.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.tier})</option>
                    ))}
                  </select>
                </div>

                {/* Event Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Select Event</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50 font-medium"
                    required
                  >
                    <option value="">Choose an event...</option>
                    {events.map(e => (
                      <option key={e._id} value={e._id}>{e.title}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAssigning || isLoading}
                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                    {isAssigning ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Confirm Assignment
                      </>
                    )}
                  </button>
                </div>
              </form>

              {!selectedSponsor && sponsors.length > 0 && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Select a sponsor from the list or the dropdown to get started.
                  </p>
                </div>
              )}

              {selectedSponsor && selectedEvent && (
                <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 animate-in fade-in slide-in-from-top-4">
                  <p className="text-xs text-blue-700 font-bold mb-2">Assignment Summary:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-blue-500">Sponsor</span>
                      <span className="font-bold">{sponsors.find(s => s._id === selectedSponsor)?.name}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-blue-500">Event</span>
                      <span className="font-bold truncate max-w-[150px]">{events.find(e => e._id === selectedEvent)?.title}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
