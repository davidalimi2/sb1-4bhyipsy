```typescript
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { Select } from '../shared/ui/Select';

interface RecordingSettingsProps {
  onSettingsChange: (settings: {
    resolution: '720p' | '1080p';
    mode: 'individual' | 'mixed';
  }) => void;
}

export function RecordingSettings({ onSettingsChange }: RecordingSettingsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [mode, setMode] = useState<'individual' | 'mixed'>('mixed');

  const handleSave = () => {
    onSettingsChange({ resolution, mode });
    setShowSettings(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        icon={<Settings className="h-4 w-4" />}
        onClick={() => setShowSettings(!showSettings)}
      >
        Recording Settings
      </Button>

      {showSettings && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resolution
              </label>
              <Select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as '720p' | '1080p')}
                className="mt-1"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recording Mode
              </label>
              <Select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'individual' | 'mixed')}
                className="mt-1"
              >
                <option value="mixed">Combined View</option>
                <option value="individual">Individual Tracks</option>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```