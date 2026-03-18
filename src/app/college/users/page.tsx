'use client';

import React, { useState } from 'react';
import { CollegeLayout } from '@/components/college/CollegeLayout';
import { CollegeTable } from '@/components/college/CollegeTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Download, 
  Mail, 
  User, 
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'Aaryan Sharma',
    email: 'aaryan@gmail.com',
    eventName: 'Annual Tech Symposium 2026',
    registrationDate: '2026-03-15',
    status: 'Confirmed'
  },
  {
    id: '2',
    name: 'Ishita Gupta',
    email: 'ishita.g@yahoo.com',
    eventName: 'Hack-The-Future Hackathon',
    registrationDate: '2026-03-16',
    status: 'Pending'
  },
  {
    id: '3',
    name: 'Rahul Verma',
    email: 'rahul.v@outlook.com',
    eventName: 'Annual Tech Symposium 2026',
    registrationDate: '2026-03-14',
    status: 'Confirmed'
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    eventName: 'AI Workshop: Generative AI',
    registrationDate: '2026-03-18',
    status: 'Confirmed'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.s@dtu.ac.in',
    eventName: 'Inter-College Sports Meet',
    registrationDate: '2026-03-17',
    status: 'Confirmed'
  }
];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('All Events');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = eventFilter === 'All Events' || user.eventName === eventFilter;
    return matchesSearch && matchesEvent;
  });

  const columns = [
    {
      header: 'User',
      accessor: (user: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-bold text-sm">{user.name}</span>
            <span className="text-[11px] text-gray-500 font-medium">{user.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Registered Event',
      accessor: (user: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">{user.eventName}</span>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: (user: any) => (
        <span className="text-sm font-medium text-gray-500">{user.registrationDate}</span>
      )
    },
    {
      header: 'Status',
      accessor: (user: any) => (
        <Badge className={cn(
          "px-2.5 py-0.5 rounded-full border shadow-none text-[10px] font-bold uppercase tracking-wider",
          user.status === 'Confirmed' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          {user.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100">
            <User className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right"
    }
  ];

  return (
    <CollegeLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Manage all students registered for your college events.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 px-4 rounded-lg border-gray-200 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email All
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10 h-11 rounded-xl border-gray-200 bg-white focus:bg-white transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-4 rounded-xl border-gray-200 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 min-w-[180px] justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {eventFilter}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-xl border-gray-200">
                <DropdownMenuItem onClick={() => setEventFilter('All Events')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">All Events</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventFilter('Annual Tech Symposium 2026')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">Annual Tech Symposium 2026</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventFilter('Hack-The-Future Hackathon')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">Hack-The-Future Hackathon</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventFilter('AI Workshop: Generative AI')} className="font-bold text-xs uppercase tracking-wider py-2.5 cursor-pointer">AI Workshop: Generative AI</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Users Table */}
        <CollegeTable 
          columns={columns} 
          data={filteredUsers} 
          onRowClick={(user) => console.log('User clicked:', user.id)}
        />
      </div>
    </CollegeLayout>
  );
}

// Utility function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
