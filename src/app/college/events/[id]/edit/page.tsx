'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function EditEventPage() {
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
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com'}/api/event/my`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const event = data.find((ev: any) => ev._id === eventId);
        if (event) {
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
        } else {
          toast.error("Event not found");
          router.push('/college/events');
        }
      }
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
      
      // Note: Only appending new posters. The backend logic will probably overwrite posters if `req.files.length > 0`
      formData.posters.forEach(file => {
        data.append('posters', file);
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com'}/api/event/${eventId}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update event');
      }

      toast.success('Event updated successfully!', {
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      });
      
      router.push('/college/events');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <CollegeLayout>
         <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
         </div>
      </CollegeLayout>
    );
  }

  return (
    <CollegeLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Event</h2>
          <p className="text-gray-500 font-medium mt-1 text-sm">Update the details of your event.</p>
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
                  <Edit3Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Update Selected Event</CardTitle>
                  <CardDescription className="text-xs font-medium text-gray-500">Modify the fields you wish to change</CardDescription>
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
                          multiple
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <div className="flex flex-col items-center justify-center text-center space-y-3">
                          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <PlusCircle className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {formData.posters.length > 0 
                                ? `${formData.posters.length} new file(s) selected` 
                                : `Upload new posters (current: ${formData.existingPosters.length})`}
                            </p>
                            <p className="text-xs text-gray-500 font-medium mt-1">Leave empty to keep existing images. PNG, JPG or WEBP (Max 5MB per file, max 10 files)</p>
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
                  onClick={() => router.push('/college/events')}
                  className="h-10 px-6 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all z-10 relative"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-10 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 z-10 relative"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update Event
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

// Ensure Edit3Icon is declared at module scope for it to be rendered correctly above.
function Edit3Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

