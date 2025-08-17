import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { VideoCallContext } from '../../context';

import VideoCallBtn from './VideoCallBtn';

import styles from './ChatVideoCall.module.scss';
import { IconCallEnd, IconMicrophone, IconMicrophoneOff, IconMonitor, IconСamcorder, IconСamcorderOff } from '../../ui/Icons';

import { getIsDesktop } from '@/redux';

const VideoCallControls = ({ options }) => {
   const { setIsOpenModalCameraNotFound, setIsOpenModalMicrophoneNotFound } = useContext(VideoCallContext);
   const { videoCallParams, toggleCamera, toggleScreenSharing, toggleMuteAudio, isLoadingCancel, endCall } = options;
   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className={styles.actionBtns}>
         <VideoCallBtn
            isLoading={!videoCallParams.callAccepted}
            onChange={() => {
               if (videoCallParams.hasVideo) {
                  toggleCamera(!videoCallParams.mutedCamera);
               } else {
                  setIsOpenModalCameraNotFound(true);
               }
            }}
            className={`${videoCallParams.mutedCamera || !videoCallParams.hasVideo ? styles.actionBtnActiveRed : ''}`}
            childrenText={videoCallParams.mutedCamera ? 'Вкл. камеру' : 'Выкл. камеру'}>
            {videoCallParams.mutedCamera || !videoCallParams.hasVideo ? (
               <IconСamcorderOff width={24} height={24} />
            ) : (
               <IconСamcorder className={`stroke-white stroke-[2px] !fill-none`} width={24} height={24} />
            )}
         </VideoCallBtn>
         {isDesktop && (
            <VideoCallBtn
               isLoading={!videoCallParams.callAccepted}
               onChange={() => toggleScreenSharing(!videoCallParams.mutedScreenSharing)}
               className={`${!videoCallParams.mutedScreenSharing ? styles.actionBtnActiveBlue : ''}`}
               childrenText={videoCallParams.mutedScreenSharing ? 'Вкл. показ экрана' : 'Выкл. показ экрана'}>
               <IconMonitor width={24} height={24} className="fill-white" />
            </VideoCallBtn>
         )}

         <VideoCallBtn
            isLoading={!videoCallParams.callAccepted}
            onChange={() => {
               if (videoCallParams.hasAudio) {
                  toggleMuteAudio();
               } else {
                  setIsOpenModalMicrophoneNotFound(true);
               }
            }}
            className={`${videoCallParams.mutedAudio || !videoCallParams.hasAudio ? styles.actionBtnActiveRed : ''}`}
            childrenText={videoCallParams.mutedAudio ? 'Вкл. микрофон' : 'Выкл. микрофон'}>
            {videoCallParams.mutedAudio || !videoCallParams.hasAudio ? (
               <IconMicrophoneOff width={24} height={24} />
            ) : (
               <IconMicrophone width={24} height={24} className="stroke-white !fill-none" />
            )}
         </VideoCallBtn>
         <VideoCallBtn onChange={endCall} className="!bg-red" isLoading={isLoadingCancel} childrenText="Завершить">
            <IconCallEnd width={24} height={24} className="fill-white" />
         </VideoCallBtn>
      </div>
   );
};

export default VideoCallControls;
