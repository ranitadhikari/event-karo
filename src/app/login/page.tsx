'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Backend returns: { message, token, role }
      // The token contains id, role, and collegeId. 
      // For simplicity, we can extract common info or just use what we have.
      // Ideally, the backend should return the user object. 
      // For now, let's construct a minimal User object to satisfy AuthContext.
      
      const user = {
        id: '', // We don't have the ID directly unless we decode the token
        email,
        name: email.split('@')[0], // Placeholder name
        role: data.role as any, // 'superadmin' | 'collegeadmin' | 'student'
      };

      login(data.token, user);
      toast.success(data.message || 'Login successful!');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="flex w-full max-w-5xl gap-8 flex-col md:flex-row items-center">
        <div className="flex-1 space-y-6 hidden md:block">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight">EventKaro</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Manage your college events <br />
            <span className="text-primary">with ease.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-md">
            The most powerful platform for college event discovery and management. Join thousands of students and admins across India.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border shadow-sm">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">01</div>
              <p className="text-sm font-medium text-slate-700">Centralized discovery for colleges nationwide</p>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border shadow-sm">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">02</div>
              <p className="text-sm font-medium text-slate-700">Easy event management for administrators</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[450px]">
          <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 pb-8 pt-10 text-center">
              <div className="md:hidden flex justify-center mb-6">
                <Link href="/" className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold tracking-tight">EventKaro</span>
                </Link>
              </div>
              <CardTitle className="text-3xl font-bold">Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10 h-12 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="password" 
                      type="password" 
                      className="pl-10 h-12 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Demo Credentials</p>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p><strong>Super Admin:</strong> admin@eventkaro.com / admin123</p>
                    <p><strong>College Admin:</strong> admin@dtu.ac.in / dtu123</p>
                    <p><strong>Student:</strong> student@gmail.com / student123</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pb-10 pt-4">
                <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
                </Button>
                <p className="text-sm text-center text-slate-600">
                  Don't have a college account?{' '}
                  <Link href="/college/register" className="text-primary font-bold hover:underline">Register College</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
