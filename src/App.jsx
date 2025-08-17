import React from "react";

import PopupInstallPromo from "./components/PopupInstallPromo";
import ToastChatContainer from "./components/Toasts/ToastChatContainer";
import ToastPrimary from "./components/Toasts/ToastPrimary";
import VideoCall from "./components/VideoCall/VideoCall";
import LayoutProvider from "./unifComponents/Provider/LayoutProvider";
import SecondProvider from "./unifComponents/Provider/SecondProvider";
import Router from "./unifComponents/Router";

const App = () => {
	return (
		<LayoutProvider>
			<Router />
			<SecondProvider />
			<ToastChatContainer />
			<ToastPrimary />
			<PopupInstallPromo />
			<VideoCall />
		</LayoutProvider>
	);
};

export default App;
