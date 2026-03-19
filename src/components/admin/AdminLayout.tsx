'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { ProtectedRoute } from '../ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  showSearch = false, 
  onSearchChange, 
  searchValue 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['superadmin']}>
      <div className="flex min-h-screen bg-slate-50/50 overflow-hidden">
        {/* LEFT SIDE: FIXED SIDEBAR */}
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* RIGHT SIDE: MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 h-screen lg:ml-64 transition-all duration-300">
          <AdminNavbar 
            showSearch={showSearch} 
            onSearchChange={onSearchChange} 
            searchValue={searchValue} 
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};
