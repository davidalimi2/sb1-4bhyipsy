import { ArrowUpDown } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useMessageSort } from '../../../hooks/messages/useMessageSort';

export function MessageSortButton() {
  const { sort, toggleSortDirection } = useMessageSort();

  return (
    <Button
      variant="secondary"
      size="sm"
      icon={<ArrowUpDown className="h-4 w-4" />}
      onClick={toggleSortDirection}
    >
      Sort {sort.direction === 'asc' ? 'Ascending' : 'Descending'}
    </Button>
  );
}