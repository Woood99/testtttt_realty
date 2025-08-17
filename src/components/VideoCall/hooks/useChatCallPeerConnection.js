import SimplePeer from 'simple-peer';
import { useDispatch } from 'react-redux';
import useSound from 'use-sound';
import { useContext } from 'react';

import { getPermissions, sendMediaState, updateUI } from '../helpers/chatVideoCallHelpers';
import { sendPostRequest } from '../../../api/requestsApi';
import { videoCallParamsDefault } from '../helpers/videoCallParamsDefault';
import { setIsCalling, setIsReceivingCall, setVideoCallDelayTimer } from '../../../redux/slices/videoCallSlice';
import { checkMediaDevices, settingsIceServersPeer } from '../../../helpers/mediaStreamUtils';

import screenShareSound from '../../../assets/ringtone-4.mp3';
import { VideoCallContext } from '../../../context';

export const useChatCallPeerConnection = options => {
   const { authuserid, currentDialog, userVideoRef, partnerVideoRef, videoCallParams, setVideoCallParams, setIsLoadingAccept, setIsLoadingCancel } =
      options;

   const { setModalError } = useContext(VideoCallContext);

   const [playScreenShareSound] = useSound(screenShareSound, { volume: 0.5 });
   const dispatch = useDispatch();

   const initialize = async (videoCallData = null) => {
      const channel = window.Echo.join(`video-dialog.${currentDialog.id}`);
      const { hasVideo, hasAudio } = await checkMediaDevices();
      await new Promise(resolve => setTimeout(resolve, 300));
      setVideoCallParams(prev => ({ ...prev, channel, hasVideo, hasAudio, mutedAudio: !hasAudio }));

      channel.here(users => {
         setVideoCallParams(prev => ({ ...prev, users }));
      });

      channel.joining(user => {
         setVideoCallParams(prev => {
            const joiningUserIndex = prev.users.findIndex(data => data === user);
            if (joiningUserIndex < 0) {
               return {
                  ...prev,
                  users: [...prev.users, user],
               };
            }
            return prev;
         });
      });

      channel.leaving(user => {
         setVideoCallParams(prev => {
            const leavingUserIndex = prev.users.findIndex(data => data === user);
            return {
               ...prev,
               users: prev.users.filter((_, index) => index !== leavingUserIndex),
            };
         });
      });

      channel.listen('VideoDialogEvent', ({ data }) => {
         if (data.type === 'incomingCall') {
            setVideoCallParams(prev => ({
               ...prev,
               receivingCall: true,
               caller: data.from,
               callerSignal: {
                  ...data.signalData,
                  sdp: `${data.signalData.sdp}\n`,
               },
            }));
         }
         if (data.type === 'callAccepted') {
            dispatch(setIsReceivingCall(false));
         }
         if (data.type === 'callCanceled') {
            dispatch(setIsReceivingCall(false));
            reset();
         }
      });

      if (videoCallData && videoCallData.type === 'incomingCall') {
         setVideoCallParams(prev => ({
            ...prev,
            receivingCall: true,
            caller: videoCallData.from,
            callerSignal: {
               ...videoCallData.signalData,
               sdp: `${videoCallData.signalData.sdp}\n`,
            },
         }));
      }
      await new Promise(resolve => setTimeout(resolve, 100));

      return channel;
   };

   const placeVideoCall = async partnerInfo => {
      if (videoCallParams.peer1 || videoCallParams.peer2) {
         reset();
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      const channel = await initialize();
      await new Promise(resolve => setTimeout(resolve, 750));

      setVideoCallParams(prev => ({ ...prev, callPlaced: true, callPartner: partnerInfo }));

      const { stream, statuses } = await getPermissions(userVideoRef, 'getUserMedia', value => {
         setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
      });

      const peer1 = new SimplePeer({
         initiator: true,
         trickle: false,
         stream: stream,
         config: {
            iceServers: settingsIceServersPeer,
         },
      });

      peer1.on('data', data => {
         try {
            const message = JSON.parse(data);
            if (message.type === 'mediaState') {
               updateUI(message.video, message.audio, message.screenSharing, value => {
                  setVideoCallParams(prev => ({ ...prev, statusCompanionMedia: value }));
               });
            }
            if (message.type === 'screen-share-start') {
               playScreenShareSound();
            }
         } catch (error) {
            console.error('Ошибка при обработке сообщения:', error);
         }
      });

      setVideoCallParams(prev => ({ ...prev, receivingCall: false, peer1 }));

      peer1.on('signal', data => {
         sendPostRequest('/api/video/call-user', {
            user_to_call: partnerInfo.id,
            signal_data: data,
            from: authuserid,
            dialog_id: currentDialog.id,
         })
            .then(() => {})
            .catch(err => {});
      });

      peer1.on('stream', remoteStream => {
         setVideoCallParams(prev => ({ ...prev, callPlaced: true, callPartner: partnerInfo }));
         if (partnerVideoRef.current) {
            partnerVideoRef.current.srcObject = remoteStream;
         }
      });

      peer1.on('connect', () => {
         setVideoCallParams(prev => ({ ...prev, callPlaced: true, callPartner: partnerInfo, isConnect: true, partnerConnectIsLoading: false }));
         sendMediaState(peer1, false, statuses.audio, false);
      });

      peer1.on('error', () => {
         setModalError({
            title: 'Произошла ошибка',
            descr: 'При установке соединения возникла ошибка, проверьте ваше соединение и попробуйте еще раз',
         });
         reset();
      });

      peer1.on('close', () => {
         setModalError({
            title: 'Звонок завершён или произоша ошибка.',
            descr: 'По необходимости позвоните ещё раз или напишите в чат',
         });
         reset();
      });

      channel.listen('VideoDialogEvent', ({ data }) => {
         if (data.type === 'callAccepted') {
            if (data.signal.sdp && !peer1?.destroyed) {
               setVideoCallParams(prev => ({ ...prev, callAccepted: true, partnerConnectIsLoading: true }));
               const updatedSignal = {
                  ...data.signal,
                  sdp: `${data.signal.sdp}\n`,
               };

               peer1.signal(updatedSignal);
               dispatch(setIsCalling('accept'));
            }
         }

         if (data.type === 'callCanceled') {
            dispatch(setIsCalling(false));
            reset();
         }
      });
   };

   const acceptCall = async () => {
      setIsLoadingAccept(true);

      const { stream, statuses } = await getPermissions(userVideoRef, 'getUserMedia', value => {
         setVideoCallParams(prev => ({ ...prev, statusMedia: value }));
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const peer2 = new SimplePeer({
         initiator: false,
         trickle: false,
         stream: stream,
         config: {
            iceServers: settingsIceServersPeer,
         },
      });

      peer2.on('data', data => {
         try {
            const message = JSON.parse(data);
            if (message.type === 'mediaState') {
               updateUI(message.video, message.audio, message.screenSharing, value => {
                  setVideoCallParams(prev => ({ ...prev, statusCompanionMedia: value }));
               });
            }
            if (message.type === 'screen-share-start') {
               playScreenShareSound();
            }
         } catch (error) {
            console.error('Ошибка при обработке сообщения:', error);
         }
      });

      peer2.on('signal', data => {
         sendPostRequest('/api/video/accept-call', {
            signal: data,
            to: videoCallParams.caller,
            dialog_id: currentDialog.id,
         }).catch(err => {});
      });

      peer2.on('stream', remoteStream => {
         setVideoCallParams(prev => ({ ...prev, callAccepted: true }));

         if (partnerVideoRef.current) {
            partnerVideoRef.current.srcObject = remoteStream;
         }
      });

      peer2.on('connect', () => {
         setVideoCallParams(prev => ({ ...prev, callAccepted: true, isConnect: true }));
         sendMediaState(peer2, false, statuses.audio, false);
      });

      peer2.on('error', () => {
         setModalError({
            title: 'Произошла ошибка',
            descr: 'При установке соединения возникла ошибка, проверьте ваше соединение и попробуйте еще раз',
         });
         reset();
      });

      peer2.on('close', () => {
         setModalError({
            title: 'Звонок завершён или произоша ошибка.',
            descr: 'По необходимости позвоните ещё раз или напишите в чат',
         });
         reset();
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      peer2.signal(videoCallParams.callerSignal);

      await new Promise(resolve => setTimeout(resolve, 400));

      setVideoCallParams(prev => ({ ...prev, callPlaced: true, callAccepted: true, receivingCall: false, peer2 }));
      dispatch(setIsReceivingCall(false));
      setIsLoadingAccept(false);
   };

   const reset = async () => {
      setIsLoadingCancel(true);
      if (videoCallParams.channel) {
         videoCallParams.channel.stopListening('VideoDialogEvent');
      }

      if (videoCallParams.peer1 && !videoCallParams.peer1.destroyed) {
         videoCallParams.peer1.removeAllListeners();
         videoCallParams.peer1.destroy();
      }
      if (videoCallParams.peer2 && !videoCallParams.peer2.destroyed) {
         videoCallParams.peer2.removeAllListeners();
         videoCallParams.peer2.destroy();
      }

      [userVideoRef.current, partnerVideoRef.current].forEach(ref => {
         if (ref?.srcObject) {
            ref.srcObject.getTracks().forEach(track => track.stop());
            ref.srcObject = null;
         }
      });

      if (videoCallParams.stream) {
         videoCallParams.stream.getTracks().forEach(track => track.stop());
      }
      if (videoCallParams.screenStream) {
         videoCallParams.screenStream.getTracks().forEach(track => track.stop());
      }

      await new Promise(resolve => setTimeout(resolve, 750));

      setIsLoadingCancel(false);

      setVideoCallParams(videoCallParamsDefault);
      dispatch(setIsCalling(false));
      dispatch(setIsReceivingCall(false));
      setIsLoadingCancel(false);

      dispatch(setVideoCallDelayTimer(true));
      await new Promise(resolve => setTimeout(resolve, 5000));
      dispatch(setVideoCallDelayTimer(false));
   };

   return { reset, initialize, placeVideoCall, acceptCall };
};
