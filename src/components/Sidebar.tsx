'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle, 
  GraduationCap, 
  UserCircle 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getSidebarItems = (): SidebarItem[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'SUPER_ADMIN':
        return [
          { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Colleges', href: '/admin/colleges', icon: GraduationCap },
          { label: 'Settings', href: '/admin/settings', icon: Settings },
        ];
      case 'COLLEGE_ADMIN':
        return [
          { label: 'Dashboard', href: '/college/dashboard', icon: LayoutDashboard },
          { label: 'Events', href: '/college/events', icon: Calendar },
          { label: 'Create Event', href: '/college/events/new', icon: PlusCircle },
          { label: 'Settings', href: '/college/settings', icon: Settings },
        ];
      case 'STUDENT':
        return [
          { label: 'Browse Events', href: '/student/dashboard', icon: Calendar },
          { label: 'My Registered Events', href: '/student/my-events', icon: LayoutDashboard },
          { label: 'Profile', href: '/student/profile', icon: UserCircle },
        ];
      default:
        return [];
    }
  };

  const items = getSidebarItems();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col z-50">
      <div className="flex items-center justify-center h-20 border-b border-slate-800">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            EVENT<span className="text-primary">KARO</span>
          </span>
        </Link>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                pathname === item.href
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-all duration-200",
                pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-white"
              )} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-slate-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
