'use client';

import React from 'react';
import { cn } from '@/utils/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CollegeStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-600',
    iconText: 'text-white',
    shadow: 'shadow-blue-100',
    border: 'border-blue-100',
    text: 'text-blue-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-600',
    iconText: 'text-white',
    shadow: 'shadow-indigo-100',
    border: 'border-indigo-100',
    text: 'text-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-600',
    iconText: 'text-white',
    shadow: 'shadow-emerald-100',
    border: 'border-emerald-100',
    text: 'text-emerald-600',
  },
  rose: {
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-600',
    iconText: 'text-white',
    shadow: 'shadow-rose-100',
    border: 'border-rose-100',
    text: 'text-rose-600',
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-600',
    iconText: 'text-white',
    shadow: 'shadow-amber-100',
    border: 'border-amber-100',
    text: 'text-amber-600',
  },
};

export const CollegeStatCard: React.FC<CollegeStatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  description,
  trend,
  className,
  color = 'blue'
}) => {
  const styles = colorStyles[color];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-col space-y-4 relative z-10">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-transform duration-500 hover:rotate-6",
          styles.iconBg,
          styles.iconText
        )}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
            {trend && (
              <div className={cn(
                "flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold",
                trend.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                <span>{trend.isUp ? '+' : '-'}{trend.value}%</span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-400 font-medium">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
