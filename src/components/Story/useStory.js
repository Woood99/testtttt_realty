import { useState, useEffect, useRef } from 'react';

export const useStory = options => {
   const { videoUrl, onComplete, size, videoRef } = options;

   const [progress, setProgress] = useState(0);
   const [isPlaying, setIsPlaying] = useState(false);

   const radius = size / 2 - 1;
   const circumference = 2 * Math.PI * radius;
   const strokeDashoffset = circumference - (progress / 100) * circumference;
   const playIconSize = size * 0.22;

   const togglePlay = () => {
      if (isPlaying && !videoRef.current.muted) {
         videoRef.current.pause();
         setIsPlaying(false);
      } else {
         videoRef.current.play();
         videoRef.current.muted = false;
         videoRef.current.volume = 0.2;
         setIsPlaying(true);
      }
   };

   useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => {
         if (video.duration) {
            setProgress((video.currentTime / video.duration) * 100);
         }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
         onComplete?.();
         video.currentTime = 0;
         video.play();
         video.muted = true;
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
         video.removeEventListener('timeupdate', handleTimeUpdate);
         video.removeEventListener('ended', handleEnded);
         video.removeEventListener('play', handlePlay);
         video.removeEventListener('pause', handlePause);
      };
   }, [videoUrl, onComplete]);

   return { isPlaying, togglePlay, videoRef, radius, circumference, strokeDashoffset, playIconSize };
};
