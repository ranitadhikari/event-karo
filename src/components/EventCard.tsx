import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Event } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, showActions, onEdit, onDelete }) => {
  // Use a placeholder if no poster is provided in the event object
  const posterUrl = (event as any).poster || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800`;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden border-none bg-slate-900 shadow-xl rounded-2xl">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <motion.img 
            src={posterUrl} 
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Floating Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 hover:bg-primary text-white border-none backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              {event.type || 'Event'}
            </Badge>
          </div>

          {/* Event Details Overlay (Visible on Hover) */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center text-slate-300 text-sm gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span className="truncate">{event.collegeName}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
              </div>

              <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex gap-2">
                {showActions ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit?.(event)} 
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onDelete?.(event.id)} 
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Link href={`/event/${event.id}`} className="w-full">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn">
                      <span>Register Now</span>
                      <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
