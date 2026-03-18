'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/lib/utils';
import { Calendar, MapPin, Users, Edit3, Trash2, ExternalLink, Zap } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { motion } from 'framer-motion';

interface CollegeEventCardProps {
  event: {
    id: string;
    title: string;
    date: string | Date;
    registrationCount: number;
    poster?: string;
    isFeatured?: boolean;
    status?: 'upcoming' | 'ongoing' | 'past';
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export const CollegeEventCard: React.FC<CollegeEventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const posterUrl = event.poster || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800`;
  const isFeatured = event.isFeatured;

  const statusColors = {
    upcoming: 'bg-blue-50 text-blue-600 border-blue-100',
    ongoing: 'bg-green-50 text-green-600 border-green-100',
    past: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className={cn(
        "group relative h-full overflow-hidden border border-gray-200 bg-white shadow-sm rounded-xl transition-all duration-300 hover:shadow-md",
        isFeatured && "ring-2 ring-blue-500 ring-offset-2 ring-offset-white"
      )}>
        {/* Poster Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <motion.img 
            src={posterUrl} 
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3 z-20">
            <Badge className={cn(
              "px-2.5 py-1 rounded-full border shadow-sm font-semibold text-[10px] uppercase tracking-wider",
              statusColors[event.status || 'upcoming']
            )}>
              {event.status || 'upcoming'}
            </Badge>
          </div>

          {/* Featured Highlight */}
          {isFeatured && (
            <div className="absolute top-3 left-3 z-20">
              <Badge className="bg-blue-600 text-white border-none px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 font-semibold text-[10px] uppercase tracking-wider">
                <Zap className="h-3 w-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Gradient Overlay (more subtle) */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-60" />
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors duration-300">
              {event.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-green-500" />
                <span className="text-gray-900 font-bold">{event.registrationCount}</span>
                <span className="text-gray-400">Reg.</span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 pt-1">
            <Button 
              onClick={() => onViewDetails?.(event.id)}
              variant="outline" 
              className="flex-1 h-9 rounded-md border-gray-200 text-gray-700 font-bold text-[10px] uppercase tracking-wider hover:bg-gray-50 hover:text-gray-900 transition-all duration-300"
            >
              Details
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => onEdit?.(event.id)}
                size="icon" 
                variant="outline" 
                className="h-9 w-9 rounded-md border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => onDelete?.(event.id)}
                size="icon" 
                variant="outline" 
                className="h-9 w-9 rounded-md border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
