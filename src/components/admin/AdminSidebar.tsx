'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/lib/utils';
import { 
  LayoutDashboard, 
  GraduationCap, 
  ClipboardList, 
  LogOut, 
  Calendar 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'College Requests', href: '/admin/requests', icon: ClipboardList },
  { label: 'Listed Colleges', href: '/admin/colleges', icon: GraduationCap },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
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
        "fixed left-0 top-0 h-screen w-64 bg-card text-card-foreground flex flex-col z-[70] border-r border-border transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Top Section: Logo & Branding */}
        <div className="flex items-center h-20 px-6 border-b border-border/50">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground leading-none">
                EventKaro
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                Super Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <div className="flex-grow py-6 px-4 space-y-1.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-r-full" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                )} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Section: Logout */}
        <div className="p-4 border-t border-border/50">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
          >
            <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-destructive" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
