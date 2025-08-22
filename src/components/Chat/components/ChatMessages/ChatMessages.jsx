import { ChatMessage } from "..";
import cn from "classnames";
import dayjs from "dayjs";
import React, { useCallback, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { checkDialogId, getDataRequest } from "@/api";

import { capitalizeWords } from "@/helpers";

import { ChatContext, ChatMessagesContext } from "@/context";

import { getIsDesktop, getUserInfo } from "@/redux";

import { Avatar, SimpleScrollbar, Spinner } from "@/ui";
import { IconChat } from "@/ui/Icons";

import { Button } from "@/uiForm";

import styles from "../../Chat.module.scss";
import { CHAT_TYPES } from "../../constants";
import { useChatMessages } from "../../hooks";
import ChatBottom from "../ChatBottom";

const ChatMessages = ({
	messages = [],
	variant = "default",
	comments = true,
	deleteMessage,
	showPopperMessage,
	setShowPopperMessage,
	editMessage = true,
	draftOptions,
	showPopperMessagePosition,
	setShowPopperMessagePosition
}) => {
	const {
		currentDialog,
		currentDialogUserInfo,
		isLoadingDialog,
		mainBlockBar,
		filesUpload,
		setFilesUpload,
		setIsVisibleBtnArrow,
		isOrganization,
		blockUserOptins,
		setCurrentDialog,
		setDialogs,
		allowScroll,
		setAllowScroll,
		isLoadingPagination,
		getDialogs,
		getDialog
	} = useContext(ChatContext);

	const userInfo = useSelector(getUserInfo);
	const isDesktop = useSelector(getIsDesktop);
	const [_, setSearchParams] = useSearchParams();
	const [isLoadingJoinChannel, setIsLoadingJoinChannel] = useState(false);

	const visibleBottom =
		variant === "default"
			? !(currentDialog.dialog_type === CHAT_TYPES.CHANNEL && !currentDialogUserInfo.myChannelOrGroup) &&
				!currentDialog.my_block &&
				!currentDialog.not_my_block
			: variant === "comments";

	const visibleAvatar = currentDialog.dialog_type === CHAT_TYPES.CHAT || currentDialog.dialog_type === CHAT_TYPES.GROUP;

	const visibleGoToChat =
		variant === "default" &&
		currentDialog.dialog_type === CHAT_TYPES.CHANNEL &&
		!currentDialogUserInfo.myChannelOrGroup &&
		!currentDialog.my_block &&
		!currentDialog.not_my_block &&
		currentDialog.owner &&
		currentDialog.is_member !== false;

	const goToChatOwner = useCallback(async () => {
		const dialog_id = await checkDialogId({ not_dialog: 1, recipients_id: [currentDialog.owner.id], type: CHAT_TYPES.CHAT });

		if (dialog_id) {
			setSearchParams({ dialog: dialog_id });
		} else {
			const params = {
				not_dialog: 1,
				recipients_id: currentDialog.owner.id || ""
			};
			if (!params.recipients_id) return;

			const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ""));
			setSearchParams(new URLSearchParams(Object.fromEntries(Object.entries(filteredParams).map(([k, v]) => [k, v.toString()]))));
		}
	}, [currentDialog, setSearchParams]);

	const {
		handlePlayAudio,
		handleStopAudio,
		addFile,
		deleteFile,
		getInputProps,
		uploadFileOpen,
		handlePlayMedia,
		firstUnreadRef,
		isDragActive,
		getRootProps
	} = useChatMessages({
		mainBlockBar,
		filesUpload,
		setFilesUpload,
		setIsVisibleBtnArrow,
		isLoadingDialog,
		currentDialog,
		messages,
		allowScroll,
		setAllowScroll
	});

	return (
		<ChatMessagesContext.Provider
			value={{
				handlePlayAudio,
				handleStopAudio,
				addFile,
				deleteFile,
				getInputProps,
				uploadFileOpen,
				deleteMessage,
				showPopper: showPopperMessage,
				setShowPopper: setShowPopperMessage,
				showPopperPosition: showPopperMessagePosition,
				setShowPopperPosition: setShowPopperMessagePosition,
				handlePlayMedia,
				firstUnreadRef,
				editMessage,
				variant,
				draftOptions
			}}>
			<div {...getRootProps()} className='flex flex-col flex-1 overflow-hidden'>
				<input {...getInputProps()} />
				{isDragActive && !draftOptions.isEdit && (
					<div className={styles.ChatFileDropZoneOverlay}>
						<p>Перетащите сюда файлы для отправки</p>
					</div>
				)}
				<SimpleScrollbar className={cn("pr-2 w-full chat-container", styles.ChatMessages)} ref={mainBlockBar} variant='custom'>
					{messages.length > 0 && isLoadingPagination === "up" && (
						<div className='mt-3 mx-auto'>
							<Spinner style={{ "--size": "32px" }} />
						</div>
					)}

					<div
						className={cn(
							styles.ChatMessagesInner,
							(isLoadingDialog || allowScroll) && "opacity-0 absolute inset-0",
							!messages.length && "mt-[10%]"
						)}>
						{messages.length === 0 ? (
							<div className='white-block w-max flex flex-col items-center text-center mx-auto my-auto max-w-[320px]'>
								<div className='text-center text-littleBig flex flex-col mb-8'>
									<span className='font-medium'>Сообщений пока нет</span>
									<span>Напишите первое сообщение</span>
								</div>
								<Avatar size={90} src={currentDialogUserInfo.image} title={currentDialogUserInfo.name} />
								<h3 className='text-defaultMax mt-3'>
									{isOrganization
										? currentDialogUserInfo.name
										: capitalizeWords(currentDialogUserInfo.name, currentDialogUserInfo.surname)}
								</h3>
							</div>
						) : (
							messages.map(item => {
								return (
									<div key={item.date}>
										{item.date && <div className={styles.ChatDate}>{dayjs(item.date).format("D MMMM")}</div>}
										{item.blocks?.map((item, index) => {
											const user = item.user;
											const myMessage = user.id === userInfo.id;

											return (
												<div key={index} className={cn(styles.ChatMessageWrapper, myMessage && styles.ChatMessageWrapperMe)}>
													{isDesktop && visibleAvatar && !myMessage && (
														<Avatar size={40} src={user.image} title={user.name} className={styles.ChatMessageUser} />
													)}
													{!isDesktop && currentDialog.dialog_type === CHAT_TYPES.GROUP && !myMessage && (
														<Avatar size={40} src={user.image} title={user.name} className={styles.ChatMessageUser} />
													)}
													<div className={cn("flex flex-col flex-grow", myMessage && "items-end")}>
														{item.messages.map(item => {
															return <ChatMessage data={item} key={item.id} comments={comments} />;
														})}
													</div>
												</div>
											);
										})}
									</div>
								);
							})
						)}
					</div>
				</SimpleScrollbar>
				<div id='chat-mobile-actions' />
				{visibleBottom && (
					<div className='mmd1:pb-4 mt-auto mmd1:mr-2 mmd1:mx-4'>
						<ChatBottom />
					</div>
				)}
				{Boolean(currentDialog.my_block || currentDialog.not_my_block) && (
					<div className='py-2 mt-auto mr-2 mx-4'>
						{currentDialog.my_block ? (
							<Button
								isLoading={blockUserOptins.isLoadingAction}
								variant='red'
								className='w-full uppercase'
								onClick={async () => {
									blockUserOptins.setIsLoadingAction(true);
									await blockUserOptins.blockUserDelete(currentDialogUserInfo.id);
									setCurrentDialog(prev => ({ ...prev, my_block: false }));
									setDialogs(prev => {
										return prev.map(i => {
											if (i.id === currentDialog.id) {
												return { ...i, my_block: false };
											}
											return i;
										});
									});
									blockUserOptins.setIsLoadingAction(false);
								}}>
								Разблокировать
							</Button>
						) : currentDialog.not_my_block ? (
							<div className='w-full text-center bg-white px-4 py-4 font-medium rounded-xl'>Вас заблокировали</div>
						) : (
							""
						)}
					</div>
				)}
				{Boolean(currentDialog.is_member === false) && (
					<div className='mt-auto bg-white'>
						<button
							className={cn(
								"flex items-center gap-4 w-full py-4 px-4 relative h-[52px]",
								isLoadingJoinChannel && "opacity-50 pointer-events-none"
							)}
							onClick={async () => {
								setIsLoadingJoinChannel(true);
								await getDataRequest(`/api/dialogs/${currentDialog.id}/user/join`);
								const dialogs = await getDialogs();
								const dialog = await getDialog(currentDialog.id);
								setDialogs(dialogs);
								setCurrentDialog({ ...dialog, is_member: true });
								setIsLoadingJoinChannel(false);
							}}>
							{currentDialog.owner && (
								<div
									className='flex-center-all absolute left-2 top-1/2 transform -translate-y-1/2 h-10 w-10'
									onClick={e => {
										e.stopPropagation();
										goToChatOwner();
									}}>
									<IconChat width={20} height={20} />
								</div>
							)}
							{isLoadingJoinChannel ? (
								<div className='w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
									<Spinner style={{ "--size": "28px" }} />
								</div>
							) : (
								<span className='w-full uppercase text-blue font-medium text-defaultMax'>Вступить в канал</span>
							)}
						</button>
					</div>
				)}
				{visibleGoToChat && (
					<div className='mt-auto'>
						<button className='bg-white w-full py-4 px-4 flex justify-center items-center gap-3' onClick={goToChatOwner}>
							<IconChat width={20} height={20} />
							<span className='font-medium text-defaultMax'>Задать вопрос</span>
						</button>
					</div>
				)}
				<div id='chat-mobile-smile' />
			</div>
		</ChatMessagesContext.Provider>
	);
};

export default ChatMessages;
