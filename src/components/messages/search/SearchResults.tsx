import { MessageListItem } from '../list/MessageListItem';
import { EmptyState } from '../../shared/EmptyState';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import type { Message } from '../../../types/message';

interface SearchResultsProps {
  results: Message[];
  isSearching: boolean;
  query: string;
}

export function SearchResults({ results, isSearching, query }: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!results.length && query) {
    return (
      <EmptyState
        title="No results found"
        description={`No messages found matching "${query}"`}
      />
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {results.map((message) => (
        <MessageListItem key={message.id} message={message} />
      ))}
    </div>
  );
}