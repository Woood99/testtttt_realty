import videojs from 'video.js';

export const useStreamActions = options => {
   const { streamParams, setStreamParams, videoRef } = options;

   const toggleScreenSharing = async () => {
      if (streamParams.isScreenSharing) {
         streamParams.screenStream.getTracks().forEach(track => track.stop());

         if (videoRef.current) {
            videoRef.current.srcObject = streamParams.mediaStream;

            const player = videojs.getPlayer(videoRef.current);
            if (player) {
               player.tech_.setSource({
                  srcObject: streamParams.mediaStream,
               });
            }
         }
         setStreamParams(prev => ({ ...prev, isScreenSharing: false, screenStream: null }));
         if (streamParams.mediaStream) {
            updateAllConnections(streamParams.mediaStream);
         }
         return;
      }

      try {
         const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
         });

         const combinedStream = new MediaStream();

         stream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

         if (streamParams.mediaStream) {
            const audioTracks = streamParams.mediaStream.getAudioTracks();
            audioTracks.forEach(track => combinedStream.addTrack(track));
         } else {
            stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
         }

         if (videoRef.current) {
            videoRef.current.srcObject = combinedStream;

            const player = videojs.getPlayer(videoRef.current);
            if (player) {
               player.tech_.setSource({
                  srcObject: combinedStream,
               });
            }
         }

         setStreamParams(prev => ({ ...prev, isScreenSharing: true, screenStream: combinedStream }));

         updateAllConnections(combinedStream);

         stream.getVideoTracks()[0].onended = () => toggleScreenSharing();
      } catch (error) {
         console.error('Screen sharing error:', error);
      }
   };

   const toggleCamera = () => {
      if (!streamParams.mediaStream) return;

      const videoTracks = streamParams.mediaStream.getVideoTracks();
      if (videoTracks.length > 0) {
         const newState = !videoTracks[0].enabled;
         videoTracks.forEach(track => {
            track.enabled = newState;
         });
         setStreamParams(prev => ({ ...prev, isCameraOn: newState }));

         if (!streamParams.isScreenSharing) {
            updateAllConnections(streamParams.mediaStream);
         }
      }
   };

   const toggleMicrophone = () => {
      if (streamParams.mediaStream) {
         const audioTracks = streamParams.mediaStream.getAudioTracks();
         audioTracks.forEach(track => {
            track.enabled = !track.enabled;
         });
         setStreamParams(prev => ({ ...prev, isMicMuted: !prev.isMicMuted }));

         const currentStream = streamParams.isScreenSharing
            ? new MediaStream([...(streamParams.screenStream?.getVideoTracks() || []), ...streamParams.mediaStream.getAudioTracks()])
            : streamParams.mediaStream;

         updateAllConnections(currentStream);
      }
   };

   const updateAllConnections = newStream => {
      if (!streamParams.peerInstance) return;

      Object.entries(streamParams.peerInstance.connections).forEach(([peerId, connections]) => {
         connections.forEach(connection => {
            if (connection.peerConnection && connection.peerConnection.getSenders) {
               const senders = connection.peerConnection.getSenders();

               newStream.getTracks().forEach(track => {
                  const sender = senders.find(s => s.track && s.track.kind === track.kind);
                  if (sender) {
                     sender.replaceTrack(track).catch(err => console.error('Error replacing track:', err));
                  }
               });
            }
         });
      });
   };

   return { toggleScreenSharing, toggleCamera, toggleMicrophone, updateAllConnections };
};
