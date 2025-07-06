import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';

import Spinner from '../../ui/Spinner';
import { useVideoCall } from './hooks/useVideoCall';
import { ROLE_ADMIN } from '../../constants/roles';
import VideoCallBtn from './VideoCallBtn';

import styles from './ChatVideoCall.module.scss';
import { IconCallEnd, IconInfoTooltip, IconMicrophone, IconMicrophoneOff, IconMonitor, IconСamcorder } from '../../ui/Icons';
import { getIsDesktop, getVideoCallInfo } from '../../redux/helpers/selectors';
import { setIsCalling } from '../../redux/slices/videoCallSlice';
import UserPosition from '../../ui/UserPosition';
import Avatar from '../../ui/Avatar';
import { capitalizeWords } from '../../helpers/changeString';

const OutgoingCall = () => {
   const { isCalling } = useSelector(getVideoCallInfo);

   const [currentDialog, setCurrentDialog] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const isDesktop = useSelector(getIsDesktop);

   const dispatch = useDispatch();

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
      endCall,
      callAccepted,
   } = useVideoCall({
      currentDialog,
      setCurrentDialog,
      isCalling,
   });

   useEffect(() => {
      if (!isCalling.dialog_id || !isCalling.partnerInfo) {
         setCurrentDialog(null);
         setIsLoading(false);
         dispatch(setIsCalling(false));

         return;
      }
      setIsLoading(true);

      getDialog(isCalling.dialog_id).then(dialog => {
         const isOrganization = dialog.organization && userInfo?.role?.id !== ROLE_ADMIN.id;

         setCurrentDialog({
            ...dialog,
            isOrganization,
            companion: isCalling.partnerInfo,
         });
      });
   }, [isCalling]);

   useEffect(() => {
      if (!currentDialog?.id) return;
      const initFn = async () => {
         await placeVideoCall(currentDialog.companion);
         await new Promise(resolve => setTimeout(resolve, 750));

         setIsLoading(false);
      };
      initFn();
   }, [currentDialog?.id]);

   return (
      <ModalWrapper condition={isCalling}>
         <Modal
            closeBtnWhite
            condition={isCalling}
            set={async () => {
               if (videoCallParams.peer1 || videoCallParams.peer2) {
                  await endCall();
               }
            }}
            options={{
               overlayClassNames: `_full !z-[10000]`,
               modalContentClassNames: '!bg-transparent !p-0',
            }}>
            <div className={cn('relative w-full h-full', isLoading && 'flex-center-all')}>
               <div className={cn(styles.ChatVideoCallContainer, !isLoading && styles.ChatVideoCallActiveContainer)}>
                  {isLoading && (
                     <div className="absolute inset-0 flex-center-all bg-[#e3efff]">
                        <Spinner className="mx-auto" />
                     </div>
                  )}
                  <div className={cn(isLoading && 'opacity-0 invisible pointer-events-none')}>
                     <div
                        className={cn(
                           videoCallParams.isFocusMySelf ? styles.userVideo : styles.partnerVideo,
                           !videoCallParams.callAccepted && styles.videoNone,
                           videoCallParams.callPartner && styles.ChatVideoBg
                        )}>
                        {!videoCallParams.statusMedia.video && videoCallParams.callAccepted && (
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
               {!isLoading && (
                  <div className={styles.actionBtns}>
                     {videoCallParams.callAccepted && (
                        <>
                           <VideoCallBtn
                              onChange={() => toggleCamera(videoCallParams.mutedCamera)}
                              className={`${videoCallParams.mutedCamera ? '!bg-[#a8c7fa]' : ''}`}
                              childrenText={videoCallParams.mutedCamera ? 'Выкл. камеру' : 'Вкл. камеру'}>
                              <IconСamcorder
                                 className={`stroke-white stroke-[2px] !fill-none ${videoCallParams.mutedCamera ? '!stroke-dark' : ''}`}
                              />
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
                        </>
                     )}
                     <VideoCallBtn onChange={endCall} className="!bg-red" childrenText="Завершить">
                        <IconCallEnd width={24} height={24} className="fill-white" />
                     </VideoCallBtn>
                  </div>
               )}
               {!isLoading && !callAccepted && currentDialog?.companion && (
                  <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 white-block w-[400px] h-max">
                     <h3 className="title-2-5 mb-3 text-center">
                        <UserPosition role={currentDialog.companion.role} />&nbsp;
                        {capitalizeWords(currentDialog.companion.name, currentDialog.companion.surname)}
                     </h3>
                     <p className="text-defaultMax mb-6">Звоним...</p>

                     <Avatar size={160} src={currentDialog.companion.image} title={currentDialog.companion.name} />

                     <p className="bg-primary700 px-4 py-3 rounded-lg mmd1:w-max text-center mt-4">
                        По умолчанию ваша камера будет выключена, <br />
                        Вы сможете включить её в ходе беседы
                     </p>
                  </div>
               )}
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default OutgoingCall;
