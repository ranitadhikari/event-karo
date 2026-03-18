import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, GraduationCap, ArrowRight, Info } from 'lucide-react';
import { College } from '@/types';
import { motion } from 'framer-motion';

interface CollegeCardProps {
  college: College;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 rounded-2xl shadow-2xl flex flex-col">
        {/* Background Decorative Gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
        
        <div className="p-8 flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
              {college.logo ? (
                <img src={college.logo} alt={college.name} className="h-10 w-10 object-contain" />
              ) : (
                <GraduationCap className="h-8 w-8 text-primary" />
              )}
            </div>
            <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-400 backdrop-blur-sm flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px] px-2.5 py-1">
              <MapPin className="h-3 w-3" />
              {college.city}
            </Badge>
          </div>
          
          <div className="space-y-3 flex-grow">
            <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
              {college.name}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
              {college.description || "A premier educational institution dedicated to excellence in learning and student development."}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
              5+ Events
            </Badge>
            <Badge variant="secondary" className="bg-white/5 text-slate-400 border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
              {college.city}
            </Badge>
          </div>
        </div>

        <div className="p-6 pt-0 mt-auto flex gap-3">
          <Link href={`/college/${college.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider h-10">
              <span>Profile</span>
              <Info className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href={`/college/${college.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider h-10 group/btn">
              <span>Events</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};
