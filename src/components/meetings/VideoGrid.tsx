```typescript
import React from 'react';
import { VideoParticipant } from './VideoParticipant';
import type { LocalTracks, RemoteUser } from '../../hooks/meetings/useVideoSDK';

interface VideoGridProps {
  localTracks: LocalTracks;
  remoteUsers: RemoteUser[];
}

export function VideoGrid({ localTracks, remoteUsers }: VideoGridProps) {
  const totalParticipants = remoteUsers.length + 1;
  const gridCols = totalParticipants <= 4 ? 2 : 3;

  return (
    <div 
      className={`grid gap-4 p-4 bg-gray-900 auto-rows-fr
        ${gridCols === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
    >
      {/* Local participant */}
      <VideoParticipant
        videoTrack={localTracks.videoTrack}
        audioTrack={localTracks.audioTrack}
        username="You"
        isLocal
      />
      
      {/* Remote participants */}
      {remoteUsers.map((user) => (
        <VideoParticipant
          key={user.uid}
          videoTrack={user.videoTrack}
          audioTrack={user.audioTrack}
          username={`User ${user.uid}`}
        />
      ))}
    </div>
  );
}
```