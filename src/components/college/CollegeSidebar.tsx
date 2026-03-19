'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  ListOrdered, 
  Users, 
  Bell, 
  Mail, 
  LogOut,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/college/dashboard', icon: LayoutDashboard },
  { label: 'Event Management', href: '/college/events/manage', icon: PlusCircle },
  { label: 'Listed Events', href: '/college/events', icon: Calendar },
  { label: 'User Management', href: '/college/users', icon: Users },
  { label: 'Notifications', href: '/college/notifications', icon: Bell },
  { label: 'Newsletter', href: '/college/newsletter', icon: Mail },
];

interface CollegeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeSidebar: React.FC<CollegeSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-50 flex flex-col z-[70] border-r border-slate-800 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Top Section: Logo & Branding */}
        <div className="flex items-center h-20 px-6 border-b border-slate-800/50">
          <Link href="/college/dashboard" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                EventKaro
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                College Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <div className="flex-grow py-6 px-4 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                )} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section: Logout */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={logout}
            className="flex items-center w-full space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
