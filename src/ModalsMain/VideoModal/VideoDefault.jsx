import { useRef } from 'react';
import cn from 'classnames';
import { IconVolumeOff } from '@/ui/Icons';

const VideoDefault = ({ src, className, onClick, refElement }) => {
   const videoRef = refElement || useRef(null);

   return (
      <div onClick={onClick} className={cn('w-full h-full', className)}>
         <div className="bg-[rgba(0,0,0,0.37)] text-[12px] absolute left-2 top-2 h-6 flex items-center rounded-xl px-3">
            <IconVolumeOff className="stroke-white" width={18} height={18} />
         </div>
         <video ref={videoRef} src={src} muted className="w-full h-full" loop playsInline />
      </div>
   );
};

export default VideoDefault;
