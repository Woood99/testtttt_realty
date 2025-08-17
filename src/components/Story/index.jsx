import React, { memo, useRef } from 'react';
import cn from 'classnames';
import styles from './Story.module.scss';
import { useStory } from './useStory';
import { IconPlay, IconVolumeOff } from '@/ui/Icons';
import { Maybe } from '@/ui';

const Story = ({ videoUrl, onComplete, className, size = 120, refElement }) => {
   const videoRef = refElement || useRef(null);

   const { isPlaying, togglePlay, radius, circumference, strokeDashoffset, playIconSize } = useStory({ videoUrl, onComplete, size, videoRef });

   return (
      <div className={cn(styles.container, isPlaying && styles.playing, className)} style={{ width: size, height: size }} onClick={togglePlay}>
         <div className={styles.videoWrapper}>
            <Maybe condition={videoRef.current?.muted}>
               <div className="bg-[rgba(0,0,0,0.37)] text-[12px] absolute left-1/2 -translate-x-1/2 top-2 h-6 flex items-center rounded-xl px-3">
                  <IconVolumeOff className="stroke-white" width={18} height={18} />
               </div>
            </Maybe>

            <video ref={videoRef} src={videoUrl} className={styles.video} muted playsInline />

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

export default memo(Story);
