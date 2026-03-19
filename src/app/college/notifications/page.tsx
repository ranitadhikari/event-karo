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
  Bell, 
  Send, 
  Calendar, 
  Users, 
  History,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetEvent: 'all'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventChange = (value: string | null) => {
    setFormData(prev => ({ ...prev, targetEvent: value ?? '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API: POST /api/notification/send
    setTimeout(() => {
      console.log('Sending notification:', formData);
      setIsLoading(false);
      toast.success('Notification sent successfully!', {
        description: `Message sent to ${formData.targetEvent === 'all' ? 'all users' : 'event participants'}.`,
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      });
      setFormData({
        title: '',
        message: '',
        targetEvent: 'all'
      });
    }, 2000);
  };

  const mockHistory = [
    {
      id: '1',
      title: 'Workshop Postponed',
      message: 'The AI Workshop scheduled for tomorrow has been moved to next Friday.',
      target: 'AI Workshop Participants',
      date: '2026-03-15',
      sentTo: 75
    },
    {
      id: '2',
      title: 'New Event Launched!',
      message: 'Registration for Annual Tech Symposium 2026 is now open. Register early for early bird prizes!',
      target: 'All Students',
      date: '2026-03-10',
      sentTo: 1250
    }
  ];

  return (
    <CollegeLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Communicate directly with your event participants.</p>
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button 
              onClick={() => setActiveTab('create')}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center gap-2 px-4 font-bold text-xs uppercase tracking-wider",
                activeTab === 'create' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Send className="h-4 w-4" />
              Create
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center gap-2 px-4 font-bold text-xs uppercase tracking-wider",
                activeTab === 'history' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <History className="h-4 w-4" />
              History
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white max-w-3xl">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Send Notification</CardTitle>
                      <CardDescription className="text-xs font-medium text-gray-500">Reach out to your students instantly</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="targetEvent" className="text-sm font-bold text-gray-700">Target Audience</Label>
                      <Select onValueChange={handleEventChange} value={formData.targetEvent}>
                        <SelectTrigger className="h-10 rounded-lg">
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="all">All Registered Students</SelectItem>
                          <SelectItem value="hackathon">Hackathon Participants</SelectItem>
                          <SelectItem value="tech-symposium">Tech Symposium Participants</SelectItem>
                          <SelectItem value="workshop">AI Workshop Participants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-bold text-gray-700">Notification Title</Label>
                      <Input 
                        id="title"
                        name="title"
                        placeholder="e.g. Important Update: Venue Change" 
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="h-10 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-bold text-gray-700">Message Content</Label>
                      <Textarea 
                        id="message"
                        name="message"
                        placeholder="Type your message here..." 
                        className="min-h-[150px] rounded-lg resize-none"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-6 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-10 px-6 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all"
                    >
                      Clear
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="h-10 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Now
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {mockHistory.map((item) => (
                <Card key={item.id} className="border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white">
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <Users className="h-3.5 w-3.5" />
                            To: <span className="text-gray-600">{item.target}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            Sent: <span className="text-gray-600">{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <div className="text-right mr-4">
                        <p className="text-xs font-bold text-gray-400 uppercase">Recipients</p>
                        <p className="text-lg font-bold text-gray-900">{item.sentTo}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs rounded-lg">View Details</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CollegeLayout>
  );
}

// Utility function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
