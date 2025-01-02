```typescript
import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import type { ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';

interface VideoParticipantProps {
  videoTrack?: ICameraVideoTrack | IRemoteVideoTrack | null;
  audioTrack?: IMicrophoneAudioTrack | IRemoteAudioTrack | null;
  username: string;
  isLocal?: boolean;
}

export function VideoParticipant({ 
  videoTrack, 
  audioTrack, 
  username,
  isLocal = false 
}: VideoParticipantProps) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current || !videoTrack) return;
    
    videoTrack.play(videoRef.current);
    return () => {
      videoTrack.stop();
    };
  }, [videoTrack]);

  useEffect(() => {
    if (!audioTrack) return;
    
    audioTrack.play();
    return () => {
      audioTrack.stop();
    };
  }, [audioTrack]);

  return (
    <div className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden">
      <div ref={videoRef} className="absolute inset-0" />
      
      {/* Participant Info */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          {username} {isLocal && '(You)'}
        </span>
        
        <div className="flex items-center space-x-2">
          {!audioTrack?.enabled && (
            <div className="p-1 bg-red-500 rounded-full">
              <MicOff className="h-3 w-3 text-white" />
            </div>
          )}
          {!videoTrack?.enabled && (
            <div className="p-1 bg-red-500 rounded-full">
              <VideoOff className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* No Video Placeholder */}
      {!videoTrack?.enabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
          <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-2xl text-white">
              {username[0]?.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
```