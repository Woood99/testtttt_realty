import { useContext } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';

import { StreamContext } from '../../context';
import { IconMicrophone, IconMicrophoneOff, IconMonitor, IconСamcorder } from '../../ui/Icons';
import { getIsDesktop } from '@/redux';
import StreamControlsButton from './StreamControlsButton';

const StreamControls = () => {
   const { isVisibleControls, toggleScreenSharing, toggleCamera, toggleMicrophone, streamParams } = useContext(StreamContext);
   const isDesktop = useSelector(getIsDesktop);

   if (!isVisibleControls) return;

   return (
      <div className="flex items-center gap-3">
         <StreamControlsButton onClick={toggleCamera} active={streamParams.isCameraOn} childrenText={['Вкл. камеру', 'Выкл. камеру']}>
            <IconСamcorder className={cn('stroke-white stroke-[2px] !fill-none', streamParams.isCameraOn && '!stroke-dark')} />
         </StreamControlsButton>
         {isDesktop && (
            <StreamControlsButton
               onClick={toggleScreenSharing}
               active={streamParams.isScreenSharing}
               childrenText={['Вкл. показ экрана', 'Выкл. показ экрана']}>
               <IconMonitor width={24} height={24} className="fill-white" />
            </StreamControlsButton>
         )}
         <StreamControlsButton
            onClick={toggleMicrophone}
            variant="red"
            active={streamParams.isMicMuted}
            childrenText={['Выкл. микрофон', 'Вкл. микрофон']}>
            {streamParams.isMicMuted ? (
               <IconMicrophoneOff width={24} height={24} />
            ) : (
               <IconMicrophone width={24} height={24} className="stroke-white !fill-none" />
            )}
         </StreamControlsButton>
      </div>
   );
};

export default StreamControls;
