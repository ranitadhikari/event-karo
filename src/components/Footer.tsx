import React from 'react';
import Link from 'next/link';
import { Calendar, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                EVENT<span className="text-primary">KARO</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              The ultimate destination for college event discovery. Experience the best of campus life with our cinematic event platform.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Explore</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/student/dashboard" className="hover:text-primary transition-colors">All Events</Link></li>
              <li><Link href="/colleges" className="hover:text-primary transition-colors">Colleges</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Trending</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Colleges</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/college/register" className="hover:text-primary transition-colors">Register College</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">College Login</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">Get the latest event updates straight to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary flex-grow"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} EventKaro. Crafted with passion for students.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
