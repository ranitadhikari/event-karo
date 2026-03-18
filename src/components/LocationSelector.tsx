'use client';

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';

const POPULAR_CITIES = [
  'All Cities',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Chandigarh',
  'Jaipur',
  'Lucknow'
];

export const LocationSelector: React.FC = () => {
  const { selectedCity, setSelectedCity } = useLocation();

  return (
    <div className="flex items-center space-x-2">
      <MapPin className="h-4 w-4 text-primary" />
      <Select value={selectedCity} onValueChange={setSelectedCity}>
        <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white font-bold text-[10px] uppercase tracking-widest h-9 rounded-xl focus:ring-primary/20">
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
          {POPULAR_CITIES.map((city) => (
            <SelectItem 
              key={city} 
              value={city}
              className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-[10px] font-bold uppercase tracking-widest"
            >
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
