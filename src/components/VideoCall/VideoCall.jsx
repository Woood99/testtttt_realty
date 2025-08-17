import React, { useState } from 'react';

import IncomingCall from './IncomingCall';
import OutgoingCall from './OutgoingCall';
import { VideoCallContext } from '../../context';
import ModalCameraNotFound from './ModalCameraNotFound';
import ModalMicrophoneNotFound from './ModalMicrophoneNotFound';
import ModalError from './ModalError';

const VideoCall = () => {
   const [isOpenModalCameraNotFound, setIsOpenModalCameraNotFound] = useState(false);
   const [isOpenModalMicrophoneNotFound, setIsOpenModalMicrophoneNotFound] = useState(false);
   const [modalError, setModalError] = useState(false);

   return (
      <VideoCallContext.Provider
         value={{
            isOpenModalCameraNotFound,
            setIsOpenModalCameraNotFound,
            isOpenModalMicrophoneNotFound,
            setIsOpenModalMicrophoneNotFound,
            modalError,
            setModalError,
         }}>
         <IncomingCall />
         <OutgoingCall />
         <ModalCameraNotFound />
         <ModalMicrophoneNotFound />
         <ModalError />
      </VideoCallContext.Provider>
   );
};

export default VideoCall;
