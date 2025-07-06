import { useCallback } from 'react';
import { getPermissions, sendMediaState } from '../helpers/chatVideoCallHelpers';

export const useVideoCallActions = options => {
   const { userVideoRef, videoCallParams, setVideoCallParams } = options;

   const toggleMuteAudio = () => {
      if (!userVideoRef.current) return;
      const audioTrack = userVideoRef.current.srcObject?.getAudioTracks()[0];
      if (audioTrack) {
         sendMediaState(videoCallParams.peer1 || videoCallParams.peer2, videoCallParams.statusCompanionMedia.video, !audioTrack.enabled);
         audioTrack.enabled = !audioTrack.enabled;
         setVideoCallParams(prev => ({ ...prev, mutedAudio: !prev.mutedAudio }));
      }
   };

   const toggleCameraArea = () => {
      if (videoCallParams.callAccepted) {
         setVideoCallParams(prev => ({ ...prev, isFocusMySelf: !prev.isFocusMySelf }));
      }
   };

   const toggleCamera = useCallback(
      async status => {
         const peer = videoCallParams.peer1 || videoCallParams.peer2;

         if (!peer) return;
         const currentStream = peer.streams.find(stream => stream.getVideoTracks().length > 0);
         if (!currentStream) return;
         currentStream.getVideoTracks().forEach(track => track.stop());

         if (!status) {
            try {
               const screenStream = await getPermissions(
                  userVideoRef,
                  'getUserMedia',
                  value => {
                     setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
                  },
                  {
                     video: true,
                     audio: false,
                     facingMode: 'user',
                  }
               );
               const screenVideoTrack = screenStream.getVideoTracks()[0];
               if (!screenVideoTrack) return;

               const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
               const audioTrack = peer.streams[0]?.getAudioTracks()[0];

               const newStream = new MediaStream();
               newStream.addTrack(screenVideoTrack);
               if (audioTrack) {
                  newStream.addTrack(audioTrack);
               }
               sendMediaState(peer, true, videoCallParams.statusCompanionMedia.audio);
               userVideoRef.current.srcObject = newStream;

               peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);

               setVideoCallParams(prev => ({ ...prev, mutedCamera: true }));
            } catch (error) {}
         } else {
            const stream = await getPermissions(
               userVideoRef,
               'getUserMedia',
               value => {
                  setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
               },
               {
                  video: false,
                  audio: true,
               }
            );
            const screenVideoTrack = stream.getVideoTracks()[0];
            if (!screenVideoTrack) return;

            const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
            const audioTrack = peer.streams[0]?.getAudioTracks()[0];

            const newStream = new MediaStream();
            newStream.addTrack(screenVideoTrack);
            if (audioTrack) {
               newStream.addTrack(audioTrack);
            }

            sendMediaState(peer, false, videoCallParams.statusCompanionMedia.audio);
            userVideoRef.current.srcObject = newStream;

            peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);
            setVideoCallParams(prev => ({ ...prev, mutedCamera: false }));
         }
      },
      [videoCallParams]
   );

   const toggleScreenSharing = useCallback(
      async status => {
         const peer = videoCallParams.peer1 || videoCallParams.peer2;

         if (!peer) return;
         const currentStream = peer.streams.find(stream => stream.getVideoTracks().length > 0);
         if (!currentStream) return;
         currentStream.getVideoTracks().forEach(track => track.stop());

         if (!status) {
            try {
               const screenStream = await getPermissions(
                  userVideoRef,
                  'getDisplayMedia',
                  value => {
                     setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
                  },
                  { video: true, audio: false }
               );
               const screenVideoTrack = screenStream.getVideoTracks()[0];
               if (!screenVideoTrack) return;

               const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
               const audioTrack = peer.streams[0]?.getAudioTracks()[0];

               const newStream = new MediaStream();
               newStream.addTrack(screenVideoTrack);
               if (audioTrack) {
                  newStream.addTrack(audioTrack);
               }
               sendMediaState(peer, true, videoCallParams.statusCompanionMedia.audio);
               userVideoRef.current.srcObject = newStream;

               peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);

               setVideoCallParams(prev => ({ ...prev, mutedScreenSharing: true }));
            } catch (error) {}
         } else {
            try {
               const stream = await getPermissions(userVideoRef, 'getDisplayMedia', value => {
                  setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
               });
               const screenVideoTrack = stream.getVideoTracks()[0];

               if (!screenVideoTrack) {
                  return;
               }

               const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
               const audioTrack = peer.streams[0]?.getAudioTracks()[0];

               const newStream = new MediaStream();
               newStream.addTrack(screenVideoTrack);
               if (audioTrack) {
                  newStream.addTrack(audioTrack);
               }

               sendMediaState(peer, false, videoCallParams.statusCompanionMedia.audio);
               userVideoRef.current.srcObject = newStream;

               peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);
               setVideoCallParams(prev => ({ ...prev, mutedScreenSharing: false }));
            } catch (error) {}
         }
      },
      [videoCallParams]
   );

   const handleSwitchCamera = useCallback(
      async status => {
         const peer = videoCallParams.peer1 || videoCallParams.peer2;

         if (!peer) return;
         const currentStream = peer.streams.find(stream => stream.getVideoTracks().length > 0);
         if (!currentStream) return;
         currentStream.getVideoTracks().forEach(track => track.stop());

         const screenStream = await getPermissions(
            userVideoRef,
            'getUserMedia',
            value => {
               setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
            },
            {
               video: true,
               audio: false,
               facingMode: status,
            }
         );
         const screenVideoTrack = screenStream.getVideoTracks()[0];
         if (!screenVideoTrack) return;

         const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
         const audioTrack = peer.streams[0]?.getAudioTracks()[0];

         const newStream = new MediaStream();
         newStream.addTrack(screenVideoTrack);
         if (audioTrack) {
            newStream.addTrack(audioTrack);
         }

         sendMediaState(peer, true, videoCallParams.statusCompanionMedia.audio);
         userVideoRef.current.srcObject = newStream;

         peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);

         setVideoCallParams(prev => ({ ...prev, cameraMode: status }));
      },
      [videoCallParams]
   );

   return { toggleMuteAudio, toggleCameraArea, toggleCamera, toggleScreenSharing, handleSwitchCamera };
};
