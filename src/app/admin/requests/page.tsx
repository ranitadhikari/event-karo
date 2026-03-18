'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { ConfirmationModal } from '@/components/admin/ConfirmationModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { College } from '@/types';
import { Check, X, Clock, MapPin, Mail, Info } from 'lucide-react';
import axios from 'axios';

export default function CollegeRequestsPage() {
  const [requests, setRequests] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      // Simulate API call: GET /api/superadmin/pending
      // const response = await axios.get('/api/superadmin/pending');
      // setRequests(response.data);
      
      // Mock data
      setTimeout(() => {
        setRequests([
          {
            id: 'c4',
            name: 'Hansraj College',
            email: 'admin@hansraj.du.ac.in',
            city: 'North Campus',
            description: 'A constituent college of the University of Delhi.',
            status: 'PENDING',
          },
          {
            id: 'c5',
            name: 'Netaji Subhas University of Technology',
            email: 'registrar@nsut.ac.in',
            city: 'Dwarka',
            description: 'A state university located in Dwarka, New Delhi.',
            status: 'PENDING',
          },
          {
            id: 'c6',
            name: 'Miranda House',
            email: 'principal@mirandahouse.ac.in',
            city: 'North Campus',
            description: 'A constituent college for women at the University of Delhi.',
            status: 'PENDING',
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      toast.error('Failed to load pending requests');
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedCollege || !modalType) return;
    
    setIsActionLoading(true);
    try {
      const endpoint = modalType === 'approve' 
        ? `/api/superadmin/approve/${selectedCollege.id}`
        : `/api/superadmin/reject/${selectedCollege.id}`;
      
      // Simulate API call: PATCH endpoint
      // await axios.patch(endpoint);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      setRequests(prev => prev.filter(c => c.id !== selectedCollege.id));
      toast.success(
        modalType === 'approve' 
          ? `${selectedCollege.name} has been approved!` 
          : `${selectedCollege.name} has been rejected.`
      );
      closeModal();
    } catch (error) {
      toast.error(`Failed to ${modalType} college`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const openModal = (college: College, type: 'approve' | 'reject') => {
    setSelectedCollege(college);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedCollege(null);
    setModalType(null);
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
      header: 'Description', 
      accessorKey: 'description',
      cell: (item: College) => (
        <p className="text-xs text-muted-foreground max-w-xs truncate font-medium">
          {item.description}
        </p>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (item: College) => (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold px-2.5 py-0.5 rounded-lg">
          <Clock className="h-3 w-3 mr-1.5" />
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (item: College) => (
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-9 rounded-lg px-4 transition-all active:scale-95 shadow-sm shadow-emerald-500/20"
            onClick={() => openModal(item, 'approve')}
          >
            <Check className="h-4 w-4 mr-1.5" />
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive font-bold h-9 rounded-lg px-4 transition-all active:scale-95"
            onClick={() => openModal(item, 'reject')}
          >
            <X className="h-4 w-4 mr-1.5" />
            Reject
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
            <Info className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">College Requests</h1>
            <p className="text-[15px] font-medium text-muted-foreground mt-1.5">Review and manage pending college registration requests.</p>
          </div>
        </div>

        <AdminTable 
          columns={columns} 
          data={requests} 
          isLoading={isLoading}
          emptyMessage="No pending requests to review."
        />
      </div>

      <ConfirmationModal
        isOpen={modalType !== null}
        onClose={closeModal}
        onConfirm={handleAction}
        title={modalType === 'approve' ? 'Approve College?' : 'Reject Request?'}
        description={
          modalType === 'approve' 
            ? `Are you sure you want to approve ${selectedCollege?.name}? They will be able to create events immediately.`
            : `Are you sure you want to reject ${selectedCollege?.name}? This action cannot be undone.`
        }
        confirmText={modalType === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
        variant={modalType === 'approve' ? 'success' : 'danger'}
        isLoading={isActionLoading}
      />
    </AdminLayout>
  );
}
