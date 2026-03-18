'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  Info, 
  Upload, 
  Save, 
  Loader2,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

export default function CollegeDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Delhi Technological University',
    email: 'admin@dtu.ac.in',
    website: 'https://www.dtu.ac.in',
    address: 'Shahbad Daulatpur, Main Bawana Road, Delhi, 110042',
    phone: '011-27871018',
    about: 'Delhi Technological University (DTU), formerly known as Delhi College of Engineering (DCE), is a premier government university located in New Delhi, India. Established in 1941, it is one of the oldest and most prestigious engineering colleges in the country.',
    logo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API: PATCH /api/college/profile
    setTimeout(() => {
      console.log('Updating profile:', profile);
      setIsLoading(false);
      toast.success('College profile updated successfully!');
    }, 1500);
  };

  return (
    <DashboardLayout allowedRoles={['COLLEGE_ADMIN']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">College Profile</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your college's public profile and contact information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Edit College Information
                </CardTitle>
                <CardDescription>This information will be visible to students and other admins.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 font-bold">College Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={profile.name} 
                        onChange={handleChange} 
                        className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-bold">Admin Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={profile.email} 
                        readOnly 
                        className="h-12 rounded-xl bg-slate-100/50 border-slate-200 text-slate-500 cursor-not-allowed font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-slate-700 font-bold">Website URL</Label>
                      <div className="relative group">
                        <Globe className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                          id="website" 
                          name="website" 
                          value={profile.website} 
                          onChange={handleChange} 
                          className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                          placeholder="https://www.college.edu"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700 font-bold">Phone Number</Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={profile.phone} 
                          onChange={handleChange} 
                          className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                          placeholder="011-23456789"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-700 font-bold">Address</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="address" 
                        name="address" 
                        value={profile.address} 
                        onChange={handleChange} 
                        className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all"
                        placeholder="Complete campus address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about" className="text-slate-700 font-bold">About College</Label>
                    <div className="relative group">
                      <Info className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <textarea 
                        id="about" 
                        name="about" 
                        value={profile.about} 
                        onChange={handleChange} 
                        rows={6}
                        className="w-full pl-10 pt-3 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm outline-none"
                        placeholder="Write something about your college's history, achievements, and culture..."
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 py-6 px-8 flex justify-end">
                  <Button type="submit" className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Right Column: Preview & Logo */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-8 text-center bg-white">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer mb-6 relative overflow-hidden">
                  {profile.logo ? (
                    <img src={profile.logo} alt="Logo" className="h-full w-full object-contain p-4" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Upload Logo</span>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{profile.name}</h3>
                <p className="text-sm text-slate-500 font-medium mb-6">DTU, Delhi</p>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <Link href={`/college/c1`} target="_blank">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-all">
                    View Public Profile
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary text-white p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <GraduationCap className="h-10 w-10 mb-4 opacity-50" />
              <h4 className="text-xl font-bold mb-2">Pro Tip!</h4>
              <p className="text-primary-foreground/90 text-sm leading-relaxed font-medium">
                Keep your profile updated to help students find and trust your college. A complete profile increases event participation by 40%.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
