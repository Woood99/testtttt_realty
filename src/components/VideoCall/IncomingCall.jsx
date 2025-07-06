import { useDispatch, useSelector } from 'react-redux';
import { setIsReceivingCall } from '../../redux/slices/videoCallSlice';
import { useContext, useEffect, useState } from 'react';
import { VideoCallContext } from '../../context';
import { useVideoCall } from './hooks/useVideoCall';
import { useVideoCallService } from './hooks/useVideoCallService';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { getHelpSliceSelector, getIsDesktop, getVideoCallInfo } from '../../redux/helpers/selectors';
import { ROLE_ADMIN } from '../../constants/roles';
import Spinner from '../../ui/Spinner';
import cn from 'classnames';
import VideoCallBtn from './VideoCallBtn';

import styles from './ChatVideoCall.module.scss';
import { IconCall, IconCallEnd, IconInfoTooltip, IconMicrophone, IconMicrophoneOff, IconMonitor, IconСamcorder } from '../../ui/Icons';
import Avatar from '../../ui/Avatar';
import { capitalizeWords } from '../../helpers/changeString';
import UserPosition from '../../ui/UserPosition';

const IncomingCall = () => {
   const { isReceivingCall } = useSelector(getVideoCallInfo);

   const dispatch = useDispatch();
   const [currentDialog, setCurrentDialog] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const isDesktop = useSelector(getIsDesktop);
   const [videoCallData, setVideoCallData] = useState(null);

   const {
      videoCallParams,
      userInfo,
      placeVideoCall,
      userVideoRef,
      partnerVideoRef,
      toggleCameraArea,
      toggleScreenSharing,
      toggleCamera,
      toggleMuteAudio,
      getDialog,
      cancelCall,
      endCall,
      acceptCall,
      initialize,
      callAccepted,
   } = useVideoCall({
      currentDialog,
      setCurrentDialog,
      isReceivingCall,
   });

   useEffect(() => {
      if (!isReceivingCall) return;
      setVideoCallData(isReceivingCall);
      getDialog(isReceivingCall.dialog_id).then(dialog => {
         const isOrganization = dialog.organization && userInfo?.role?.id !== ROLE_ADMIN.id;

         setCurrentDialog({
            ...dialog,
            isOrganization,
            organization: isReceivingCall.organization,
            companion: isReceivingCall.user,
         });
      });
   }, [isReceivingCall]);

   useEffect(() => {
      if (!videoCallData) return;
      if (!currentDialog?.id) return;
      const initFn = async () => {
         initialize(videoCallData);

         await new Promise(resolve => setTimeout(resolve, 300));

         setIsLoading(false);
      };
      initFn();
   }, [currentDialog?.id, videoCallData]);

   return (
      <ModalWrapper condition={isReceivingCall && !isLoading}>
         <Modal
            condition={isReceivingCall && !isLoading}
            set={async () => {
               await endCall();
            }}
            options={{
               overlayClassNames: cn('!z-[10000]', !callAccepted ? '_center-max-content' : '_full'),
               modalContentClassNames: cn(callAccepted && '!bg-transparent !p-0'),
               modalClassNames: cn(!callAccepted && styles.VideoCallIncomingCallModal),
               modalCloseIconClassNames: cn(!callAccepted && '!fill-white'),
            }}>
            <div className={cn('w-full h-full')}>
               <div className={cn('relative w-full h-full', !callAccepted && 'hidden')}>
                  <div className={cn(styles.ChatVideoCallContainer, styles.ChatVideoCallActiveContainer)}>
                     {isLoading && (
                        <div className="absolute inset-0 flex-center-all bg-[#e3efff]">
                           <Spinner className="mx-auto" />
                        </div>
                     )}
                     <div>
                        <div
                           className={cn(
                              videoCallParams.isFocusMySelf ? styles.userVideo : styles.partnerVideo,
                              videoCallParams.callPartner && styles.ChatVideoBg
                           )}>
                           {!videoCallParams.statusMedia.video && (
                              <div className={`${styles.videoEmpty} gap-2`}>
                                 <IconInfoTooltip className="stroke-white" width={24} height={24} />
                                 Вы не передаёте видео
                              </div>
                           )}
                           <video ref={userVideoRef} muted playsInline autoPlay className="w-full h-full" onClick={toggleCameraArea} />
                        </div>
                        <div
                           className={cn(
                              videoCallParams.isFocusMySelf ? styles.partnerVideo : styles.userVideo,
                              videoCallParams.callPartner && styles.ChatVideoBg
                           )}>
                           <video ref={partnerVideoRef} playsInline autoPlay className="w-full h-full" onClick={toggleCameraArea} />
                        </div>
                     </div>
                  </div>
                  <div className={styles.actionBtns}>
                     <VideoCallBtn
                        onChange={() => toggleCamera(videoCallParams.mutedCamera)}
                        className={`${videoCallParams.mutedCamera ? '!bg-[#a8c7fa]' : ''}`}
                        childrenText={videoCallParams.mutedCamera ? 'Выкл. камеру' : 'Вкл. камеру'}>
                        <IconСamcorder className={`stroke-white stroke-[2px] !fill-none ${videoCallParams.mutedCamera ? '!stroke-dark' : ''}`} />
                     </VideoCallBtn>
                     {isDesktop && (
                        <VideoCallBtn
                           onChange={() => toggleScreenSharing(videoCallParams.mutedScreenSharing)}
                           className={`${videoCallParams.mutedScreenSharing ? styles.actionBtnActiveBlue : ''}`}
                           childrenText={videoCallParams.mutedScreenSharing ? 'Выкл. показ экрана' : 'Вкл. показ экрана'}>
                           <IconMonitor width={24} height={24} className="fill-white" />
                        </VideoCallBtn>
                     )}

                     <VideoCallBtn
                        onChange={toggleMuteAudio}
                        className={`${videoCallParams.mutedAudio ? styles.actionBtnActiveRed : ''}`}
                        childrenText={videoCallParams.mutedAudio ? 'Вкл. микрофон' : 'Выкл. микрофон'}>
                        {videoCallParams.mutedAudio ? (
                           <IconMicrophoneOff width={24} height={24} />
                        ) : (
                           <IconMicrophone width={24} height={24} className="stroke-white !fill-none" />
                        )}
                     </VideoCallBtn>
                     <VideoCallBtn onChange={endCall} className="!bg-red" childrenText="Завершить">
                        <IconCallEnd width={24} height={24} className="fill-white" />
                     </VideoCallBtn>
                  </div>
               </div>
               {!callAccepted && currentDialog?.companion && (
                  <div className="flex flex-col items-center">
                     <h3 className="title-2-5 !text-white mb-3 text-center">
                        <UserPosition role={currentDialog.companion.role} />
                        {capitalizeWords(currentDialog.companion.name, currentDialog.companion.surname)}
                     </h3>
                     <p className="text-defaultMax !text-white mb-6">Входящий звонок</p>

                     <Avatar size={160} src={currentDialog.companion.image} title={currentDialog.companion.name} />

                     <p className="!text-white text-center mb-8 mt-4">
                        По умолчанию ваша камера будет выключена, <br />
                        Вы сможете включить её в ходе беседы
                     </p>
                     <div className="flex gap-8">
                        <VideoCallBtn onChange={cancelCall} className="!bg-red" childrenText="Отклонить">
                           <IconCallEnd width={24} height={24} className="fill-white" />
                        </VideoCallBtn>
                        <VideoCallBtn onChange={acceptCall} className="!bg-green" childrenText="Принять">
                           <IconCall width={28} height={28} className="fill-white" />
                        </VideoCallBtn>
                     </div>
                  </div>
               )}
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default IncomingCall;
