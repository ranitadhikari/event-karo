'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { createSponsor, CreateSponsorData } from '@/lib/sponsorApi';
import { 
  Building2, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Award,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CreateSponsorPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateSponsorData>({
    name: '',
    logo: '',
    website: '',
    tier: 'silver',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    if (!formData.name) {
      toast.error('Sponsor name is required');
      return;
    }

    setIsSubmitting(true);
    console.log('CreateSponsorPage: Submitting formData:', formData);
    try {
      const result = await createSponsor(token, formData);
      console.log('CreateSponsorPage: Success!', result);
      toast.success('Sponsor created successfully!');
      router.push('/superadmin/sponsors');
    } catch (err: any) {
      console.error('CreateSponsorPage: Error', err);
      toast.error(err.message || 'Failed to create sponsor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard" 
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Add New Sponsor</h1>
              <p className="text-muted-foreground">Register a new partner or sponsor on the platform</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Sponsor Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Google Cloud"
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Tier */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Sponsorship Tier
                    </label>
                    <select
                      name="tier"
                      value={formData.tier}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-card"
                    >
                      <option value="title">Title Sponsor</option>
                      <option value="gold">Gold Sponsor</option>
                      <option value="silver">Silver Sponsor</option>
                      <option value="bronze">Bronze Sponsor</option>
                    </select>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-primary" />
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>

                  {/* Logo URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Logo URL
                    </label>
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="https://link-to-logo.png"
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Sponsor'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-6">
              <h3 className="font-bold mb-4">Live Preview</h3>
              <div className="border border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                {formData.logo ? (
                  <img src={formData.logo} alt="Sponsor Preview" className="h-20 w-auto object-contain" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-slate-300" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-lg">{formData.name || 'Sponsor Name'}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{formData.tier} Sponsor</p>
                </div>
                {formData.website && (
                  <div className="text-xs text-blue-500 font-medium truncate max-w-full">
                    {formData.website}
                  </div>
                )}
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  formData.tier === 'title' ? 'bg-purple-100 text-purple-600' :
                  formData.tier === 'gold' ? 'bg-amber-100 text-amber-600' :
                  formData.tier === 'silver' ? 'bg-slate-100 text-slate-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {formData.tier}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-4 text-center">
                This is how the sponsor will appear on the homepage carousel and event pages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
