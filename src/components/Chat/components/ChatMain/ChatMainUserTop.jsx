import { useContext, useState } from 'react';
import cn from 'classnames';
import { ChatContext } from '../../../../context';
import UserInfo from '../../../../ui/UserInfo';
import isEmptyArrObj from '../../../../helpers/isEmptyArrObj';
import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import { getShortNameSurname } from '../../../../helpers/changeString';
import { RoutesPath } from '../../../../constants/RoutesPath';
import { CHAT_TYPES } from '../../constants';
import { IconEllipsis, IconСamcorder } from '../../../../ui/Icons';
import { declensionParticipant } from '../../../../helpers/declensionWords';
import { ChatTooltipDialog } from '..';
import Button from '../../../../uiForm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getIsDesktop, getVideoCallInfo } from '../../../../redux/helpers/selectors';
import { setIsCalling } from '../../../../redux/slices/videoCallSlice';

const ChatMainUserTop = () => {
   const { videoCallDelayTimer } = useSelector(getVideoCallInfo);

   const {
      currentDialog,
      currentDialogUserInfo,
      isLoadingDialog,
      setCurrentDialogSettings,
      setChannelGroupInfoModal,
      isVisibleVideoCall,
   } = useContext(ChatContext);

   const isDesktop = useSelector(getIsDesktop);
   const dispatch = useDispatch();

   const [showPopperSettings, setShowPopperSettings] = useState(false);

   if (isLoadingDialog) {
      return (
         <div className="flex items-center gap-3">
            <WebSkeleton className="w-[38px] h-[38px] rounded-full" />
            <WebSkeleton className="w-[150px] h-8 rounded-lg" />
         </div>
      );
   }

   if (isEmptyArrObj(currentDialog)) return;

   const channelOrGroup = currentDialog.dialog_type === CHAT_TYPES.CHANNEL || currentDialog.dialog_type === CHAT_TYPES.GROUP;

   return (
      <>
         <UserInfo
            className={cn('min-w-0 mr-4', channelOrGroup && 'cursor-pointer')}
            onClick={() => {
               if (channelOrGroup) {
                  setCurrentDialogSettings(currentDialog);
                  setChannelGroupInfoModal(true);
               }
            }}
            avatar={currentDialogUserInfo.image}
            name={getShortNameSurname(currentDialogUserInfo.name, currentDialogUserInfo.surname)}
            pos={
               <>
                  {(currentDialog.dialog_type === CHAT_TYPES.CHANNEL || currentDialog.dialog_type === CHAT_TYPES.GROUP) && (
                     <>{declensionParticipant(currentDialog.companions.length + (currentDialog.owner ? 1 : 0))}</>
                  )}
               </>
            }
            centered
            nameHref={
               currentDialog.dialog_type === CHAT_TYPES.CHAT
                  ? `${
                       currentDialogUserInfo.isOrganization
                          ? `${RoutesPath.developers.inner}${currentDialogUserInfo.id}`
                          : `${RoutesPath.specialists.inner}${currentDialogUserInfo.id}`
                    }
                  `
                  : null
            }
         />
         <div className="ml-auto flex items-center gap-4">
            {isVisibleVideoCall && (
               <Button
                  isLoading={videoCallDelayTimer}
                  size="Small"
                  variant="secondary"
                  className="gap-3"
                  onClick={() => {
                     if (!currentDialogUserInfo) return;
                     dispatch(setIsCalling({ dialog_id: currentDialog.id, partnerInfo: currentDialogUserInfo }));
                  }}>
                  {isDesktop && 'Видеозвонок'}
                  <IconСamcorder className="stroke-blue stroke-[2px]" />
               </Button>
            )}

            <button className="flex-center-all">
               <ChatTooltipDialog
                  options={{
                     data: currentDialog,
                     showPopper: showPopperSettings,
                     setShowPopper: setShowPopperSettings,
                     ElementTargetLayout: <IconEllipsis className={cn('pointer-events-none rotate-90 fill-dark')} width={20} height={20} />,
                  }}
               />
            </button>
         </div>
      </>
   );
};

export default ChatMainUserTop;
