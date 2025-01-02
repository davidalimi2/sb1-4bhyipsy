```typescript
import { useState, useEffect } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  IScreenVideoTrack
} from 'agora-rtc-sdk-ng';
import { useNotifications } from '../useNotifications';

interface UseVideoSDKOptions {
  appId: string;
  channel: string;
  token?: string;
  uid?: string;
}

interface LocalTracks {
  audioTrack: IMicrophoneAudioTrack | null;
  videoTrack: ICameraVideoTrack | null;
  screenTrack: IScreenVideoTrack | null;
}

interface RemoteUser {
  uid: string;
  audioTrack: IRemoteAudioTrack | null;
  videoTrack: IRemoteVideoTrack | null;
}

export function useVideoSDK({ appId, channel, token, uid }: UseVideoSDKOptions) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localTracks, setLocalTracks] = useState<LocalTracks>({
    audioTrack: null,
    videoTrack: null
    screenTrack: null
  });
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const initClient = async () => {
      try {
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setClient(agoraClient);

        // Handle user published events
        agoraClient.on('user-published', async (user, mediaType) => {
          await agoraClient.subscribe(user, mediaType);
          
          setRemoteUsers(prev => {
            const existing = prev.find(u => u.uid === user.uid);
            if (existing) {
              return prev.map(u => u.uid === user.uid ? {
                ...u,
                [mediaType === 'audio' ? 'audioTrack' : 'videoTrack']: user[mediaType]
              } : u);
            }
            return [...prev, {
              uid: user.uid,
              audioTrack: mediaType === 'audio' ? user.audioTrack : null,
              videoTrack: mediaType === 'video' ? user.videoTrack : null
            }];
          });
        });

        // Handle user unpublished events
        agoraClient.on('user-unpublished', (user, mediaType) => {
          setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? {
            ...u,
            [mediaType === 'audio' ? 'audioTrack' : 'videoTrack']: null
          } : u));
        });

        // Handle user left events
        agoraClient.on('user-left', (user) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });

      } catch (error) {
        console.error('Error initializing Agora client:', error);
        addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'Failed to initialize video connection'
        });
      }
    };

    initClient();

    return () => {
      client?.removeAllListeners();
    };
  }, [appId]);

  const joinChannel = async () => {
    if (!client) return;

    try {
      await client.join(appId, channel, token, uid);
      
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);

      await client.publish([audioTrack, videoTrack]);
      setLocalTracks({ audioTrack, videoTrack });

    } catch (error) {
      console.error('Error joining channel:', error);
      addNotification({
        type: 'error',
        title: 'Join Error',
        message: 'Failed to join video meeting'
      });
    }
  };

  const leaveChannel = async () => {
    localTracks.audioTrack?.close();
    localTracks.videoTrack?.close();
    await client?.leave();
    setLocalTracks({ audioTrack: null, videoTrack: null });
    setRemoteUsers([]);
  };

  const toggleAudio = async () => {
    if (localTracks.audioTrack) {
      await localTracks.audioTrack.setEnabled(!localTracks.audioTrack.enabled);
    }
  };

  const toggleVideo = async () => {
    if (localTracks.videoTrack) {
      await localTracks.videoTrack.setEnabled(!localTracks.videoTrack.enabled);
    }
  };
  const startScreenShare = async () => {
    if (!client) return;

    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      await client.unpublish(localTracks.videoTrack);
      await client.publish(screenTrack);
      setLocalTracks(prev => ({ ...prev, screenTrack }));
    } catch (error) {
      console.error('Error starting screen share:', error);
      addNotification({
        type: 'error',
        title: 'Screen Share Error',
        message: 'Failed to start screen sharing'
      });
    }
  };

  const stopScreenShare = async () => {
    if (!client || !localTracks.screenTrack) return;

    try {
      await client.unpublish(localTracks.screenTrack);
      localTracks.screenTrack.close();
      await client.publish(localTracks.videoTrack);
      setLocalTracks(prev => ({ ...prev, screenTrack: null }));
    } catch (error) {
      console.error('Error stopping screen share:', error);
      addNotification({
        type: 'error',
        title: 'Screen Share Error',
        message: 'Failed to stop screen sharing'
      });
    }
  };

  const startRecording = async () => {
    try {
      // Call your recording service/API here
      addNotification({
        type: 'success',
        title: 'Recording Started',
        message: 'Meeting recording has begun'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Recording Error',
        message: 'Failed to start recording'
      });
    }
  };

  const stopRecording = async () => {
    try {
      // Call your recording service/API here
      addNotification({
        type: 'success',
        title: 'Recording Stopped',
        message: 'Meeting recording has been saved'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Recording Error',
        message: 'Failed to stop recording'
      });
    }
  };

  return {
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
  };
}
```