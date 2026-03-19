'use client';

import React, { use, useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  X,
  Phone,
  Mail,
  User,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventById, submitEnquiry, PublicEvent } from '@/lib/api';
import { getEventSponsors } from '@/lib/sponsorApi';
import { Sponsor } from '@/types';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSponsorsLoading, setIsSponsorsLoading] = useState(true);
  const [error, setError] = useState('');

  // Enquiry modal state
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getEventById(resolvedParams.id)
      .then(ev => {
        if (!ev) setError('Event not found');
        else setEvent(ev);
      })
      .catch(() => setError('Failed to load event'))
      .finally(() => setIsLoading(false));

    // Fetch sponsors
    getEventSponsors(resolvedParams.id)
      .then(setSponsors)
      .catch(() => console.error('Failed to load sponsors'))
      .finally(() => setIsSponsorsLoading(false));
  }, [resolvedParams.id]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }

    if (!event) return;
    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message || undefined,
        eventId: event._id,
      });
      setSubmitted(true);
      toast.success('Enquiry submitted! Check your email for confirmation.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
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
            <div className="mb-8">
              <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center md:items-end">
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

              <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex-grow space-y-6 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {event.category && (
                    <Badge className="bg-primary border-primary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">{event.category}</Badge>
                  )}
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-300 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                    🟢 Registration Open
                  </Badge>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">{event.title}</h1>
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

              {/* Left */}
              <div className="lg:col-span-8 space-y-12">

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

                {/* Sponsors Section */}
                <div className="space-y-6 pt-12 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Powered By Sponsors</h3>
                  </div>
                  <div className="h-1.5 w-24 bg-primary rounded-full mb-8" />
                  
                  {isSponsorsLoading ? (
                    <div className="flex items-center gap-3 text-slate-500 font-medium italic">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading partners...
                    </div>
                  ) : sponsors.length === 0 ? (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center">
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Sponsors Yet</p>
                      <p className="text-slate-600 text-xs mt-2">Check back later for event partners</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {sponsors.map((sponsor) => (
                        <div key={sponsor._id} className="group relative bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white hover:border-white transition-all duration-500 text-center">
                          <div className="h-16 w-full mb-4 flex items-center justify-center">
                            {sponsor.logo ? (
                              <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <Building2 className="h-8 w-8 text-slate-500" />
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-white group-hover:text-slate-900 transition-colors truncate px-2">{sponsor.name}</h4>
                          <div className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            sponsor.tier === 'title' ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-100 group-hover:text-purple-600' :
                            sponsor.tier === 'gold' ? 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-100 group-hover:text-amber-600' :
                            sponsor.tier === 'silver' ? 'bg-slate-500/20 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600' :
                            'bg-orange-500/20 text-orange-400 group-hover:bg-orange-100 group-hover:text-orange-600'
                          }`}>
                            {sponsor.tier}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Action card */}
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

                      <Button
                        size="lg"
                        onClick={() => setShowModal(true)}
                        className="w-full bg-primary hover:bg-primary/90 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] text-white font-black uppercase tracking-widest h-20 rounded-[28px] text-xl group"
                      >
                        Register Now
                        <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform ml-2" />
                      </Button>

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

      {/* ── Enquiry Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!submitted) setShowModal(false); }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* Close */}
              {!submitted && (
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-5 right-5 h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Top accent */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-cyan-400" />

              <div className="p-8">
                {submitted ? (
                  /* Success state */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-6"
                  >
                    <div className="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Enquiry Submitted!</h3>
                      <p className="text-slate-400 mt-2 leading-relaxed">
                        Thank you <span className="text-white font-bold">{form.name}</span>! We've sent a confirmation to <span className="text-primary font-bold">{form.email}</span>. The college admin will contact you shortly.
                      </p>
                    </div>
                    <Button
                      onClick={() => { setShowModal(false); setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                      className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest h-12 px-8 rounded-xl"
                    >
                      Close
                    </Button>
                  </motion.div>
                ) : (
                  /* Form */
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Register for Event</h2>
                      <p className="text-slate-400 mt-1 text-sm leading-relaxed">
                        Fill in your details to register for <span className="text-white font-bold">{event.title}</span>.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Full Name <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            placeholder="Your full name"
                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary/50 focus:border-primary"
                          />
                        </div>
                        {formErrors.name && <p className="text-red-400 text-xs font-medium">{formErrors.name}</p>}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Email Address <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            type="email"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                            placeholder="your@email.com"
                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary/50 focus:border-primary"
                          />
                        </div>
                        {formErrors.email && <p className="text-red-400 text-xs font-medium">{formErrors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number <span className="text-slate-600">(Optional)</span></Label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            type="tel"
                            value={form.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary/50 focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message <span className="text-slate-600">(Optional)</span></Label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                          <Textarea
                            value={form.message}
                            onChange={e => handleChange('message', e.target.value)}
                            placeholder="Any questions or special requirements..."
                            rows={3}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary/50 focus:border-primary resize-none"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 rounded-2xl text-base shadow-[0_10px_30px_-5px_rgba(59,130,246,0.4)] group"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>Submit Enquiry <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-1" /></>
                        )}
                      </Button>

                      <p className="text-center text-xs text-slate-500">
                        A confirmation email will be sent to both you and the college admin.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
