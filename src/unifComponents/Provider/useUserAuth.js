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

`
{
    "id": 33,
    "role": {
        "id": 2,
        "name": "SELLER",
        "labels": [
            "Продавец",
            "Менеджер"
        ]
    },
    "name": "Сергей",
    "email": "sergey.stryuchkov02@gmail.com",
    "email_verified_at": null,
    "created_at": "2025-02-23T14:14:37.000000Z",
    "updated_at": "2025-08-14T10:34:27.000000Z",
    "api_id": null,
    "surname": "Стрючков",
    "father_name": "",
    "birthday": "",
    "phone": "+79880213629",
    "image": null,
    "organization_id": 335,
    "description": "описание описание",
    "cities": [
        1
    ],
    "building_types": [
        1
    ],
    "experience": 1,
    "yt_video": "",
    "sber_id": null,
    "alfa_id": null,
    "associated_objects": [
        288,
        299,
        300,
        302,
        303,
        325,
        326,
        328,
        329,
        813
    ],
    "last_seen": null,
    "is_phone_verified": 0,
    "phone_pin": null,
    "phone_verification_tries": 0,
    "photos": [],
    "organization": {
        "id": 335,
        "name": "ГК Самолет. Москва",
        "api_id": null,
        "foundation_year": null,
        "building_houses": null,
        "ready_houses": null,
        "building_complexes": null,
        "ready_complexes": null,
        "description": null,
        "youtube_link": null,
        "image": null,
        "cities": [
            1
        ],
        "photos": null,
        "created_at": "2024-10-25T06:38:43.000000Z",
        "updated_at": "2024-10-25T06:38:43.000000Z"
    },
    "counts": {
        "dialogs": 0,
        "notifications": 0,
        "objects": 9
    }
}
    `;

export const useUserAuth = () => {
	const dispatch = useDispatch();
	const [cookies, , removeCookie] = useCookies();
	const location = useLocation();

	const isDesktop = useSelector(getIsDesktop);

	const setAuthUser = async () => {
		const userInfo = await getAuthUser();

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

	const logout = async () => {
		try {
			await sendPostRequest(`/api/logout`);
			removeCookie("loggedIn", { path: "/" });
			removeCookie("access_token", { path: "/" });
			removeCookie("login_as_admin", { path: "/" });
			dispatch(setUserInfo({}));
			dispatch(setLikes([]));
		} catch (error) {
			console.log(error);
		}
	};

	return { setAuthUser, userConnectionEcho, getAuthUser, logout };
};
