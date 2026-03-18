'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { College } from '@/types';
import { GraduationCap, MapPin, Mail, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function ListedCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setIsLoading(true);
      // Simulate API call: GET /api/college/all
      // const response = await axios.get('/api/college/all');
      // setColleges(response.data);
      // setFilteredColleges(response.data);
      
      // Mock data
      setTimeout(() => {
        const mockData: College[] = [
          {
            id: 'c1',
            name: 'IIT Delhi',
            email: 'admin@iitd.ac.in',
            city: 'New Delhi',
            description: 'Indian Institute of Technology Delhi is a public technical and research university.',
            status: 'APPROVED',
          },
          {
            id: 'c2',
            name: 'Delhi Technological University',
            email: 'info@dtu.ac.in',
            city: 'New Delhi',
            description: 'Formerly Delhi College of Engineering, it is a premier technical university.',
            status: 'APPROVED',
          },
          {
            id: 'c3',
            name: 'Netaji Subhas University of Technology',
            email: 'registrar@nsut.ac.in',
            city: 'Dwarka',
            description: 'A state university located in Dwarka, New Delhi.',
            status: 'APPROVED',
          },
        ];
        setColleges(mockData);
        setFilteredColleges(mockData);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      toast.error('Failed to load colleges');
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
    </AdminLayout>
  );
}
