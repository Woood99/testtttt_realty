import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserInfo } from '@/redux';
import { useChatCallPeerConnection } from './useChatCallPeerConnection';
import { useVideoCallActions } from './useVideoCallActions';
import { useVideoCallService } from './useVideoCallService';
import { videoCallParamsDefault } from '../helpers/videoCallParamsDefault';

export const useVideoCall = dataOptions => {
   const { currentDialog, setCurrentDialog } = dataOptions;
   const userInfo = useSelector(getUserInfo);

   const userVideoRef = useRef(null);
   const partnerVideoRef = useRef(null);

   const [videoCallParams, setVideoCallParams] = useState(videoCallParamsDefault);

   const [isLoadingAccept, setIsLoadingAccept] = useState(false);
   const [isLoadingCancel, setIsLoadingCancel] = useState(false);

   const options = {
      videoCallParams,
      setVideoCallParams,
      userVideoRef,
      partnerVideoRef,
      userInfo: { ...userInfo, organization: currentDialog?.isOrganization ? currentDialog?.organization : null },
      authuserid: userInfo?.id,
      currentDialog,
      setCurrentDialog,
      callAccepted: videoCallParams.callAccepted,
      isLoadingAccept,
      setIsLoadingAccept,
      isLoadingCancel,
      setIsLoadingCancel,
      partnerVideoPlug:
         !videoCallParams.statusCompanionMedia.video && !videoCallParams.statusCompanionMedia.screenSharing && videoCallParams.callAccepted,
      userVideoPlug: !videoCallParams.statusMedia.video && !videoCallParams.statusMedia.screenSharing,
   };

   const chatVideoCallActions = useVideoCallActions({ ...options });
   const videoCallPeerConnection = useChatCallPeerConnection({ ...options, ...chatVideoCallActions });
   const chatVideoCallService = useVideoCallService({ ...options, ...chatVideoCallActions, ...videoCallPeerConnection });

   return {
      ...options,
      ...videoCallPeerConnection,
      ...chatVideoCallActions,
      ...chatVideoCallService,
   };
};
