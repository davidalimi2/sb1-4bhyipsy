import { MessageSearchInput } from '../search/MessageSearchInput';
import { FilterDropdown } from '../filters/FilterDropdown';
import { MessageSortButton } from '../sort/MessageSortButton';

export function MessageToolbar() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <div className="flex-1">
        <MessageSearchInput />
      </div>
      <div className="flex items-center gap-2">
        <FilterDropdown />
        <MessageSortButton />
      </div>
    </div>
  );
}