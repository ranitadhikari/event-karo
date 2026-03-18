'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Lock, Building2, MapPin, TextQuote, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function CollegeRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    state: '',
    country: 'India',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call: POST /api/college/register
    setTimeout(() => {
      console.log('Registering college:', formData);
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Registration request submitted successfully!');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-2xl border-none rounded-3xl overflow-hidden p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold mb-4">Request Submitted!</CardTitle>
            <CardDescription className="text-lg leading-relaxed">
              Your college registration request for <span className="font-bold text-slate-900">{formData.name}</span> has been received.
            </CardDescription>
            <div className="my-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-3">
              <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Waiting for Super Admin approval.
              </p>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                You will receive an email once approved.
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full h-14 rounded-2xl text-md font-bold shadow-lg shadow-primary/20">
                Go to Login Page
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-8 pt-4 hidden md:block">
          <Link href="/" className="inline-flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors mb-4 group font-medium">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <div className="space-y-4">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-6">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Join the EventKaro <br />
              <span className="text-primary">College Network</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
              Register your college today to start publishing and managing events. Reach thousands of students across Delhi.
            </p>
          </div>
          <div className="space-y-6 pt-4">
            {[
              { title: 'Centralized Dashboard', desc: 'Manage all your college events in one easy-to-use interface.' },
              { title: 'Student Engagement', desc: 'Directly reach interested students and track registrations.' },
              { title: 'College Identity', desc: 'Showcase your college profile, logo, and achievements.' }
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="mt-1 h-6 w-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden p-2">
          <CardHeader className="space-y-2 pb-8 pt-10 text-center md:text-left md:px-8">
            <CardTitle className="text-3xl font-bold">College Registration</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Fill in the details to request admin access.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 md:px-8">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-semibold">College Name</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="e.g. Delhi Technological University" 
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold">Admin Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="admin@college.edu" 
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-700 font-semibold">City</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="city" 
                        name="city"
                        placeholder="e.g. New Delhi" 
                        className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                        value={formData.city}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-700 font-semibold">State (Optional)</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="state" 
                        name="state"
                        placeholder="e.g. Delhi" 
                        className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700 font-semibold">Description</Label>
                  <div className="relative group">
                    <TextQuote className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <textarea 
                      id="description" 
                      name="description"
                      placeholder="Briefly describe your college..." 
                      rows={3}
                      className="w-full pl-10 pt-3 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm outline-none"
                      value={formData.description}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-10 pt-6 md:px-8">
              <Button type="submit" className="w-full h-14 rounded-2xl text-md font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Register College'}
              </Button>
              <p className="text-sm text-center text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
