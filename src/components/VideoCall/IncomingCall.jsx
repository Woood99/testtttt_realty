import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useVideoCall } from './hooks/useVideoCall';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import { getVideoCallInfo } from '@/redux';
import { ROLE_ADMIN } from '../../constants/roles';
import Spinner from '../../ui/Spinner';
import cn from 'classnames';
import VideoCallBtn from './VideoCallBtn';

import styles from './ChatVideoCall.module.scss';
import { IconCall, IconCallEnd, IconMicrophoneOff } from '../../ui/Icons';
import Avatar from '../../ui/Avatar';
import { capitalizeWords } from '../../helpers/changeString';
import UserPosition from '../../ui/UserPosition';
import { useRingtone } from './hooks/useRingtone';

import ringtoneMp3 from '../../assets/ringtone-1.mp3';
import VideoCallControls from './VideoCallControls';
import PartnerVideoPlug from './PartnerVideoPlug';
import UserVideoPlug from './UserVideoPlug';

const IncomingCall = () => {
   const { isReceivingCall } = useSelector(getVideoCallInfo);

   const [currentDialog, setCurrentDialog] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [videoCallData, setVideoCallData] = useState(null);

   useRingtone(isReceivingCall, ringtoneMp3);

   const {
      videoCallParams,
      userInfo,
      userVideoRef,
      partnerVideoRef,
      toggleScreenSharing,
      toggleCamera,
      toggleMuteAudio,
      getDialog,
      cancelCall,
      endCall,
      acceptCall,
      initialize,
      callAccepted,
      isLoadingAccept,
      isLoadingCancel,
      partnerVideoPlug,
      userVideoPlug,
   } = useVideoCall({
      currentDialog,
      setCurrentDialog,
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
      <ModalWrapper condition={(isReceivingCall && !isLoading) || callAccepted}>
         <Modal
            condition={(isReceivingCall && !isLoading) || callAccepted}
            closeBtnWhite={callAccepted}
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
                        <div className={cn(styles.userVideo, userVideoPlug && styles.userVideoPlug)}>
                           {userVideoPlug && <UserVideoPlug videoCallParams={videoCallParams} userInfo={userInfo} />}
                           <video
                              ref={userVideoRef}
                              muted
                              playsInline
                              autoPlay
                              className={cn('w-full h-full', userVideoPlug && 'absolute inset-0 opacity-0 invisible')}
                           />
                        </div>
                        <div className={cn(styles.partnerVideo, partnerVideoPlug && styles.partnerVideoPlug)}>
                           <video
                              ref={partnerVideoRef}
                              playsInline
                              autoPlay
                              className={cn('w-full h-full', partnerVideoPlug && 'absolute inset-0 opacity-0 invisible')}
                           />
                           {!partnerVideoPlug && !videoCallParams.statusCompanionMedia.audio && callAccepted && (
                              <div className="absolute top-6 left-6 flex items-center gap-2 text-red text-defaultMax">
                                 <IconMicrophoneOff width={32} height={32} className="fill-red" />
                                 <span>У собеседника выключен микрофон</span>
                              </div>
                           )}

                           {partnerVideoPlug && <PartnerVideoPlug currentDialog={currentDialog} videoCallParams={videoCallParams} />}
                        </div>
                     </div>
                  </div>
                  <VideoCallControls options={{ videoCallParams, toggleCamera, toggleScreenSharing, toggleMuteAudio, isLoadingCancel, endCall }} />
               </div>
               {!callAccepted && currentDialog?.companion && (
                  <div className="flex flex-col items-center relative">
                     <h3 className="title-2-5 !text-white mb-3 text-center">
                        <UserPosition role={currentDialog.companion.role} />
                        &nbsp;{capitalizeWords(currentDialog.companion.name, currentDialog.companion.surname)}
                     </h3>
                     <p className="text-defaultMax !text-white mb-6">Входящий звонок</p>

                     <Avatar size={160} src={currentDialog.companion.image} title={currentDialog.companion.name} />

                     <p className="!text-white text-center mb-8 mt-4 font-medium">
                        По умолчанию ваша камера будет выключена, <br />
                        Вы сможете включить её в ходе беседы
                     </p>
                     <div className="flex gap-8">
                        <VideoCallBtn onChange={cancelCall} isLoading={isLoadingCancel} className="!bg-red" childrenText="Отклонить">
                           <IconCallEnd width={24} height={24} className="fill-white" />
                        </VideoCallBtn>
                        <VideoCallBtn onChange={acceptCall} isLoading={isLoadingAccept} className="!bg-green" childrenText="Принять">
                           <IconCall width={28} height={28} className="fill-white" />
                        </VideoCallBtn>
                     </div>
                  </div>
               )}
            </div>
         </Modal>
         {(isLoadingAccept || isLoadingCancel) && !callAccepted && (
            <div className="absolute inset-0 z-[99999999] flex-center-all flex-col gap-6 bg-[rgba(0,0,0,0.8)]">
               <Spinner className="!border-white !border-b-[transparent] border-4" style={{ '--size': '90px' }} />
               <p className="text-big text-white">{isLoadingAccept ? 'Подключаемся...' : ''}</p>
            </div>
         )}
         {callAccepted && !videoCallParams.isConnect && (
            <div className="absolute inset-0 z-[99999999] flex-center-all flex-col gap-6 bg-[rgba(0,0,0,0.8)]">
               <Spinner className="!border-white !border-b-[transparent] border-4" style={{ '--size': '90px' }} />
               <p className="text-big text-white">Устанавливается соединение</p>
            </div>
         )}
      </ModalWrapper>
   );
};

export default IncomingCall;
