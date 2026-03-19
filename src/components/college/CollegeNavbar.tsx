'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  Search, 
  Bell, 
  LogOut,
  UserCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

interface CollegeNavbarProps {
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  onOpenSidebar: () => void;
}

export const CollegeNavbar: React.FC<CollegeNavbarProps> = ({ 
  showSearch = false, 
  onSearchChange, 
  searchValue,
  onOpenSidebar
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Get dynamic page title from pathname
  const getPageTitle = (path: string) => {
    if (path === '/college/dashboard') return 'Dashboard';
    if (path === '/college/events/manage') return 'Event Management';
    if (path === '/college/events') return 'Listed Events';
    if (path === '/college/users') return 'User Management';
    if (path === '/college/notifications') return 'Notifications';
    if (path === '/college/newsletter') return 'Newsletter Management';
    return 'College Panel';
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-white border-b border-gray-200 px-4 md:px-8">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* Left Section: Mobile Menu & Title */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden text-gray-600 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Right Section: Search & Profile */}
        <div className="flex items-center space-x-3 md:space-x-6">
          {showSearch && (
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 border border-gray-200">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || 'CA'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 rounded-xl shadow-xl border-slate-200" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-slate-900">{user?.name}</p>
                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem className="py-2.5 cursor-pointer rounded-lg">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem 
                  onClick={logout}
                  className="py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
