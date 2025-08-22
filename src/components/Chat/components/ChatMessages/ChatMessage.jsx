import { ChatMessageReactionPanel } from "..";
import cn from "classnames";
import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { getSrcImage } from "@/helpers";

import { ChatContext, ChatMessageContext, ChatMessagesContext } from "@/context";

import { getIsDesktop, getUserInfo } from "@/redux";

import { LightboxContainer } from "@/components";

import { getColorForLetter } from "@/ui";

import styles from "../../Chat.module.scss";
import hasText from "../ChatDraft/hasText";

import {
	ChatMessageAudio,
	ChatMessageCommentsButton,
	ChatMessagePhotos,
	ChatMessageText,
	ChatMessageTimeAndReads,
	ChatMessageTooltip,
	ChatMessageVideo
} from "./ui";

const hasHorizontalPhotos = photos => {
	if (photos.length === 1 && photos[0].ratio < 0.7) {
		return true;
	}
};

const ChatMessage = ({ data, comments = true }) => {
	const { currentDialog, currentDialogUserInfo } = useContext(ChatContext);
	const { setShowPopper, firstUnreadRef, setShowPopperPosition } = useContext(ChatMessagesContext);

	const userInfo = useSelector(getUserInfo);
	const isDesktop = useSelector(getIsDesktop);

	const [galleryCurrentIndex, setGalleryCurrentIndex] = useState(false);

	const myMessage = userInfo.id === data.user.id;

	const audioData = data.files?.filter(item => item.type === "audio")[0];
	const dataText = data.is_json ? JSON.parse(data.text) : data.text;
	const isReactions = Boolean(data.reactions?.length);

	const photos = useMemo(() => {
		return data.photos?.map(item => ({ ...item, index: uuidv4(), ratio: item.width / item.height })) || [];
	}, [data.photos]);

	const videoData = useMemo(() => {
		return data.files?.filter(item => item.type === "video")[0]
			? { ...data.files?.filter(item => item.type === "video")[0], index: uuidv4() }
			: null;
	}, [data.files]);

	const photosLength = data.photos?.length;

	const blockClassName = cn(
		styles.ChatMessageBlock,
		myMessage && styles.ChatMessageBlockMe,
		photosLength && styles.ChatMessageBlockPhotos,
		photosLength > 1 && !videoData && hasText(dataText) && styles.ChatMessageBlockFilesText,
		hasHorizontalPhotos(photos) && !hasText(dataText) && styles.ChatMessagePhotosHorizontal,
		hasHorizontalPhotos(photos) && hasText(dataText) && styles.ChatMessagePhotosHorizontalText,
		videoData && hasText(dataText) && styles.ChatMessageVideoNoRounded,
		audioData && styles.ChatMessageBlockAudio,
		videoData && !videoData.is_story && styles.ChatMessageBlockVideo,
		videoData && videoData.is_story && styles.ChatMessageBlockStory,
		isReactions && styles.ChatMessageBlockReactions
	);

	if (!dataText && !videoData && !audioData && !photosLength) return;

	return (
		<ChatMessageContext.Provider
			value={{
				data,
				myMessage,
				videoData,
				audioData,
				dataText,
				galleryCurrentIndex,
				setGalleryCurrentIndex,
				photos,
				photosLength
			}}>
			<div
				className={cn(styles.ChatMessage, myMessage && styles.ChatMessageMe, data.loading && styles.ChatMessageLoading)}
				ref={data.key === currentDialog.un_read_messages_count ? firstUnreadRef : null}
				onClick={e => {
					if (isDesktop) return;
					if (data.loading) return;
					if (e.target.closest("[data-chat-tooltip]") || e.target.closest("[data-draft-spoiler]")) return;
					setShowPopperPosition(prev => (prev ? null : { x: e.clientX, y: e.clientY }));
					setShowPopper(prev => (prev ? false : data.id));
				}}
				onContextMenu={e => {
					if (!isDesktop) return;
					if (data.loading) return;

					e.preventDefault();
					setShowPopperPosition(prev => (prev ? null : { x: e.clientX, y: e.clientY }));
					setShowPopper(prev => (prev ? false : data.id));
				}}>
				<div className={blockClassName}>
					<div className={cn(styles.ChatMessageBlockWrapper)}>
						{data.user_visible && (
							<span
								className={styles.ChatMessageUserName}
								style={{
									color: getColorForLetter(
										currentDialogUserInfo.type_channel
											? currentDialogUserInfo.name
											: myMessage
												? data.user.name
												: currentDialogUserInfo.name
									)
								}}>
								{currentDialogUserInfo.type_channel ? currentDialogUserInfo.name : myMessage ? "Вы" : currentDialogUserInfo.name}
							</span>
						)}
						<div className='relative'>
							{Boolean(photosLength || videoData) && (
								<div className={cn("flex flex-col gap-1", hasText(dataText) && "mb-3")}>
									<ChatMessagePhotos />
									<ChatMessageVideo />
								</div>
							)}
							<ChatMessageAudio />
							<ChatMessageText />
							<div className={isReactions ? styles.ChatMessageReactionsContainer : "inline"}>
								<ChatMessageReactionPanel />
								<ChatMessageTimeAndReads />
							</div>
						</div>
					</div>
					<ChatMessageTooltip />
					{comments && <ChatMessageCommentsButton />}
				</div>
			</div>

			{Boolean(galleryCurrentIndex) && (
				<LightboxContainer
					data={[
						...photos.map(item => ({
							index: item.index,
							type: "image",
							src: getSrcImage(item.url)
						})),
						videoData
					].filter(Boolean)}
					index={galleryCurrentIndex}
					setIndex={setGalleryCurrentIndex}
				/>
			)}
		</ChatMessageContext.Provider>
	);
};

export default ChatMessage;
