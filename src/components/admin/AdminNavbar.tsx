'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminNavbarProps {
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  onOpenSidebar?: () => void;
}

const routeTitles: Record<string, string> = {
  '/admin/dashboard': 'Overview',
  '/admin/requests': 'College Requests',
  '/admin/colleges': 'Listed Colleges',
};

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ 
  showSearch = false, 
  onSearchChange, 
  searchValue,
  onOpenSidebar
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const title = routeTitles[pathname] || 'Admin Panel';

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-background/80 backdrop-blur-md border-b border-border shadow-sm flex items-center justify-between px-4 lg:px-8">
      {/* Page Title & Hamburger */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-muted-foreground hover:text-primary transition-colors"
          onClick={onOpenSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-foreground tracking-tight leading-none">
            {title}
          </h1>
          <p className="text-xs font-medium text-muted-foreground mt-1.5 uppercase tracking-wider">
            Super Admin Panel
          </p>
        </div>
      </div>

      {/* Right Section: Search & Profile */}
      <div className="flex items-center space-x-3 lg:space-x-6">
        {showSearch && (
          <div className="relative w-48 lg:w-72 group hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 h-10 bg-muted border-transparent rounded-xl focus-visible:ring-primary focus-visible:bg-background transition-all"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}

        {/* Profile Avatar */}
        <div className="flex items-center space-x-3 pl-3 lg:pl-6 border-l border-border">
          <div className="flex flex-col items-end mr-1 hidden sm:flex">
            <span className="text-sm font-semibold text-foreground leading-none">
              {user?.name || 'Admin'}
            </span>
            <span className="text-[10px] font-medium text-primary mt-1 bg-primary/10 px-1.5 py-0.5 rounded uppercase">
              Super Admin
            </span>
          </div>
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-1 ring-border transition-transform hover:scale-105 duration-300">
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
