'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  PlusCircle, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  Tag, 
  Save,
  Loader2,
  CheckCircle2,
  Edit3,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getManagedEventById, updateEvent } from '@/lib/api';

export default function SuperAdminEditEventPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    lastRegistrationDate: '',
    category: '',
    venue: '',
    city: '',
    posters: [] as File[],
    existingPosters: [] as string[]
  });

  useEffect(() => {
    if (eventId && token) {
      fetchEventDetails();
    }
  }, [eventId, token]);

  const fetchEventDetails = async () => {
    try {
      const event = await getManagedEventById(eventId, token!);
      
      // Format dates to datetime-local expected format (YYYY-MM-DDThh:mm)
      const formatDateToInput = (dateStr: string) => {
         if (!dateStr) return '';
         const d = new Date(dateStr);
         return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      };

      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.eventDate ? formatDateToInput(event.eventDate) : '',
        lastRegistrationDate: event.lastDate ? formatDateToInput(event.lastDate) : '',
        category: event.category || '',
        venue: event.venue || '',
        city: event.city || '',
        posters: [],
        existingPosters: event.posters || []
      });
    } catch (err) {
      toast.error('Failed to load event details');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string | null) => {
    setFormData(prev => ({ ...prev, category: value ?? '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, posters: Array.from(e.target.files as FileList) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('eventDate', formData.date); 
      data.append('lastDate', formData.lastRegistrationDate);
      data.append('category', formData.category);
      data.append('venue', formData.venue);
      data.append('city', formData.city);
      
      formData.posters.forEach(file => {
        data.append('posters', file);
      });

      await updateEvent(eventId, data, token!);

      toast.success('Event updated successfully!', {
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      });
      
      router.push('/admin/events');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AdminLayout>
         <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
         </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Event (SuperAdmin)</h2>
            <p className="text-slate-500 font-medium mt-1 text-sm">You are editing an event globally as a SuperAdmin.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/events')}
            className="rounded-xl border-slate-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-slate-900 leading-tight">General Event Properties</CardTitle>
                  <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global override for event data</CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6 md:col-span-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Event Title</Label>
                        <Input 
                          id="title"
                          name="title"
                          placeholder="e.g. Annual Tech Symposium 2026" 
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</Label>
                        <Select onValueChange={handleCategoryChange} value={formData.category}>
                          <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50">
                            <SelectValue placeholder="Select event category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="cultural">Cultural</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Event Description</Label>
                        <Textarea 
                          id="description"
                          name="description"
                          placeholder="Describe the event globally..." 
                          className="min-h-[150px] rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all resize-none p-4"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Schedule
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Event Date</Label>
                        <Input 
                          id="date"
                          name="date"
                          type="datetime-local" 
                          value={formData.date}
                          onChange={handleChange}
                          required
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastRegistrationDate" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registration Deadline</Label>
                        <Input 
                          id="lastRegistrationDate"
                          name="lastRegistrationDate"
                          type="datetime-local" 
                          value={formData.lastRegistrationDate}
                          onChange={handleChange}
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      Venue Details
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="venue" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Venue Name</Label>
                        <Input 
                          id="venue"
                          name="venue"
                          placeholder="e.g. Main Auditorium" 
                          value={formData.venue}
                          onChange={handleChange}
                          required
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-xs font-bold text-slate-700 uppercase tracking-wider">City</Label>
                        <Input 
                          id="city"
                          name="city"
                          placeholder="e.g. Mumbai" 
                          value={formData.city}
                          onChange={handleChange}
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Posters */}
                  <div className="md:col-span-2 pt-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Posters & Media
                    </h3>
                    <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl p-10 hover:border-blue-400 transition-all bg-slate-50/30">
                      <input 
                        type="file" 
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-sm border border-slate-100">
                          <PlusCircle className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">
                            {formData.posters.length > 0 
                              ? `${formData.posters.length} new file(s) selected` 
                              : `Upload new posters (currently ${formData.existingPosters.length})`}
                          </p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">PNG, JPG or WEBP (Leave empty to keep current)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-8 flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => router.push('/admin/events')}
                  className="h-12 px-8 rounded-xl font-bold text-slate-500 hover:text-slate-900 transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-12 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-200 transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Global Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
