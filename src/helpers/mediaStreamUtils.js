export const checkMediaDevices = async () => {
   try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return {
         hasVideo: devices.some(device => device.kind === 'videoinput'),
         hasAudio: devices.some(device => device.kind === 'audioinput'),
      };
   } catch (error) {
      console.error('Error enumerating devices:', error);
      return { hasVideo: false, hasAudio: false };
   }
};

export const fakeVideoStream = () => {
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
};

export const fakeAudioStream = () => {
   const audioContext = new AudioContext();
   const destination = audioContext.createMediaStreamDestination();
   return destination.stream;
};

export const getEmptyStream = () => {
   const emptyStream = new MediaStream();

   fakeVideoStream()
      .getVideoTracks()
      .forEach(track => emptyStream.addTrack(track));
   fakeAudioStream()
      .getAudioTracks()
      .forEach(track => emptyStream.addTrack(track));

   return emptyStream;
};

export const settingsIceServersPeer = [
   // STUN (для P2P-соединений, если возможно)
   {
      urls: 'stun:stun.l.google.com:19302',
   },

   // TURN/UDP (основной, самый быстрый вариант)
   {
      urls: 'turn:api.inrut.ru:3478?transport=udp',
      username: 'inrut',
      credential: 'y9GGXmfcR0Lsdfw1',
   },

   // TURN/TCP (резервный, если UDP заблокирован)
   {
      urls: 'turn:api.inrut.ru:5349?transport=tcp',
      username: 'inrut',
      credential: 'y9GGXmfcR0Lsdfw1',
   },

   // TURN/TLS (обязательный для обхода строгих фаерволлов)
   {
      urls: 'turns:api.inrut.ru:5349?transport=tcp',
      username: 'inrut',
      credential: 'y9GGXmfcR0Lsdfw1',
   },
];

// export const settingsIceServersPeer = [
//    { urls: 'stun:stun.l.google.com:19302' },
//    { urls: 'stun:global.stun.twilio.com:3478' },

//    {
//       urls: ['turn:hk.api.inrut.ru:3478?transport=udp', 'turn:hk.api.inrut.ru:443?transport=tcp'],
//       username: 'inrut',
//       credential: 'y9GGXmfcR0Lsdfw1',
//    },
//    {
//       urls: ['turn:fra.api.inrut.ru:3478?transport=udp', 'turn:fra.api.inrut.ru:443?transport=tcp'],
//       username: 'inrut',
//       credential: 'y9GGXmfcR0Lsdfw1',
//    },
//    {
//       urls: ['turn:ny.api.inrut.ru:3478?transport=udp', 'turn:ny.api.inrut.ru:443?transport=tcp'],
//       username: 'inrut',
//       credential: 'y9GGXmfcR0Lsdfw1',
//    },

//    {
//       urls: 'turn:relay.metered.ca:443?transport=tcp',
//       username: 'inrut',
//       credential: 'y9GGXmfcR0Lsdfw1',
//    },
// ];
