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
  Mail, 
  Send, 
  Users, 
  History,
  CheckCircle2,
  Loader2,
  FileText,
  AtSign,
  PenTool,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    recipientGroup: 'all'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecipientChange = (value: string | null) => {
    setFormData(prev => ({ ...prev, recipientGroup: value ?? '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API: POST /api/newsletter/send
    setTimeout(() => {
      console.log('Sending newsletter:', formData);
      setIsLoading(false);
      toast.success('Newsletter sent successfully!', {
        description: `Email blast sent to ${formData.recipientGroup === 'all' ? 'all registered users' : 'specific event participants'}.`,
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      });
      setFormData({
        subject: '',
        content: '',
        recipientGroup: 'all'
      });
    }, 2500);
  };

  const mockHistory = [
    {
      id: '1',
      subject: 'Monthly Roundup - March 2026',
      content: 'Here are all the exciting events happening this month at our campus...',
      target: 'All Registered Students',
      date: '2026-03-01',
      openRate: '42%'
    },
    {
      id: '2',
      subject: 'Hackathon Preparation Guide',
      content: 'Hello participants! Here is everything you need to know before the hackathon starts...',
      target: 'Hack-The-Future Participants',
      date: '2026-03-20',
      openRate: '68%'
    }
  ];

  return (
    <CollegeLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Newsletter Management</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Send professional email blasts to your community.</p>
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button 
              onClick={() => setActiveTab('create')}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center gap-2 px-4 font-bold text-xs uppercase tracking-wider",
                activeTab === 'create' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <PenTool className="h-4 w-4" />
              Compose
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
              <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white max-w-4xl">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Compose Newsletter</CardTitle>
                      <CardDescription className="text-xs font-medium text-gray-500">Design and send your next email blast</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="recipientGroup" className="text-sm font-bold text-gray-700">Recipient Group</Label>
                        <Select onValueChange={handleRecipientChange} value={formData.recipientGroup}>
                          <SelectTrigger className="h-10 rounded-lg">
                            <SelectValue placeholder="Select recipients" />
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
                        <Label htmlFor="subject" className="text-sm font-bold text-gray-700">Email Subject</Label>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="subject"
                            name="subject"
                            placeholder="Enter subject line"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="pl-9 h-10 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-sm font-bold text-gray-700">Newsletter Content</Label>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-1">
                          <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-md"><FileText className="h-4 w-4" /></Button>
                        </div>
                        <Textarea 
                          id="content"
                          name="content"
                          placeholder="Write your newsletter content here..." 
                          className="min-h-[300px] border-none rounded-none resize-none focus-visible:ring-0 p-4"
                          value={formData.content}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-6 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-10 px-6 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all"
                    >
                      Save Draft
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
                          Send Newsletter
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
                      <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900">{item.subject}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
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
                        <p className="text-xs font-bold text-gray-400 uppercase">Open Rate</p>
                        <p className="text-lg font-bold text-emerald-600">{item.openRate}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs rounded-lg">View Report</Button>
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
