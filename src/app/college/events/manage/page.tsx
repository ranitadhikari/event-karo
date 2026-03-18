'use client';

import React, { useState } from 'react';
import { CollegeLayout } from '@/components/college/CollegeLayout';
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
  Clock,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function EventManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    lastRegistrationDate: '',
    category: '',
    venue: '',
    city: '',
    poster: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, poster: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API: POST /api/event/create
    setTimeout(() => {
      console.log('Creating event:', formData);
      setIsLoading(false);
      toast.success('Event created successfully!', {
        description: 'Your event is now live and listed for students.',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      });
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        lastRegistrationDate: '',
        category: '',
        venue: '',
        city: '',
        poster: null
      });
    }, 2000);
  };

  return (
    <CollegeLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Event Management</h2>
          <p className="text-gray-500 font-medium mt-1 text-sm">Create and launch new events for your college.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Create New Event</CardTitle>
                  <CardDescription className="text-xs font-medium text-gray-500">Enter event details to get started</CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-5 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-bold text-gray-700">Event Title</Label>
                        <Input 
                          id="title"
                          name="title"
                          placeholder="e.g. Annual Tech Symposium 2026" 
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-bold text-gray-700">Category</Label>
                        <Select onValueChange={handleCategoryChange} value={formData.category}>
                          <SelectTrigger className="h-10 rounded-lg">
                            <SelectValue placeholder="Select event category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
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
                        <Label htmlFor="description" className="text-sm font-bold text-gray-700">Event Description</Label>
                        <Textarea 
                          id="description"
                          name="description"
                          placeholder="Describe your event in detail..." 
                          className="min-h-[120px] rounded-lg resize-none"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Date & Time
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-bold text-gray-700">Event Date</Label>
                        <Input 
                          id="date"
                          name="date"
                          type="datetime-local" 
                          value={formData.date}
                          onChange={handleChange}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastRegistrationDate" className="text-sm font-bold text-gray-700">Registration Deadline</Label>
                        <Input 
                          id="lastRegistrationDate"
                          name="lastRegistrationDate"
                          type="datetime-local" 
                          value={formData.lastRegistrationDate}
                          onChange={handleChange}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Venue */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Location & Venue
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="venue" className="text-sm font-bold text-gray-700">Venue Name</Label>
                        <Input 
                          id="venue"
                          name="venue"
                          placeholder="e.g. Main Auditorium" 
                          value={formData.venue}
                          onChange={handleChange}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-bold text-gray-700">City</Label>
                        <Input 
                          id="city"
                          name="city"
                          placeholder="e.g. Mumbai" 
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="space-y-5 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                      Media & Poster
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative group border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-blue-400 transition-colors bg-gray-50/50">
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <div className="flex flex-col items-center justify-center text-center space-y-3">
                          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <PlusCircle className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {formData.poster ? formData.poster.name : 'Click or drag to upload event poster'}
                            </p>
                            <p className="text-xs text-gray-500 font-medium mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-6 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-10 px-6 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-10 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Launch Event
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </CollegeLayout>
  );
}
