'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Type, 
  Info, 
  Save, 
  X, 
  Loader2,
  Sparkles,
  ArrowLeft,
  CalendarCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function CreateEvent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    lastRegistrationDate: '',
    type: 'Academic',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API: POST /api/event/create
    setTimeout(() => {
      console.log('Creating event:', formData);
      setIsLoading(false);
      toast.success('Event created successfully!');
      router.push('/college/events');
    }, 2000);
  };

  return (
    <DashboardLayout allowedRoles={['COLLEGE_ADMIN']}>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Event</h1>
            <p className="text-slate-500 font-medium mt-1">Publish a new event to attract students from all colleges.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Event Details
                </CardTitle>
                <CardDescription>Fill in the basic information about your upcoming event.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-700 font-bold">Event Title</Label>
                    <div className="relative group">
                      <Type className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="title" 
                        name="title" 
                        placeholder="e.g. CodeFest 2026 Hackathon" 
                        className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                        value={formData.title}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-slate-700 font-bold">Event Type</Label>
                      <Select value={formData.type} onValueChange={handleTypeChange}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Hackathon">Hackathon</SelectItem>
                          <SelectItem value="Cultural">Cultural</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Competition">Competition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate" className="text-slate-700 font-bold">Event Date</Label>
                      <div className="relative group">
                        <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                          id="eventDate" 
                          name="eventDate" 
                          type="date" 
                          className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                          value={formData.eventDate}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="lastRegistrationDate" className="text-slate-700 font-bold">Registration Deadline</Label>
                      <div className="relative group">
                        <CalendarCheck className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                          id="lastRegistrationDate" 
                          name="lastRegistrationDate" 
                          type="date" 
                          className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                          value={formData.lastRegistrationDate}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Registration Fee (Optional)</Label>
                      <Input 
                        placeholder="Free or Amount" 
                        className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700 font-bold">Event Description</Label>
                    <div className="relative group">
                      <Info className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <textarea 
                        id="description" 
                        name="description" 
                        rows={6}
                        placeholder="Provide all necessary details about the event, rules, prizes, and eligibility..."
                        className="w-full pl-10 pt-3 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm outline-none"
                        value={formData.description}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 py-6 px-8 flex justify-end gap-4">
                  <Button type="button" variant="ghost" className="h-12 px-6 rounded-xl font-bold" onClick={() => router.back()}>
                    <X className="mr-2 h-5 w-5" />
                    Cancel
                  </Button>
                  <Button type="submit" className="h-12 px-10 rounded-xl font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Publish Event
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white p-8">
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Live Preview
              </h4>
              <div className="pointer-events-none opacity-80 border rounded-2xl p-1 overflow-hidden">
                <div className="bg-white border-b p-4 space-y-2">
                   <div className="flex justify-between items-start">
                    <div className="h-4 w-16 bg-primary/10 rounded-full"></div>
                    <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
                  <div className="h-4 w-1/2 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-3 w-full bg-slate-50 rounded-full"></div>
                  <div className="h-3 w-full bg-slate-50 rounded-full"></div>
                  <div className="h-3 w-2/3 bg-slate-50 rounded-full"></div>
                  <div className="flex gap-4 pt-2">
                    <div className="h-3 w-16 bg-slate-100 rounded-full"></div>
                    <div className="h-3 w-16 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 border-t flex gap-2">
                   <div className="h-8 flex-1 bg-slate-200 rounded-lg"></div>
                   <div className="h-8 flex-1 bg-slate-300 rounded-lg"></div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 font-medium text-center italic">
                This is a preview of how students will see your event card.
              </p>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-slate-900 text-white p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h4 className="text-xl font-bold mb-4">Guidelines</h4>
              <ul className="space-y-4">
                {[
                  'Use a clear and catchy event title.',
                  'Provide detailed registration steps.',
                  'Mention specific eligibility criteria.',
                  'Upload a poster if available (coming soon).'
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <div className="mt-1 h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                      {i + 1}
                    </div>
                    {rule}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
