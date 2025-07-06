import { useEffect, useRef, useState } from 'react';

export const useVideoHover = (shouldPlayOnHover = false) => {
   const [isPlaying, setIsPlaying] = useState(false);
   const [isReady, setIsReady] = useState(false);
   const videoRef = useRef(null);

   useEffect(() => {
      setTimeout(() => {
         setIsReady(true);
      }, 300);
   }, []);

   useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      if (isPlaying) {
         setTimeout(() => {
            video.currentTime = 0;
            video.play();
         }, 120);
      } else {
         setTimeout(() => {
            video.pause();
         }, 50);
      }
   }, [isPlaying]);

   const handleMouseEnter = () => {
      if (!isReady) return;
      if (!shouldPlayOnHover) return;
      if (isPlaying) return;
      setIsPlaying(true);
   };

   const handleMouseLeave = () => {
      if (!isReady) return;
      if (!shouldPlayOnHover) return;
      if (!isPlaying) return;
      setIsPlaying(false);
   };

   return { isPlaying, handleMouseEnter, handleMouseLeave, videoRef, isReady };
};
