import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface FilterDropdownProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ options, selectedValue, onChange }) => {
  return (
    <Select value={selectedValue} onValueChange={(val) => onChange(val ?? '')}>
      <SelectTrigger className="h-14 min-w-[180px] bg-white/5 border-white/10 rounded-2xl px-6 text-white focus:ring-primary/10 focus:border-primary/50 transition-all font-bold uppercase tracking-widest text-xs">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-primary" />
          <SelectValue placeholder="Filter by type" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl shadow-2xl">
        {options.map((option) => (
          <SelectItem 
            key={option} 
            value={option}
            className="focus:bg-primary/20 focus:text-white cursor-pointer py-3 px-4 capitalize font-medium"
          >
            {option === 'all' ? 'All Events' : option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};