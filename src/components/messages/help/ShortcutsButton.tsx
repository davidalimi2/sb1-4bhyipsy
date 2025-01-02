```typescript
import { Keyboard } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

export function ShortcutsButton() {
  const handleClick = () => {
    document.dispatchEvent(new CustomEvent('toggle-shortcuts-help'));
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      icon={<Keyboard className="h-4 w-4" />}
      onClick={handleClick}
    >
      Shortcuts
    </Button>
  );
}
```