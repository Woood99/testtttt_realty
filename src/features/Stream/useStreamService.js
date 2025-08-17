import Peer from 'peerjs';
import { sendPostRequest } from '../../api/requestsApi';
import { getEmptyStream, settingsIceServersPeer } from '../../helpers/mediaStreamUtils';
import { streamParamsDefault } from './streamParamsDefault';
import videojs from 'video.js';

export const useStreamService = options => {
   const { setData, setConnections, is_live, streamId, initMediaStream, videoRef, setStreamParams, streamParams, data, setIsLoading } = options;

   const endStream = async () => {
      await sendPostRequest(`/seller-api/stream/${streamId}/end`);
      await resetStream();
   };

   const startStream = async () => {
      setStreamParams(prev => ({ ...prev, isLoading: true }));

      const mediaStream = await initMediaStream();
      if (!mediaStream) return;

      await new Promise(resolve => setTimeout(resolve, 200));
      const peer = new Peer(null, {
         config: {
            iceServers: settingsIceServersPeer,
         },
      });

      peer.on('call', call => {
         if (mediaStream) {
            setStreamParams(prev => {
               const currentStream = prev.isScreenSharing
                  ? new MediaStream([...(prev.screenStream?.getVideoTracks() || []), ...prev.mediaStream.getAudioTracks()])
                  : prev.mediaStream;
               call.answer(currentStream);

               return {
                  ...prev,
               };
            });
         } else {
            console.error('No stream available to answer call');
         }
      });

      peer.on('open', async id => {
         if (is_live) {
            await sendPostRequest(`/seller-api/stream/${streamId}/restart`, { peer_id: id });
            await getInfoStream();
         } else {
            await sendPostRequest(`/seller-api/stream/${streamId}/start`, { peer_id: id });
            await getInfoStream();
         }
         await new Promise(resolve => setTimeout(resolve, 200));
         setStreamParams(prev => ({ ...prev, isLoading: false }));
      });

      peer.on('error', err => console.error('PeerJS error:', err));

      peer.on('connection', conn => {
         conn.on('data', data => {
            setConnections(prev => [...prev, data.viewerId]);
         });
      });
      setStreamParams(prev => ({ ...prev, peerInstance: peer }));
   };

   const restartStream = async () => {};

   const getInfoStream = async () => {
      const { data: result } = await sendPostRequest(`/api/stream/${streamId}/info`);
      setData(result);
      return result;
   };

   const resetStream = async () => {
      setStreamParams(prev => ({ ...prev, isLoading: true }));

      if (streamParams.peerInstance && !streamParams.peerInstance.destroyed) {
         streamParams.peerInstance.removeAllListeners();
         streamParams.peerInstance.destroy();
      }

      if (videoRef.current?.srcObject) {
         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
         videoRef.current.srcObject = null;
      }

      if (streamParams.mediaStream) {
         streamParams.mediaStream.getTracks().forEach(track => track.stop());
      }
      if (streamParams.screenStream) {
         streamParams.screenStream.getTracks().forEach(track => track.stop());
      }

      setStreamParams({ ...streamParamsDefault, isLoading: true });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStreamParams(prev => ({ ...prev, isLoading: false }));
   };

   const connectToStream = async () => {
      if (!data.stream.is_live) {
         setIsLoading(false);
         return;
      }
      if (!data.user_status.is_broadcaster) {
         await sendPostRequest(`/api/stream/${streamId}/join`);
      }

      const peer = new Peer(null, {
         config: { iceServers: settingsIceServersPeer },
      });

      peer.on('open', () => {
         const emptyStream = getEmptyStream();
         const call = peer.call(data.stream.peer_id, emptyStream);

         call.on('stream', remoteStream => {
            setStreamParams(prev => ({ ...prev, mediaStream: remoteStream }));
            if (videoRef.current) {
               videoRef.current.srcObject = remoteStream;

               const player = videojs.getPlayer(videoRef.current);

               if (player) {
                  player.tech_.setSource({
                     srcObject: remoteStream,
                  });
               }
            }
            setIsLoading(false);
         });

         call.on('error', async err => {
            setIsLoading(false);
            await getInfoStream();
            resetStream();
         });
         call.on('close', async () => {
            setIsLoading(false);
            await getInfoStream();
            resetStream();
         });
      });

      peer.on('error', async err => {
         setIsLoading(false);
         await getInfoStream();
         resetStream();
      });
      peer.on('close', async () => {
         setIsLoading(false);
         await getInfoStream();
         resetStream();
      });
   };

   return { startStream, restartStream, endStream, getInfoStream, resetStream, connectToStream };
};
