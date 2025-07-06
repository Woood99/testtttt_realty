import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../../redux/helpers/selectors';
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

   const [isOpenModalEndCall, setIsOpenModalEndCall] = useState(false);
   const [isOpenModalCancelCall, setIsOpenModalCancelCall] = useState(false);

   const options = {
      videoCallParams,
      setVideoCallParams,
      isOpenModalEndCall,
      setIsOpenModalEndCall,
      isOpenModalCancelCall,
      setIsOpenModalCancelCall,
      userVideoRef,
      partnerVideoRef,
      userInfo,
      authuserid: userInfo?.id,
      currentDialog,
      setCurrentDialog,
      callAccepted: videoCallParams.callAccepted,
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
