import { useState, useEffect, useRef } from 'react';

export const useStory = options => {
   const { videoUrl, onComplete, size } = options;

   const [progress, setProgress] = useState(0);
   const [isPlaying, setIsPlaying] = useState(false);
   const videoRef = useRef(null);

   const radius = size / 2 - 1;
   const circumference = 2 * Math.PI * radius;
   const strokeDashoffset = circumference - (progress / 100) * circumference;
   const playIconSize = size * 0.22;

   const togglePlay = () => {
      if (isPlaying) {
         videoRef.current.pause();
      } else {
         videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
   };

   useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => {
         if (video.duration) {
            setProgress((video.currentTime / video.duration) * 100);
         }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', () => {
         onComplete?.();
         setIsPlaying(false);
      });

      return () => {
         video.removeEventListener('timeupdate', handleTimeUpdate);
         video.removeEventListener('ended', () => onComplete?.());
      };
   }, [videoUrl, onComplete]);

   return { isPlaying, togglePlay, videoRef, radius, circumference, strokeDashoffset, playIconSize };
};
