import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../shared/ui/Input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search posts...' }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon={<Search className="h-5 w-5 text-gray-400" />}
        className="w-full"
      />
    </div>
  );
}