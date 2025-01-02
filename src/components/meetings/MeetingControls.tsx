```typescript
import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, Record, StopCircle, MessageSquare, PhoneOff } from 'lucide-react';
import { Button } from '../shared/ui/Button';

interface MeetingControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  showChat: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
}

export function MeetingControls({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isRecording,
  showChat,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRecording,
  onToggleChat,
  onLeave
}: MeetingControlsProps) {
  return (
    <div className="bg-gray-800 p-4 flex items-center justify-center space-x-6">
      <Button
        variant="secondary"
        size="lg"
        onClick={onToggleAudio}
        icon={isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      >
        {isAudioEnabled ? 'Mute' : 'Unmute'}
      </Button>

      <Button
        variant="secondary"
        size="lg"
        onClick={onToggleVideo}
        icon={isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      >
        {isVideoEnabled ? 'Stop Video' : 'Start Video'}
      </Button>

      <Button
        variant="secondary"
        size="lg"
        onClick={onToggleScreenShare}
        icon={<Monitor className="h-5 w-5" />}
      >
        {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      </Button>

      <Button
        variant="secondary"
        size="lg"
        onClick={onToggleRecording}
        icon={isRecording ? <StopCircle className="h-5 w-5" /> : <Record className="h-5 w-5" />}
      >
        {isRecording ? 'Stop Recording' : 'Record'}
      </Button>

      <Button
        variant="secondary"
        size="lg"
        onClick={onToggleChat}
        icon={<MessageSquare className="h-5 w-5" />}
      >
        {showChat ? 'Hide Chat' : 'Show Chat'}
      </Button>

      <Button
        variant="danger"
        size="lg"
        onClick={onLeave}
        icon={<PhoneOff className="h-5 w-5" />}
      >
        Leave Meeting
      </Button>
    </div>
  );
}
```