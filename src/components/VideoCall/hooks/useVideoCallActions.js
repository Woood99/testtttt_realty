import { useCallback } from 'react';
import useSound from 'use-sound';
import { getPermissions, sendMediaState } from '../helpers/chatVideoCallHelpers';

import screenShareSound from '../../../assets/ringtone-4.mp3';

export const useVideoCallActions = options => {
   const { userVideoRef, videoCallParams, setVideoCallParams } = options;
   const [playScreenShareSound] = useSound(screenShareSound, { volume: 0.5 });

   const toggleMuteAudio = useCallback(() => {
      if (!userVideoRef.current) return;
      const audioTrack = userVideoRef.current.srcObject?.getAudioTracks()[0];

      sendMediaState(
         videoCallParams.peer1 || videoCallParams.peer2,
         !videoCallParams.mutedCamera,
         !audioTrack.enabled,
         !videoCallParams.mutedScreenSharing
      );
      audioTrack.enabled = !audioTrack.enabled;
      setVideoCallParams(prev => ({ ...prev, mutedAudio: !prev.mutedAudio }));
   }, [userVideoRef, videoCallParams]);

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
               const { stream: screenStream } = await getPermissions(
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
               sendMediaState(peer, true, !videoCallParams.mutedAudio, !videoCallParams.mutedScreenSharing);
               userVideoRef.current.srcObject = newStream;

               peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);

               setVideoCallParams(prev => ({ ...prev, mutedCamera: false }));
            } catch (error) {}
         } else {
            const { stream } = await getPermissions(
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

            sendMediaState(peer, false, !videoCallParams.mutedAudio, !videoCallParams.mutedScreenSharing);
            userVideoRef.current.srcObject = newStream;

            peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);
            setVideoCallParams(prev => ({ ...prev, mutedCamera: true }));
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
               const { stream: screenStream, statuses } = await getPermissions(
                  userVideoRef,
                  'getDisplayMedia',
                  value => {
                     setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
                  },
                  { video: true, audio: false }
               );

               if (!statuses.video) {
                  screenStream.getTracks().forEach(track => track.stop());
                  return;
               }

               const screenVideoTrack = screenStream.getVideoTracks()[0];
               if (!screenVideoTrack) return;

               const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
               const audioTrack = peer.streams[0]?.getAudioTracks()[0];

               const newStream = new MediaStream();
               newStream.addTrack(screenVideoTrack);
               if (audioTrack) {
                  newStream.addTrack(audioTrack);
               }

               screenVideoTrack.onended = () => {
                  toggleScreenSharing(true);
               };

               sendMediaState(peer, false, !videoCallParams.mutedAudio, true);
               peer.send(
                  JSON.stringify({
                     type: 'screen-share-start',
                     timestamp: Date.now(),
                  })
               );
               playScreenShareSound();
               userVideoRef.current.srcObject = newStream;

               peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);

               setVideoCallParams(prev => ({ ...prev, mutedScreenSharing: false, screenStream }));
            } catch (error) {}
         } else {
            try {
               if (videoCallParams.screenStream) {
                  videoCallParams.screenStream.getTracks().forEach(track => track.stop());
               }

               const { stream } = await getPermissions(
                  userVideoRef,
                  'getUserMedia',
                  value => {
                     setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
                  },
                  { video: false, audio: false }
               );

               const cameraVideoTrack = stream.getVideoTracks()[0];
               if (!cameraVideoTrack) return;

               const audioTrack = currentStream.getAudioTracks()[0];
               const newStream = new MediaStream();
               newStream.addTrack(cameraVideoTrack);
               if (audioTrack) {
                  newStream.addTrack(audioTrack);
               }

               sendMediaState(peer, !videoCallParams.mutedCamera, !videoCallParams.mutedAudio, false);
               userVideoRef.current.srcObject = newStream;

               const oldVideoTrack = currentStream.getVideoTracks()[0];
               peer.replaceTrack(oldVideoTrack, cameraVideoTrack, currentStream);

               setVideoCallParams(prev => ({ ...prev, mutedScreenSharing: true, screenStream: null }));

               stream.getTracks().forEach(track => track.stop());
            } catch (error) {}
         }
      },
      [videoCallParams]
   );

   return { toggleMuteAudio, toggleCameraArea, toggleCamera, toggleScreenSharing };
};
