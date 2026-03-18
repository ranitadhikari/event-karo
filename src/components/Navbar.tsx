'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, User, LogOut, LayoutDashboard, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore Events', href: '/events' },
    { label: 'Colleges', href: '/colleges' },
  ];

  const getDashboardHref = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'SUPER_ADMIN': return '/admin/dashboard';
      case 'COLLEGE_ADMIN': return '/college/dashboard';
      case 'STUDENT': return '/student/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            EVENT<span className="text-primary">KARO</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6 mr-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="h-8 w-[1px] bg-white/10 mx-2" />

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href={getDashboardHref()}>
                  <Button variant="ghost" className="text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px] h-9">
                    Dashboard
                  </Button>
                </Link>
                <div className="relative group">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 p-[2px] cursor-pointer">
                    <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  {/* Simple Dropdown placeholder */}
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]">
                    Login
                  </Button>
                </Link>
                <Link href="/college/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] px-6">
                    Join as College
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          <button className="p-2 text-slate-400">
            <Search className="h-5 w-5" />
          </button>
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 border-t border-white/10 p-6 space-y-6 bg-slate-950/95 backdrop-blur-2xl shadow-2xl"
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="block text-lg font-bold text-slate-300 hover:text-primary transition-colors uppercase tracking-widest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/10 space-y-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    href={getDashboardHref()} 
                    className="flex items-center space-x-3 text-slate-300 font-bold uppercase tracking-widest text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-red-400 font-bold uppercase tracking-widest text-sm"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]">
                      Login
                    </Button>
                  </Link>
                  <Link href="/college/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px]">
                      Join
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
