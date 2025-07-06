import React from 'react';

import Router from './unifComponents/Router';
import MainProvider from './unifComponents/Provider/MainProvider';
import ToastChatContainer from './components/Toasts/ToastChatContainer';
import PopupInstallPromo from './components/PopupInstallPromo';
import IncomingCall from './components/VideoCall/IncomingCall';
import OutgoingCall from './components/VideoCall/OutgoingCall';

const App = () => {
   return (
      <>
         <Router />
         <MainProvider />
         <ToastChatContainer />
         <PopupInstallPromo />
         <IncomingCall />
         <OutgoingCall />
      </>
   );
};

export default App;
