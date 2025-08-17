import { useEffect, useRef, useState } from 'react';

export const useVideoHover = (shouldPlayOnHover = false) => {
   const [isPlaying, setIsPlaying] = useState(false);
   const [isReady, setIsReady] = useState(false);
   const [isVideoLoaded, setIsVideoLoaded] = useState(false);
   const [isFirstHover, setIsFirstHover] = useState(true);
   const videoRef = useRef(null);

   useEffect(() => {
      const video = videoRef.current;
      if (!video || !isPlaying) return;

      const handleCanPlay = () => {
         video.play().catch(e => console.error('Video play failed:', e));
         setIsVideoLoaded(true);
      };

      if (isFirstHover) {
         video.addEventListener('canplay', handleCanPlay);
         video.load();
         setIsFirstHover(false);
      } else {
         video.currentTime = 0;
         video.play().catch(e => console.error('Video play failed:', e));
      }

      return () => {
         video.removeEventListener('canplay', handleCanPlay);
      };
   }, [isPlaying, isFirstHover]);

   const handleMouseEnter = () => {
      if (!isReady || !shouldPlayOnHover) return;
      setIsPlaying(true);
   };

   const handleMouseLeave = () => {
      if (!isReady || !shouldPlayOnHover) return;
      setIsPlaying(false);
   };

   useEffect(() => {
      const timer = setTimeout(() => setIsReady(true), 300);
      return () => clearTimeout(timer);
   }, []);

   return { isPlaying, handleMouseEnter, handleMouseLeave, videoRef, isFirstHover };
};
