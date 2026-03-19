'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { ConfirmationModal } from '@/components/admin/ConfirmationModal';
import { cn } from '@/utils/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { College } from '@/types';
import { GraduationCap, MapPin, Mail, CheckCircle2, Trash2, Calendar } from 'lucide-react';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';
import { getSuperAdminEvents } from '@/lib/api';

export default function ListedCollegesPage() {
  const { token } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  
  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchColleges();
      fetchEventCounts();
    }
  }, [token]);

  const fetchEventCounts = async () => {
    try {
      const events = await getSuperAdminEvents(token!);
      const counts: Record<string, number> = {};
      events.forEach(ev => {
        const collegeId = typeof ev.college === 'object' ? ev.college?._id : ev.college;
        if (collegeId) {
          counts[collegeId] = (counts[collegeId] || 0) + 1;
        }
      });
      setEventCounts(counts);
    } catch (err) {
      console.error('Failed to fetch event counts:', err);
    }
  };

  const fetchColleges = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com'}/api/superadmin/approved`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch');
      
      setColleges(data);
      setFilteredColleges(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load colleges');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = colleges.filter(college => 
      college.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredColleges(filtered);
  };

  const openDeleteModal = (college: College) => {
    setSelectedCollege(college);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCollege(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedCollege || !token) return;

    setIsDeleting(true);
    try {
      const collegeId = selectedCollege.id || (selectedCollege as any)._id;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com'}/api/superadmin/college/${collegeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete college');

      toast.success(data.message || 'College deleted successfully');
      
      // Update local state
      const updatedColleges = colleges.filter(c => (c.id || (c as any)._id) !== collegeId);
      setColleges(updatedColleges);
      setFilteredColleges(updatedColleges.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting college');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { 
      header: 'College Details', 
      accessorKey: 'name',
      cell: (item: College) => (
        <div className="flex flex-col space-y-1">
          <span className="font-bold text-foreground">{item.name}</span>
          <div className="flex items-center text-xs text-muted-foreground space-x-3">
            <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {item.email}</span>
            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {item.city}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (item: College) => (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-lg">
          <CheckCircle2 className="h-3 w-3 mr-1.5" />
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Events Hosted',
      accessorKey: 'id',
      cell: (item: College) => {
        const collegeId = item.id || (item as any)._id;
        const count = eventCounts[collegeId] || 0;
        return (
          <div className="flex items-center space-x-2">
            <div className={cn(
              "p-1.5 rounded-lg",
              count > 0 ? "bg-blue-500/10 text-blue-500" : "bg-slate-500/10 text-slate-400"
            )}>
              <Calendar className="h-4 w-4" />
            </div>
            <span className={cn(
              "font-bold text-sm",
              count > 0 ? "text-slate-900" : "text-slate-400"
            )}>
              {count} {count === 1 ? 'Event' : 'Events'}
            </span>
          </div>
        );
      }
    },
    { 
      header: 'Actions', 
      accessorKey: 'id',
      cell: (item: College) => (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all active:scale-95"
          onClick={() => openDeleteModal(item)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <AdminLayout 
      showSearch={true} 
      searchValue={searchQuery} 
      onSearchChange={handleSearch}
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">Listed Colleges</h1>
            <p className="text-[15px] font-medium text-muted-foreground mt-1.5">View and manage all approved colleges on the platform.</p>
          </div>
        </div>

        <AdminTable 
          columns={columns} 
          data={filteredColleges} 
          isLoading={isLoading}
          emptyMessage={searchQuery ? `No colleges found matching "${searchQuery}"` : "No colleges have been approved yet."}
        />
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete College?"
        description={`Are you sure you want to delete ${selectedCollege?.name}? This will permanently remove the college and all associated data.`}
        confirmText="Yes, Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}
