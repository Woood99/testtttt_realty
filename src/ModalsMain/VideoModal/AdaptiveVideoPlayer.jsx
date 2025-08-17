import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import cn from 'classnames';

import 'video.js/dist/video-js.css';
import { IconPause, IconPlay } from '../../ui/Icons';

const AdaptiveVideoPlayer = ({ src, id }) => {
   const videoRef = useRef(null);
   const playerRef = useRef(null);
   const [isVertical, setIsVertical] = useState(false);
   const [isActivePanel, setIsActivePanel] = useState(true);
   const [isPaused, setIsPaused] = useState(true);

   useEffect(() => {
      if (!videoRef.current) return;

      const handlePlay = () => {
         setIsPaused(false);
      };
      const handlePause = () => setIsPaused(true);

      playerRef.current = videojs(videoRef.current, {
         controls: true,
         responsive: true,
         fluid: true,
         html5: {
            nativeControlsForTouch: false,
            nativeFullscreen: false,
         },
         userActions: {
            doubleClick: false,
         },
      });

      const player = playerRef.current;
      console.log(player);

      player.on('loadedmetadata', () => {
         player.volume(0.3);

         const videoWidth = player.videoWidth();
         const videoHeight = player.videoHeight();
         const aspectRatio = videoWidth / videoHeight;

         const vertical = aspectRatio < 0.8;
         setIsVertical(vertical);
      });

      player.on('play', handlePlay);
      player.on('pause', handlePause);

      player.on('dblclick', () => {
         playerRef.current.pause();
      });

      player.on('useractive', function () {
         setIsActivePanel(true);
      });

      player.on('userinactive', function () {
         setIsActivePanel(false);
      });

      player.on('touchstart', e => {
         const startX = e.touches[0].clientX;
         const startY = e.touches[0].clientY;

         const handleTouchEnd = e => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const isClick = Math.abs(endX - startX) < 5 && Math.abs(endY - startY) < 5;

            if (isClick && playerRef.current) {
               if (playerRef.current.paused()) {
                  playerRef.current.play();
               } else {
                  playerRef.current.pause();
               }
            }

            player.off('touchend', handleTouchEnd);
         };

         player.on('touchend', handleTouchEnd);
      });

      return () => {
         if (playerRef.current) {
            playerRef.current.dispose();
         }
      };
   }, []);

   return (
      <div
         id={id}
         className={cn(
            'rounded-xl video-player adaptive-video-playe !w-full !h-full !max-w-fit md1:!max-w-fit flex items-center',
            isVertical ? 'w-full !max-w-[330px] md1:!max-w-[300px] aspect-shorts' : 'aspect-video'
         )}>
         <video ref={videoRef} src={src} className="video-js w-full h-full" playsInline />
         {(isActivePanel || isPaused) && (
            <button
               type="button"
               className={cn(
                  'pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[9]'
               )}>
               {isPaused ? <IconPlay className="fill-white" width={46} height={46} /> : <IconPause className="fill-white" width={46} height={46} />}
            </button>
         )}
      </div>
   );
};

export default AdaptiveVideoPlayer;
