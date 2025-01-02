```typescript
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { Select } from '../shared/ui/Select';

interface VideoQualitySettingsProps {
  onSettingsChange: (settings: {
    resolution: string;
    frameRate: number;
    bitrate: number;
  }) => void;
}

export function VideoQualitySettings({ onSettingsChange }: VideoQualitySettingsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [resolution, setResolution] = useState('640x480');
  const [frameRate, setFrameRate] = useState(15);
  const [bitrate, setBitrate] = useState(600);

  const handleSave = () => {
    onSettingsChange({
      resolution,
      frameRate,
      bitrate
    });
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
        Video Quality
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
                onChange={(e) => setResolution(e.target.value)}
                className="mt-1"
              >
                <option value="320x240">320x240</option>
                <option value="640x480">640x480</option>
                <option value="1280x720">1280x720 (HD)</option>
                <option value="1920x1080">1920x1080 (Full HD)</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frame Rate
              </label>
              <Select
                value={frameRate}
                onChange={(e) => setFrameRate(Number(e.target.value))}
                className="mt-1"
              >
                <option value="15">15 fps</option>
                <option value="24">24 fps</option>
                <option value="30">30 fps</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bitrate
              </label>
              <Select
                value={bitrate}
                onChange={(e) => setBitrate(Number(e.target.value))}
                className="mt-1"
              >
                <option value="400">400 Kbps</option>
                <option value="600">600 Kbps</option>
                <option value="1000">1000 Kbps</option>
                <option value="2000">2000 Kbps</option>
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