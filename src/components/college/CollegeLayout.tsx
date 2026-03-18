'use client';

import React, { useState } from 'react';
import { CollegeSidebar } from './CollegeSidebar';
import { CollegeNavbar } from './CollegeNavbar';
import { ProtectedRoute } from '../ProtectedRoute';

interface CollegeLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export const CollegeLayout: React.FC<CollegeLayoutProps> = ({ 
  children, 
  showSearch = false, 
  onSearchChange, 
  searchValue 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['COLLEGE_ADMIN']}>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* LEFT SIDE: FIXED SIDEBAR */}
        <CollegeSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* RIGHT SIDE: MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 h-screen lg:ml-64 transition-all duration-300">
          <CollegeNavbar 
            showSearch={showSearch} 
            onSearchChange={onSearchChange} 
            searchValue={searchValue} 
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};
