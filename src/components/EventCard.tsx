import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, ArrowRight, Trophy, Zap } from 'lucide-react';
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
  const posterUrl = event.poster || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800`;
  const isFeatured = event.isFeatured;

  const cardContent = (
    <Card className={`group relative h-full overflow-hidden border-none bg-slate-900 shadow-xl rounded-2xl ${
      isFeatured ? 'ring-2 ring-primary ring-offset-4 ring-offset-slate-950 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]' : ''
    }`}>
      {/* Poster Image */}
      <div className={`relative ${isFeatured ? 'aspect-[4/5]' : 'aspect-[2/3]'} w-full overflow-hidden`}>
        <motion.img 
          src={posterUrl} 
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isFeatured && (
            <Badge className="bg-amber-500 text-slate-950 border-none px-3 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3 w-3 fill-current" />
              Trending
            </Badge>
          )}
          <Badge className={`${isFeatured ? 'bg-primary' : 'bg-primary/90'} hover:bg-primary text-white border-none backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1`}>
            {event.type === 'Hackathon' ? <Trophy className="h-3 w-3" /> : null}
            {event.type || 'Event'}
          </Badge>
          {isFeatured && (
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              🔥 Featured
            </Badge>
          )}
          {event.city && (
            <Badge variant="outline" className="bg-slate-900/50 text-white border-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              <MapPin className="h-3 w-3 mr-1 text-primary" />
              {event.city}
            </Badge>
          )}
        </div>

        {/* Event Details Overlay (Visible on Hover or Always if Featured) */}
        <div className={`absolute inset-0 flex flex-col justify-end p-6 ${isFeatured ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'} transition-transform duration-300`}>
          <div className="space-y-3">
            <div className="space-y-1">
              {isFeatured && event.tagline && (
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                  {event.tagline}
                </p>
              )}
              <h3 className={`${isFeatured ? 'text-2xl' : 'text-xl'} font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors`}>
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
              {isFeatured && event.prizePool && (
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Trophy className="h-3 w-3" />
                  <span>{event.prizePool}</span>
                </div>
              )}
            </div>

            <div className={`pt-2 ${isFeatured ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300 delay-100 flex gap-2`}>
              {showActions ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(event); }} 
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(event.id); }} 
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button size="sm" className={`w-full ${isFeatured ? 'bg-primary h-11' : 'bg-primary'} hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn font-bold uppercase tracking-widest text-[10px]`}>
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div
      whileHover={{ scale: isFeatured ? 1.05 : 1.02 }}
      transition={{ duration: 0.3 }}
      className={`h-full ${isFeatured ? 'relative z-10' : ''}`}
    >
      {!showActions ? (
        <Link href={`/event/${event.id}`} className="block h-full cursor-pointer">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
};
