```typescript
import { useState, useCallback } from 'react';
import type { StructureElement } from '../../types/template';

export function useElementEditor(
  initialElement: StructureElement,
  onChange: (element: StructureElement) => void
) {
  const [element, setElement] = useState(initialElement);

  const updateContent = useCallback((content: string) => {
    const updated = { ...element, content };
    setElement(updated);
    onChange(updated);
  }, [element, onChange]);

  const updateProperty = useCallback((key: string, value: any) => {
    const updated = {
      ...element,
      properties: {
        ...element.properties,
        [key]: value
      }
    };
    setElement(updated);
    onChange(updated);
  }, [element, onChange]);

  const updateStyle = useCallback((style: string) => {
    updateProperty('style', style);
  }, [updateProperty]);

  const updateClassName = useCallback((className: string) => {
    updateProperty('className', className);
  }, [updateProperty]);

  return {
    element,
    updateContent,
    updateProperty,
    updateStyle,
    updateClassName
  };
}
```