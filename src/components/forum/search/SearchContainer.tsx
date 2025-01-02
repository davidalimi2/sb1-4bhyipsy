import React from 'react';
import { SearchBar } from './SearchBar';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { useForumSearch } from '../../../hooks/forum/useForumSearch';

export function SearchContainer() {
  const {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    isLoading,
    error
  } = useForumSearch();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchBar
          value={query}
          onChange={setQuery}
        />
        <SearchFilters
          {...filters}
          onCategoryChange={(category) => setFilters(prev => ({ ...prev, category }))}
          onStatusChange={(status) => setFilters(prev => ({ ...prev, status }))}
          onSortChange={(sortBy) => setFilters(prev => ({ ...prev, sortBy }))}
          onTimeframeChange={(timeframe) => setFilters(prev => ({ ...prev, timeframe }))}
        />
      </div>

      <SearchResults
        results={results}
        isLoading={isLoading}
        error={error}
        searchQuery={query}
      />
    </div>
  );
}