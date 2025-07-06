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

   function fakeVideoStream() {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const context = canvas.getContext('2d');

      function draw() {
         context.fillStyle = '#242629';
         context.fillRect(0, 0, canvas.width, canvas.height);
         requestAnimationFrame(draw);
      }

      draw();

      return canvas.captureStream(25);
   }

   function fakeAudioStream() {
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      return destination.stream;
   }

   if (stream) {
      if (stream.getVideoTracks().length === 0) {
         stream = new MediaStream([...fakeVideoStream().getVideoTracks(), ...stream.getAudioTracks()]);
         if (set) set({ video: false, audio: true });
      } else if (stream.getAudioTracks().length === 0) {
         stream = new MediaStream([...stream.getTracks(), ...fakeAudioStream().getTracks()]);
         if (set) set({ video: true, audio: false });
      } else {
         if (set) set({ video: true, audio: true });
      }
   } else {
      stream = new MediaStream([...fakeVideoStream().getTracks(), ...fakeAudioStream().getTracks()]);
      if (set) set({ video: false, audio: false });
   }

   if (ref && ref.current) {
      ref.current.srcObject = stream;
   }

   return stream;
};

export const sendMediaState = (peer, videoEnabled, audioEnabled) => {
   if (peer && peer.connected) {
      peer.send(
         JSON.stringify({
            type: 'mediaState',
            video: videoEnabled,
            audio: audioEnabled,
         })
      );
   }
};

export const updateUI = (videoEnabled, audioEnabled, set) => {
   set({ video: videoEnabled, audio: audioEnabled });
};

export const settingsIceServersPeer = [
   { urls: 'stun:stun.l.google.com:19302' },
   { urls: 'stun:global.stun.twilio.com:3478' },

   {
      urls: [
         'turn:hk.api.inrut.ru:3478?transport=udp', // UDP для скорости
         'turn:hk.api.inrut.ru:443?transport=tcp', // TCP для обхода блокировок
      ],
      username: 'inrut',
      credential: 'y9GGXmfcR0Lsdfw1',
   },
   {
      urls: ['turn:fra.api.inrut.ru:3478?transport=udp', 'turn:fra.api.inrut.ru:443?transport=tcp'],
      username: 'inrut',
      credential: 'y9GGXmfcR0Lsdfw1',
   },
   {
      urls: ['turn:ny.api.inrut.ru:3478?transport=udp', 'turn:ny.api.inrut.ru:443?transport=tcp'],
      username: 'inrut',
      credential: 'y9GGXmfcR0Lsdfw1',
   },

   {
      urls: 'turn:relay.metered.ca:443?transport=tcp',
      username: 'inrut',
      credential: 'y9GGXmfcR0Lsdfw1',
   },

   // {
   //    urls: 'turn:api.inrut.ru:3478',
   //    username: 'inrut',
   //    credential: 'y9GGXmfcR0Lsdfw1',
   // },
];
