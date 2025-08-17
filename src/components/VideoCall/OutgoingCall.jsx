import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';

import Spinner from '../../ui/Spinner';
import { useVideoCall } from './hooks/useVideoCall';
import { ROLE_ADMIN } from '../../constants/roles';

import styles from './ChatVideoCall.module.scss';
import { IconInfoTooltip, IconMicrophoneOff } from '../../ui/Icons';
import { getVideoCallInfo } from '@/redux';
import { setIsCalling } from '../../redux/slices/videoCallSlice';
import UserPosition from '../../ui/UserPosition';
import Avatar from '../../ui/Avatar';
import { capitalizeWords } from '../../helpers/changeString';

import ringtoneMp3 from '../../assets/ringtone-2.mp3';
import { useRingtone } from './hooks/useRingtone';
import VideoCallControls from './VideoCallControls';
import PartnerVideoPlug from './PartnerVideoPlug';
import UserVideoPlug from './UserVideoPlug';

const OutgoingCall = () => {
   const { isCalling } = useSelector(getVideoCallInfo);

   const [currentDialog, setCurrentDialog] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   const dispatch = useDispatch();

   useRingtone(Boolean(isCalling && isCalling !== 'accept' && !isLoading && currentDialog), ringtoneMp3);

   const {
      videoCallParams,
      userInfo,
      placeVideoCall,
      userVideoRef,
      partnerVideoRef,
      toggleScreenSharing,
      toggleCamera,
      toggleMuteAudio,
      getDialog,
      endCall,
      callAccepted,
      isLoadingCancel,
      partnerVideoPlug,
      userVideoPlug,
   } = useVideoCall({
      currentDialog,
      setCurrentDialog,
   });

   useEffect(() => {
      if (isCalling === 'accept') {
         return;
      }
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
      <ModalWrapper condition={isCalling || callAccepted}>
         <Modal
            closeBtnWhite
            condition={isCalling || callAccepted}
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
                     <div className="absolute inset-0 flex-center-all bg-[#0e1319]">
                        <Spinner style={{ width: 65, height: 65 }} className="mx-auto !border-white !border-b-[transparent]" />
                     </div>
                  )}
                  {callAccepted && !videoCallParams.isConnect && <div className="title-2 !text-white">Подождите, идет установка соединения</div>}
                  <div className={cn(isLoading && 'opacity-0 invisible pointer-events-none')}>
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
               {!isLoading && (
                  <VideoCallControls options={{ videoCallParams, toggleCamera, toggleScreenSharing, toggleMuteAudio, isLoadingCancel, endCall }} />
               )}
               {!isLoading && !callAccepted && currentDialog?.companion && (
                  <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-dark rounded-2xl p-8 w-[400px] h-max">
                     <h3 className="text-bigSmall text-white font-medium mb-3 text-center">
                        <UserPosition role={currentDialog.companion.role} />
                        &nbsp;{capitalizeWords(currentDialog.companion.name, currentDialog.companion.surname)}
                     </h3>
                     <p className="text-defaultMax mb-6 text-white">Звоним...</p>

                     <Avatar size={160} src={currentDialog.companion.image} title={currentDialog.companion.name} />

                     <p className="bg-gray text-white px-4 py-3 rounded-lg mmd1:w-max text-center mt-4">
                        По умолчанию ваша камера будет выключена, <br />
                        Вы сможете включить её в ходе беседы
                     </p>
                  </div>
               )}
               {((callAccepted && !videoCallParams.isConnect) || videoCallParams.partnerConnectIsLoading) && (
                  <div className="absolute inset-0 z-[99999999] flex-center-all flex-col gap-6 bg-[rgba(0,0,0,0.8)]">
                     <Spinner className="!border-white !border-b-[transparent] border-4" style={{ '--size': '90px' }} />
                     <p className="text-big text-white">Устанавливается соединение</p>
                  </div>
               )}
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default OutgoingCall;
