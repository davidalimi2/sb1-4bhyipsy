```typescript
import React, { useEffect, useState } from 'react';
import { useVideoSDK } from '../../hooks/meetings/useVideoSDK';
import { VideoParticipant } from './VideoParticipant';
import { VideoGrid } from './VideoGrid';
import { MeetingControls } from './MeetingControls';
import { MeetingChat } from './MeetingChat';

interface VideoMeetingProps {
  meetingId: string;
  appId: string;
  token?: string;
}

export function VideoMeeting({ meetingId, appId, token }: VideoMeetingProps) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const {
    localTracks,
    remoteUsers,
    joinChannel,
    leaveChannel,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    startRecording,
    stopRecording
  } = useVideoSDK({
    appId,
    channel: meetingId,
    token
  });

  useEffect(() => {
    joinChannel();
    return () => {
      leaveChannel();
    };
  }, []);

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
    setIsScreenSharing(!isScreenSharing);
  };

  const handleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
    setIsRecording(!isRecording);
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveChannel();
      window.history.back();
    } catch (error) {
      console.error('Error leaving meeting:', error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <VideoGrid
          localTracks={localTracks}
          remoteUsers={remoteUsers}
        />

        <MeetingControls
          isAudioEnabled={!!localTracks.audioTrack?.enabled}
          isVideoEnabled={!!localTracks.videoTrack?.enabled}
          isScreenSharing={isScreenSharing}
          isRecording={isRecording}
          showChat={showChat}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleScreenShare={handleScreenShare}
          onToggleRecording={handleRecording}
          onToggleChat={() => setShowChat(!showChat)}
          onLeave={handleLeave}
        />
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="w-80 border-l border-gray-200 bg-white">
          <MeetingChat meetingId={meetingId} />
        </div>
      )}
    </div>
  );
}
```