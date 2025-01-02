import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { LawyerList } from '../../components/lawyers/list/LawyerList';
import { LawyerFilters } from '../../components/lawyers/filters/LawyerFilters';
import { Input } from '../../components/shared/ui/Input';
import { Button } from '../../components/shared/ui/Button';
import { PageHeader } from '../../components/shared/ui/PageHeader';
import { useLawyers } from '../../hooks/lawyers/useLawyers';

export default function LawyerDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { lawyers, isLoading, filters, updateFilters } = useLawyers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Find a Lawyer"
        description="Connect with experienced lawyers who can help with your case"
      />

      <div className="mt-8 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, practice area, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="h-4 w-4" />}
            >
              Filters
            </Button>
            <Button
              variant="secondary"
              icon={<MapPin className="h-4 w-4" />}
            >
              Near Me
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <LawyerFilters
            filters={filters}
            onChange={updateFilters}
          />
        )}

        {/* Lawyer List */}
        <LawyerList
          lawyers={lawyers}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}