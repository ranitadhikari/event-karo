'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Calendar, 
  Search, 
  GraduationCap, 
  MapPin, 
  Clock, 
  Ticket, 
  CheckCircle2, 
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Registration, Event } from '@/types';
import { formatDate } from '@/utils/formatDate';

// Mock registered events
const MOCK_REGISTERED_EVENTS: Registration[] = [
  {
    id: 'r1',
    eventId: '1',
    studentId: 's1',
    registrationDate: '2026-03-15',
    event: {
      id: '1',
      title: 'CodeFest 2026',
      description: 'A 24-hour hackathon to build innovative solutions for urban problems in Delhi.',
      eventDate: '2026-04-15',
      lastRegistrationDate: '2026-04-10',
      collegeId: 'c1',
      collegeName: 'DTU, Delhi',
      type: 'Hackathon'
    }
  },
  {
    id: 'r2',
    eventId: '3',
    studentId: 's1',
    registrationDate: '2026-03-10',
    event: {
      id: '3',
      title: 'Marketing Summit',
      description: 'Learn from industry experts about the latest trends in digital marketing and branding.',
      eventDate: '2026-04-25',
      lastRegistrationDate: '2026-04-20',
      collegeId: 'c3',
      collegeName: 'SRCC, DU',
      type: 'Academic'
    }
  }
];

export default function MyRegisteredEvents() {
  const [registrations, setRegistrations] = useState<Registration[]>(MOCK_REGISTERED_EVENTS);

  return (
    <DashboardLayout allowedRoles={['STUDENT']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Ticket className="h-8 w-8 text-primary" />
            My Registrations
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track all the events you've registered for and manage your schedule.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrations.length > 0 ? (
            registrations.map((reg) => (
              <Card key={reg.id} className="shadow-sm border-none rounded-3xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 pt-6 px-6 bg-slate-50/50 border-b border-slate-100 relative">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[10px] uppercase tracking-widest px-2.5 py-1">
                      {reg.event?.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-widest">
                      <CheckCircle2 className="h-3 w-3" />
                      Confirmed
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{reg.event?.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {reg.event?.collegeName}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Event Date</p>
                        <p>{formatDate(reg.event?.eventDate || '')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Location</p>
                        <p>Main Auditorium, {reg.event?.collegeName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registered on</p>
                      <p className="text-xs font-bold text-slate-500">{formatDate(reg.registrationDate)}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 bg-slate-50/50 flex gap-2">
                  <Link href={`/event/${reg.eventId}`} className="flex-1">
                    <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-bold border-slate-200 hover:bg-white hover:shadow-sm transition-all uppercase tracking-wider">
                      View Event
                    </Button>
                  </Link>
                  <Button className="flex-1 h-10 rounded-xl text-xs font-bold shadow-md shadow-primary/10 uppercase tracking-wider">
                    Ticket ID: {reg.id.toUpperCase()}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 bg-white rounded-3xl text-center shadow-sm border border-slate-100 space-y-6">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                <Ticket className="h-10 w-10" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">No registrations yet</p>
                <p className="text-slate-500 font-medium mt-2">You haven't registered for any events yet. Start exploring now!</p>
              </div>
              <Link href="/events" className="inline-block">
                <Button className="h-14 px-10 rounded-2xl font-bold shadow-lg shadow-primary/20">
                  Browse Events <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
