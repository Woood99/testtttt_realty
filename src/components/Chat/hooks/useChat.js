import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { CHAT_TAGS } from "@/constants";

import { getDialogId } from "@/api/getDialogId";
import { sendPostRequest } from "@/api/requestsApi";

import { useHistoryState } from "@/hooks";

import { convertFieldsJSON, isEmptyArrObj, refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from "@/helpers";

import { authLoadingSelector, checkAuthUser, getHelpSliceSelector, getUserInfo } from "@/redux";

import hasText from "../components/ChatDraft/hasText";
import { CHAT_TYPES } from "../constants";

import { useBlockUser } from "./useBlockUser";
import { useChatDialogs } from "./useChatDialogs";
import { useChatHelpers } from "./useChatHelpers";
import { useChatMessageComments } from "./useChatMessageComments";
import { useChatMessagesPagination } from "./useChatMessagesPagination";
import { useChatParamsActions } from "./useChatParamsActions";
import { usePinMessage } from "./usePinMessage";
import { useTheme } from "./useTheme";

export const useChat = options => {
	const { defaultDialogId, tag, fake_dialog } = options;

	const [currentDialog, setCurrentDialog] = useState({});
	const [currentDialogSettings, setCurrentDialogSettings] = useState({});

	const userInfo = useSelector(getUserInfo);

	const [showPopperMessage, setShowPopperMessage] = useState(false);
	const [showPopperMessagePosition, setShowPopperMessagePosition] = useState(null);

	const [dialogs, setDialogs] = useState([]);
	const [cachedDialog, setCachedDialog] = useState({});
	const [isLoadingDialogs, setIsLoadingDialogs] = useState(true);
	const [showMenuDialog, setShowMenuDialog] = useState(false);

	const [filesUpload, setFilesUpload] = useState([]);

	const [messageText, setMessageText] = useState(tag ? CHAT_TAGS.find(item => item.id === +tag)?.text || "" : "");

	const [isLoadingDialog, setIsLoadingDialog] = useState(false);
	const [allowScroll, setAllowScroll] = useState(true);

	const chatRootRef = useRef(null);
	const chatBottomRef = useRef(null);

	const [deleteMessagesModal, setDeleteMessagesModal] = useState(false);
	const [deleteDialogModal, setDeleteDialogModal] = useState(false);
	const [isVoiceRecording, setIsVoiceRecording] = useState(false);

	const [isOpenMenu, setIsOpenMenu] = useHistoryState(false);
	const [isOpenSmileMenu, setIsOpenSmileMenu] = useHistoryState(false);
	const [isVisibleBtnArrow, setIsVisibleBtnArrow] = useState(false);
	const [forwardMessageId, setForwardMessageId] = useState(false);
	const [createEventModal, setCreateEventModal] = useState(false);
	const [apartmentsByBuildingModal, setApartmentsByBuildingModal] = useState(false);
	const [sidebarModalOpen, setSidebarModalOpen] = useHistoryState(false);

	const [createDialogWithDevelopModal, setCreateDialogWithDevelopModal] = useHistoryState(false);
	const [createDialogWithSpecialistModal, setCreateDialogWithSpecialistModal] = useHistoryState(false);

	const [isEdit, setIsEdit] = useState(false);

	const dialogBuilding = currentDialog.building ? convertFieldsJSON(currentDialog.building) : null;
	const isVisibleVideoCall = !currentDialog.is_fake && currentDialog?.dialog_type === CHAT_TYPES.CHAT;

	const [searchParams, setSearchParams] = useSearchParams();
	const dialogsActions = useChatDialogs();
	const chatPinMessages = usePinMessage({ refactDialog: dialogsActions.refactDialog });
	const messageCommentsOptions = useChatMessageComments({ refactDialog: dialogsActions.refactDialog });
	const blockUserOptins = useBlockUser();
	const themeOptions = useTheme();

	const currentChannel = useRef(null);

	const authUser = useSelector(checkAuthUser);
	const authLoading = useSelector(authLoadingSelector);
	const notAuth = !authUser && !authLoading && !isLoadingDialogs && !isLoadingDialog;
	const { isConnectEcho } = useSelector(getHelpSliceSelector);

	const chatHelpers = useChatHelpers({ currentDialog, userInfo });
	const chatMessages = useChatMessagesPagination({
		currentDialog,
		chatPinMessages,
		dialogsActions,
		setIsLoadingDialog,
		cachedDialog,
		setCachedDialog,
		mainBlockBar: chatHelpers.mainBlockBar,
		setDialogs
	});

	const chatAllReset = useCallback(() => {
		setIsLoadingDialog(false);
		setCurrentDialog({});
		chatMessages.setMessages([]);
		chatPinMessages.setPinMessages([]);
		setCachedDialog({});
		setIsOpenSmileMenu(false);
		setIsOpenMenu(false);
		setShowPopperMessage(false);
		setShowPopperMessagePosition(null);
		setAllowScroll(false);
	}, []);

	const { fakeDialogDeleteAndSetDialogId } = useChatParamsActions({
		tag,
		messageText,
		fake_dialog,
		userInfo,
		setCurrentDialog,
		setIsLoadingDialog,
		chatAllReset,
		setAllowScroll,
		setMessages: chatMessages.setMessages,
		setPinMessages: chatPinMessages.setPinMessages,
		setCachedDialog
	});

	const deleteDialogParams = () => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.delete("dialog");
		newSearchParams.delete("not_dialog");
		newSearchParams.delete("building_id");
		newSearchParams.delete("organization_id");
		newSearchParams.delete("recipients_id");
		setSearchParams(newSearchParams);
	};

	const debouncedHandleDataDialogs = useCallback(
		debounce(async () => {
			const res = await dialogsActions.getDialogs();
			setDialogs(res);
		}, 500),
		[]
	);

	const debouncedHandleDataDialog = useCallback(
		debounce(async ({ dialog_id }) => {
			const dialogs = await dialogsActions.getDialogs();
			setDialogs(dialogs);
			setCurrentDialog(prev => {
				const dialog = dialogs.find(item => item.id === prev.id);
				if (dialog) {
					return dialog;
				}

				return prev;
			});

			const scrollbar = chatHelpers.mainBlockBar.current;

			const isBottom = scrollbar && scrollbar.scrollTop + scrollbar.clientHeight >= scrollbar.scrollHeight - 150;
			if (dialogs.find(item => item.id === dialog_id)) {
				await chatMessages.getDialog(dialog_id);
			} else {
				deleteDialogParams();
			}

			if (isBottom) {
				scrollbar.scrollTop = scrollbar.scrollHeight;
			}
		}, 500),
		[currentDialog]
	);

	const updateDialogsAndDialogSettings = async () => {
		const dialogsData = await dialogsActions.getDialogs();
		setDialogs(dialogsData);
		if (currentDialog.id) {
			setCurrentDialog(dialogsData.find(item => item.id === currentDialog.id) || {});
		}

		const currentIdSettings = currentDialogSettings?.id;
		if (currentIdSettings) {
			setCurrentDialogSettings(dialogsData.find(item => item.id === currentIdSettings) || {});
		}
	};

	useEffect(() => {
		if (authLoading) return;
		if (isEmptyArrObj(userInfo)) {
			setIsLoadingDialogs(false);
			return;
		}

		const fetchData = async () => {
			setIsLoadingDialogs(true);

			const dialogsData = await dialogsActions.getDialogs();

			setDialogs(dialogsData);

			setIsLoadingDialogs(false);

			const channelDialog = window.Echo.join(`user-dialogs.${userInfo.id}`);
			channelDialog.stopListening("UserDialogsEvent");
			channelDialog.listen("UserDialogsEvent", data => {
				debouncedHandleDataDialogs();
			});
		};

		if (isConnectEcho) {
			fetchData();
		}
	}, [userInfo, authLoading, isConnectEcho]);

	useEffect(() => {
		if (authLoading) return;
		if (isEmptyArrObj(userInfo) || !defaultDialogId) {
			if (fake_dialog) return;
			chatAllReset();
			return;
		}

		const abortController = new AbortController();
		const signal = abortController.signal;

		const fetchData = async () => {
			chatAllReset();
			setIsLoadingDialog(true);
			setAllowScroll(true);

			try {
				const dialogsData = await dialogsActions.getDialogs(signal);
				const dialogById = dialogsData.find(item => item.id === defaultDialogId);
				if (dialogById) {
					setCurrentDialog(dialogById);
					await chatMessages.getDialog(defaultDialogId, true, signal);
					connectToChat(defaultDialogId);
				} else {
					const dialog = await chatMessages.getDialog(defaultDialogId, true, signal);
					setCurrentDialog({ ...dialog, is_member: false, is_fake: true });
					connectToChat(dialog.id);
				}
			} catch (error) {
				if (!abortController.signal.aborted) {
					deleteDialogParams();
				} else {
					console.log("отмена");
				}
			} finally {
				setIsLoadingDialog(false);
			}
		};

		fetchData();

		return () => {
			abortController.abort();
		};
	}, [defaultDialogId, userInfo, fake_dialog]);

	useEffect(() => {
		const handleMessage = event => {
			try {
				let data = event.data;

				// Если это строка → парсим
				if (typeof data === "string") {
					data = JSON.parse(data);
				}
				if (data.type === "open-dialog" && data.dialog_id) {
					console.log(data.dialog_id);
					// 👉 например navigate(`/chat/${data.dialog_id}`)
				}
			} catch (e) {
				console.error("Ошибка при обработке сообщения:", e, event.data);
			}
		};

		document.addEventListener("message", handleMessage);
		window.addEventListener("message", handleMessage); // для iOS

		return () => {
			document.removeEventListener("message", handleMessage);
			window.removeEventListener("message", handleMessage);
		};
	}, []);
	const connectToChat = id => {
		if (currentChannel.current) {
			window.Echo.leave(currentChannel.current.name);
		}

		currentChannel.current = window.Echo.join(`dialog.${id}`);
		currentChannel.current.listen("DialogEvent", () => {
			debouncedHandleDataDialog({ dialog_id: id });
		});
	};

	const sendMessage = async (audioBlob = null, videoBlob = null) => {
		if (!isEdit) {
			const obj = {
				dialog_id: currentDialog.id,
				text: hasText(messageText) ? messageText : "",
				photos: filesUpload.filter(item => item.type === "image"),
				video: videoBlob ? [videoBlob] : filesUpload.filter(item => item.type === "video")
			};

			const formData = new FormData();

			if (currentDialog.is_fake) {
				const dialog_id = await getDialogId(fake_dialog);
				formData.append("dialog_id", dialog_id);
				fakeDialogDeleteAndSetDialogId(dialog_id);
			} else {
				formData.append("dialog_id", obj.dialog_id);
			}

			formData.append("text", obj.text);

			if (obj.photos?.length) {
				obj.photos = refactPhotoStageOne(obj.photos);
				refactPhotoStageAppend(obj.photos, formData);
				obj.photos = refactPhotoStageTwo(obj.photos);
				formData.append("photos", JSON.stringify(obj.photos));
			}

			if (obj.video?.length) {
				formData.append("video", obj.video[0].file);
				formData.append("is_story", obj.video[0].is_story ? 1 : 0);
			}

			if (audioBlob) {
				let file = new File([audioBlob], "audio.ogg", {
					type: "audio/ogg"
				});

				formData.append("audio", file);
			}

			setIsOpenMenu(false);
			setMessageText("");
			setFilesUpload([]);

			const dialogAddMessageFetch = async formData => {
				const updatedMessages = await dialogsActions.dialogAddMessage(chatMessages.messages, formData);

				chatMessages.setMessages(updatedMessages);
			};
			await dialogAddMessageFetch(formData);

			setTimeout(() => {
				chatHelpers.scrollMainBlock();
			}, 100);

			await sendPostRequest("/api/messages/new-message", formData, {
				"Content-Type": "multipart/form-data",
				"Accept-Encodin": "gzip, deflate, br, zstd",
				Accept: "application/json"
			});
		} else {
			const obj = {
				text: hasText(isEdit.text) ? isEdit.text : "",
				id: isEdit.id,
				dialog_id: isEdit.dialog_id
			};

			const formData = new FormData();

			formData.append("text", obj.text);
			formData.append("id", obj.id);
			formData.append("dialog_id", obj.dialog_id);

			await sendPostRequest("/api/messages/update-message", formData, {
				"Content-Type": "multipart/form-data",
				"Accept-Encodin": "gzip, deflate, br, zstd",
				Accept: "application/json"
			});
			setIsEdit(false);
		}
	};

	const sendVoiceRecorder = blob => {
		sendMessage(blob);
	};

	const sendNoteVideo = options => {
		sendMessage(null, options);
	};

	const deleteMessages = (ids = [], dialog_id = null, all = false) => {
		if (dialog_id === null) return;
		setDeleteMessagesModal({
			ids,
			dialog_id,
			all
		});
	};

	const forwardMessage = (messageId, toDialogId) => {
		console.log(messageId, toDialogId);
	};

	return {
		dialogs,
		currentDialog,
		setCurrentDialog,
		connectToChat,
		setIsLoadingDialog,
		isLoadingDialog,
		sendMessage,
		...chatHelpers,
		messageText,
		setMessageText,
		chatBottomRef,
		chatRootRef,
		sendVoiceRecorder,
		sendNoteVideo,
		setDialogs,
		deleteMessages,
		...dialogsActions,
		...chatMessages,
		isEdit,
		setIsEdit,
		isVoiceRecording,
		setIsVoiceRecording,
		filesUpload,
		setFilesUpload,
		dialogBuilding,
		isOpenSmileMenu,
		setIsOpenSmileMenu,
		isOpenMenu,
		setIsOpenMenu,
		isVisibleBtnArrow,
		setIsVisibleBtnArrow,
		deleteMessagesModal,
		setDeleteMessagesModal,
		userInfo,
		isLoadingDialogs,
		forwardMessage,
		forwardMessageId,
		setForwardMessageId,
		createEventModal,
		setCreateEventModal,
		chatPinMessages,
		currentDialogSettings,
		setCurrentDialogSettings,
		updateDialogsAndDialogSettings,
		messageCommentsOptions,
		cachedDialog,
		setCachedDialog,
		blockUserOptins,
		themeOptions,
		showPopperMessage,
		setShowPopperMessage,
		showPopperMessagePosition,
		setShowPopperMessagePosition,
		fakeDialogDeleteAndSetDialogId,
		allowScroll,
		setAllowScroll,
		isVisibleVideoCall,
		apartmentsByBuildingModal,
		setApartmentsByBuildingModal,
		authUser,
		authLoading,
		notAuth,
		showMenuDialog,
		setShowMenuDialog,
		deleteDialogModal,
		setDeleteDialogModal,
		chatAllReset,
		sidebarModalOpen,
		setSidebarModalOpen,
		createDialogWithDevelopModal,
		setCreateDialogWithDevelopModal,
		createDialogWithSpecialistModal,
		setCreateDialogWithSpecialistModal
	};
};
