'use client';

import React from 'react';
import { cn } from '@/utils/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber';
}

const colorStyles = {
  indigo: {
    bg: 'bg-primary/5',
    iconBg: 'bg-primary',
    iconText: 'text-primary-foreground',
    shadow: 'shadow-primary/5',
    border: 'border-border',
  },
  emerald: {
    bg: 'bg-emerald-500/5',
    iconBg: 'bg-emerald-500',
    iconText: 'text-white',
    shadow: 'shadow-emerald-500/5',
    border: 'border-border',
  },
  rose: {
    bg: 'bg-rose-500/5',
    iconBg: 'bg-rose-500',
    iconText: 'text-white',
    shadow: 'shadow-rose-500/5',
    border: 'border-border',
  },
  amber: {
    bg: 'bg-amber-500/5',
    iconBg: 'bg-amber-500',
    iconText: 'text-white',
    shadow: 'shadow-amber-500/5',
    border: 'border-border',
  },
};

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  description,
  trend,
  className,
  color = 'indigo'
}) => {
  const styles = colorStyles[color];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg",
      styles.border,
      styles.shadow,
      className
    )}>
      {/* Background decoration */}
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10", styles.bg)} />
      
      <div className="flex flex-col space-y-4">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 hover:scale-105",
          styles.iconBg,
          styles.iconText
        )}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-card-foreground tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className={cn(
                "text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center",
                trend.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {trend.isUp ? '+' : '-'}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground font-medium">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
