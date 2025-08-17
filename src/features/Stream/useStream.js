import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import { useStreamActions } from './useStreamActions';
import { useStreamService } from './useStreamService';
import { checkMediaDevices, fakeAudioStream, fakeVideoStream } from '../../helpers/mediaStreamUtils';
import { useSelector } from 'react-redux';
import { checkAuthUser, getHelpSliceSelector, getUserInfo } from '@/redux';
import { streamParamsDefault } from './streamParamsDefault';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { useLocation } from 'react-router-dom';
import { SellerRoutesPath } from '../../constants/RoutesPath';

export const useStream = streamId => {
   const [isLoading, setIsLoading] = useState(true);
   const [data, setData] = useState(null);
   const [connections, setConnections] = useState([]);

   const userInfo = useSelector(getUserInfo);
   const authUser = useSelector(checkAuthUser);
   const { isConnectEcho } = useSelector(getHelpSliceSelector);

   const videoRef = useRef(null);
   const [streamParams, setStreamParams] = useState(streamParamsDefault);
   const location = useLocation();

   const initMediaStream = async () => {
      const { hasVideo, hasAudio } = await checkMediaDevices();

      try {
         const stream = await navigator.mediaDevices.getUserMedia({
            video: hasVideo,
            audio: hasAudio,
         });

         if (hasVideo) {
            stream.getVideoTracks().forEach(track => {
               track.enabled = false;
            });
            setStreamParams(prev => ({ ...prev, isCameraOn: false }));
         }

         if (!hasVideo) {
            stream.addTrack(fakeVideoStream().getVideoTracks()[0]);
         }
         if (!hasAudio) {
            stream.addTrack(fakeAudioStream().getAudioTracks()[0]);
         } 

         setStreamParams(prev => ({ ...prev, mediaStream: stream }));

         if (videoRef.current) {
            videoRef.current.srcObject = stream;

            const player = videojs.getPlayer(videoRef.current);
            if (player) {
               player.tech_.setSource({
                  srcObject: stream,
               });
            }
         }

         return stream;
      } catch (error) {
         const fallbackStream = new MediaStream([...fakeVideoStream().getVideoTracks(), ...fakeAudioStream().getAudioTracks()]);

         fallbackStream.getVideoTracks()[0].enabled = false;
         setStreamParams(prev => ({ ...prev, isCameraOn: false, mediaStream: fallbackStream }));

         if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;

            const player = videojs.getPlayer(videoRef.current);
            if (player) {
               player.tech_.setSource({
                  srcObject: fallbackStream,
               });
            }
         }
         return fallbackStream;
      }
   };

   const options = {
      isLoading,
      setIsLoading,
      data,
      is_live: !!data?.stream?.is_live,
      setData,
      connections,
      setConnections,
      userInfo,
      authUser,
      isConnectEcho,

      streamId,
      initMediaStream,
      streamParams,
      setStreamParams,
      videoRef,
   };

   const streamActions = useStreamActions(options);
   const streamService = useStreamService(options);

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;

      const fetchStream = async () => {
         setIsLoading(true);

         await streamService.getInfoStream();
      };
      fetchStream();
   }, [userInfo]);

   useEffect(() => {
      if (!data) return;

      if (location.pathname.includes(SellerRoutesPath.stream.broadcaster)) {
         setIsLoading(false);
         return;
      }

      const connectStream = async () => {
         await streamService.connectToStream();
      };
      connectStream();
   }, [data?.stream?.id]);

   useEffect(() => {
      document.body.classList.add('overflow-hidden');
   }, []);

   return {
      ...options,
      ...streamActions,
      ...streamService,
   };
};
