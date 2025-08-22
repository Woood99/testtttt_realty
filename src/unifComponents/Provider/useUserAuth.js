import Echo from "laravel-echo";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { ROLES, RoutesPath } from "@/constants";

import { getIsDesktop } from "@/redux";

import { getDataRequest, sendPostRequest } from "../../api/requestsApi";
import ToastChat from "../../components/Toasts/ToastChat";
import isEmptyArrObj from "../../helpers/isEmptyArrObj";
import { setIsConnectEcho } from "../../redux/slices/helpSlice";
import { setLikes, setUserInfo } from "../../redux/slices/mainInfoSlice";
import { setIsReceivingCall } from "../../redux/slices/videoCallSlice";

export const useUserAuth = () => {
	const dispatch = useDispatch();
	const [cookies, , removeCookie] = useCookies();
	const location = useLocation();

	const isDesktop = useSelector(getIsDesktop);

	const setAuthUser = async (postMessage = false) => {
		const userInfo = await getAuthUser();
		if (!userInfo) {
			dispatch(setUserInfo({}));
			return {};
		}
		if (postMessage) {
			postMessageLogin(userInfo.id);
		}

		dispatch(setUserInfo(userInfo));

		getDataRequest("/api/likes").then(res => {
			dispatch(setLikes(res.data));
		});

		return userInfo;
	};

	const userConnectionEcho = (userInfo, tokenConnect = null) => {
		if (isEmptyArrObj(userInfo)) return;
		const token = cookies.access_token || tokenConnect;

		if (!token) return;

		window.Echo = new Echo({
			broadcaster: "socket.io",
			host: "https://api.inrut.ru:6001",
			auth: {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		});

		dispatch(setIsConnectEcho(true));

		const channelDialog = window.Echo.join(`user-video-dialogs.${userInfo.id}`);
		channelDialog.stopListening("UserVideoDialogsEvent");
		channelDialog.listen("UserVideoDialogsEvent", ({ data }) => {
			if (data.type === "incomingCall") {
				dispatch(setIsReceivingCall(data));
			}
			if (data.type === "callCanceled") {
				dispatch(setIsReceivingCall(false));
			}
			if (data.type === "callAccepted") {
				dispatch(setIsReceivingCall(false));
			}
		});

		const chatMessageNotifications = window.Echo.join(`user-message-notifications.${userInfo.id}`);
		chatMessageNotifications.stopListening("UserMessageNotificationsEvent");
		chatMessageNotifications.listen("UserMessageNotificationsEvent", ({ data }) => {
			if (location.pathname !== RoutesPath.chat) {
				const children = document.querySelector("#chat-notifications .Toastify__toast-container")?.children;
				if (!children || (children?.length < 5 && isDesktop)) {
					toast(ToastChat, {
						data,
						autoClose: 10000,
						hideProgressBar: true,
						position: "bottom-right",
						containerId: "chat-notifications",
						style: {
							marginBottom: 10,
							maxHeight: 81
						},
						onClick: () => {
							toast.dismiss({ containerId: "chat-notifications" });
						}
					});
				}
			}
		});
	};

	const getAuthUser = async () => {
		try {
			const user = await getDataRequest("/api/get-authenticated-user");
			const userResult = user.data.result;
			const data = {
				...userResult,
				phone: userResult.phone && userResult.phone[0] === "7" ? `+${userResult.phone}` : userResult.phone,
				cities: userResult.cities || [],
				counts: user.data.counts,
				role: ROLES.find(el => el.id === userResult?.role)
			};

			return data;
		} catch (error) {
			removeCookie("loggedIn", { path: "/" });
			removeCookie("access_token", { path: "/" });
			dispatch(setUserInfo({}));
			dispatch(setLikes([]));
		}
	};

	const logout = async (postMessageUserId = null) => {
		try {
			await sendPostRequest(`/api/logout`);
			if (postMessageUserId) postMessageLogout(postMessageUserId);
			removeCookie("loggedIn", { path: "/" });
			removeCookie("access_token", { path: "/" });
			removeCookie("login_as_admin", { path: "/" });
			dispatch(setUserInfo({}));
			dispatch(setLikes([]));
		} catch (error) {
			console.log(error);
		}
	};

	const postMessageLogin = userId => {
		if (!userId) return;
		if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
			window.ReactNativeWebView.postMessage(
				JSON.stringify({
					type: "auth",
					status: "logged_in",
					userId
				})
			);
		}
	};

	const postMessageLogout = userId => {
		if (!userId) return;
		if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
			window.ReactNativeWebView.postMessage(
				JSON.stringify({
					type: "auth",
					status: "logged_out",
					userId
				})
			);
		}
	};

	return { setAuthUser, userConnectionEcho, getAuthUser, logout };
};
