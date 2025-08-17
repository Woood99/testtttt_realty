import { fakeAudioStream, fakeVideoStream } from '../../../helpers/mediaStreamUtils';

export const getPermissions = async (ref, type = 'getUserMedia', set, options = { video: false, audio: true, facingMode: 'user' }) => {
   if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
   }

   if (navigator.mediaDevices[type] === undefined) {
      navigator.mediaDevices[type] = function (constraints) {
         const media =
            type === 'getUserMedia'
               ? navigator.webkitGetUserMedia || navigator.mozGetUserMedia
               : navigator.webkitGetDisplayMedia || navigator.mozGetDisplayMedia;

         if (!media) {
            return Promise.reject(new Error('media is not implemented in this browser'));
         }

         return new Promise((resolve, reject) => {
            media.call(navigator, constraints, resolve, reject);
         });
      };
   }
   if (type === 'getUserMedia') {
      navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
   }
   if (type === 'getDisplayMedia') {
      navigator.mediaDevices.getDisplayMedia =
         navigator.mediaDevices.getDisplayMedia || navigator.webkitGetDisplayMedia || navigator.mozGetDisplayMedia;
   }

   let stream;
   let statuses = { video: false, audio: false };

   try {
      const constraints = {
         video: options.video,
         audio: options.audio,
      };

      if (type === 'getUserMedia') {
         constraints.video = options.video ? { facingMode: options.facingMode } : false;
      }

      stream = await navigator.mediaDevices[type](constraints);
   } catch (videoError) {
      try {
         stream = await navigator.mediaDevices[type]({ video: false, audio: true });
      } catch (audioError) {
         console.error('Не удалось получить доступ к аудио и видео:', audioError);
      }
   }

   if (stream) {
      if (stream.getVideoTracks().length === 0) {
         stream = new MediaStream([...fakeVideoStream().getVideoTracks(), ...stream.getAudioTracks()]);
         if (set) set({ video: false, audio: true });
         statuses = { video: false, audio: true };
      } else if (stream.getAudioTracks().length === 0) {
         stream = new MediaStream([...stream.getTracks(), ...fakeAudioStream().getTracks()]);
         if (set) set({ video: true, audio: false });
         statuses = { video: true, audio: false };
      } else {
         if (set) set({ video: true, audio: true });
         statuses = { video: true, audio: true };
      }
   } else {
      stream = new MediaStream([...fakeVideoStream().getTracks(), ...fakeAudioStream().getTracks()]);
      if (set) set({ video: false, audio: false });
      statuses = { video: false, audio: false };
   }

   if (ref && ref.current) {
      ref.current.srcObject = stream;
   }

   return { stream, statuses };
};

export const sendMediaState = (peer, videoEnabled, audioEnabled, screenSharingEnabled) => {
   if (peer && peer.connected) {
      peer.send(
         JSON.stringify({
            type: 'mediaState',
            video: videoEnabled,
            audio: audioEnabled,
            screenSharing: screenSharingEnabled,
         })
      );
   }
};

export const updateUI = (videoEnabled, audioEnabled, screenSharingEnabled, set) => {
   set({ video: videoEnabled, audio: audioEnabled, screenSharing: screenSharingEnabled });
};
