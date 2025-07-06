import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import styles from './Story.module.scss';
import { useStory } from './useStory';
import { IconPlay } from '../../ui/Icons';

const Story = ({ videoUrl, onComplete, className, size = 120 }) => {
   const { isPlaying, togglePlay, videoRef, radius, circumference, strokeDashoffset, playIconSize } = useStory({ videoUrl, onComplete, size });

   return (
      <div className={cn(styles.container, isPlaying && styles.playing, className)} style={{ width: size, height: size }} onClick={togglePlay}>
         <div className={styles.videoWrapper}>
            <video ref={videoRef} src={videoUrl} className={styles.video} loop={false} playsInline preload="metadata" />

            <svg className={styles.progressRing} width={size} height={size}>
               <circle
                  className={styles.progressCircle}
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
               />
            </svg>
         </div>

         {!isPlaying && (
            <div
               className={styles.playIcon}
               style={{
                  width: `${playIconSize}px`,
                  height: `${playIconSize}px`,
               }}>
               <IconPlay width={playIconSize * 0.4} height={playIconSize * 0.4} className="fill-white" />
            </div>
         )}
      </div>
   );

};

export default Story;
