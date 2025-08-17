import { ChatMenu, ChatPresent, ChatSmile, ChatVoiceRecorder } from ".";
import cn from "classnames";
import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { getIsDesktop } from "@/redux";

import { ChatContext, ChatMessageContext, ChatMessagesContext, ChatVoiceRecorderContext } from "../../../context";
import getSrcImage from "../../../helpers/getSrcImage";
import { IconCheckedSecond, IconClose, IconEdit, IconSend } from "../../../ui/Icons";
import { ThumbPhoto } from "../../../ui/ThumbPhoto";
import { GetDescrHTML } from "../../BlockDescr/BlockDescr";
import styles from "../Chat.module.scss";
import { useChatVoiceRecorder } from "../hooks";

import ChatDraft from "./ChatDraft";
import ChatDraftTooltip from "./ChatDraft/ChatDraftTooltip";
import hasText from "./ChatDraft/hasText";
import { ChatMessagePreview } from "./ChatMessages/ui";
import { ChatVoiceRecorderButton, ChatVoiceRecorderContent } from "./ChatVoiceRecorder";
import SlateEditor from "./SlateEditor";

const FilesLayout = ({ isEdit = false }) => {
	const { filesUpload } = useContext(ChatContext);
	const { deleteFile } = useContext(ChatMessagesContext);

	const isDesktop = useSelector(getIsDesktop);

	if (!filesUpload.length) return;
	const SIZE = isDesktop ? 160 : 130;

	return filesUpload.map((item, index) => {
		if (item.type === "image") {
			return (
				<ThumbPhoto size={SIZE} style={{ flex: `0 0 ${SIZE}px` }} key={index}>
					<button
						onClick={() => deleteFile(item.id)}
						className='absolute -right-1 -top-1 bg-dark rounded-full shadow-primary w-6 h-6 flex items-center justify-center pointer-events-auto z-[100]'>
						<IconClose width={18} height={18} className='fill-white pointer-events-none' />
					</button>
					<img src={getSrcImage(item.image?.url || item.image)} />
				</ThumbPhoto>
			);
		}
		if (item.type === "video") {
			return (
				<ThumbPhoto size={SIZE} style={{ flex: `0 0 ${SIZE}px` }} className={cn(isEdit && "opacity-50")} key={index}>
					{!isEdit && (
						<button
							onClick={() => deleteFile(item.id)}
							className='absolute -right-1 -top-1 bg-dark rounded-full shadow-primary w-6 h-6 flex items-center justify-center pointer-events-auto z-[100]'>
							<IconClose width={18} height={18} className='fill-white pointer-events-none' />
						</button>
					)}

					<video src={item.url} controls className=' w-full h-full rounded-xl' />
				</ThumbPhoto>
			);
		}
	});
};

const LayoutBody = () => {
	const { filesUpload, setFilesUpload } = useContext(ChatContext);
	const { draftOptions } = useContext(ChatMessagesContext);

	return (
		<>
			{draftOptions.isEdit && (
				<div className='py-3 mb-3 flex border-b border-b-primary800'>
					<IconEdit width={22} height={22} className='mr-3 mt-2 stroke-blue stroke-[1.5px] flex-shrink-0' />
					<div className='flex-grow max-w-[75%]'>
						<p className='text-blue mb-1'>Редактируемое сообщение</p>

						<div className='flex items-center min-w-0'>
							<ChatMessagePreview message={{ ...draftOptions.isEdit, text: draftOptions.isEdit?.text_old }} />

							<div className='cut cut-1'>
								<GetDescrHTML data={draftOptions.isEdit?.text_old} className='html-elements-inline min-w-0 w-full cut-one' />
							</div>
						</div>
					</div>

					<button
						className='ml-auto h-max mt-2'
						onClick={() => {
							draftOptions.setIsEdit?.(false);
							setFilesUpload([]);
						}}>
						<IconClose width={24} height={24} className='fill-primary400' />
					</button>
				</div>
			)}
			{Boolean(!draftOptions.isEdit && filesUpload.length) && (
				<div className='py-3 mb-3 flex items-center gap-3 border-b border-b-primary800 overflow-x-auto scrollbarPrimary'>
					<FilesLayout />
				</div>
			)}
		</>
	);
};

const SendButton = () => {
	const { isVoiceRecording, filesUpload } = useContext(ChatContext);
	const { draftOptions } = useContext(ChatMessagesContext);
	const isDesktop = useSelector(getIsDesktop);

	const checkForSend = Boolean(
		(((draftOptions.isEdit && hasText(draftOptions.isEdit?.text)) || hasText(draftOptions.messageText)) && !isVoiceRecording) ||
			filesUpload.length
	);
	if (!checkForSend) return;

	return (
		<button
			className={cn(isDesktop && styles.ChatBtnBlue, !isDesktop && "ml-4")}
			onMouseDown={e => e.preventDefault()}
			onClick={() => {
				draftOptions.send();
				draftOptions.handleResetEditor();
			}}>
			{draftOptions.isEdit ? (
				<IconCheckedSecond className='mmd1:fill-[#fff]' />
			) : (
				<IconSend width={24} height={24} className='mmd1:fill-[#fff]' />
			)}
			{filesUpload?.length > 0 && (
				<div className='absolute -bottom-2 -right-2 w-6 h-6 md1:w-5 md1:h-5 flex-center-all bg-blue border border-solid border-white rounded-full text-white text-small'>
					{filesUpload.length}
				</div>
			)}
		</button>
	);
};

const ChatBottom = () => {
	const { chatBottomRef, isVoiceRecording, filesUpload, isLoadingDialog, sendVoiceRecorder, setIsVoiceRecording } = useContext(ChatContext);
	const { draftOptions, variant } = useContext(ChatMessagesContext);

	const chatVoiceRecorderOptions = useChatVoiceRecorder({ sendVoiceRecorder, setIsVoiceRecording });

	const isDesktop = useSelector(getIsDesktop);

	const checkIsVoiceRecording = Boolean(
		variant !== "comments" && !draftOptions.isEdit && !hasText(draftOptions.messageText) && !filesUpload.length
	);

	return (
		<div
			className={cn("flex items-center gap-2 mmd1:max-w-[920px] mmd1:mx-auto relative", isLoadingDialog && "opacity-80 pointer-events-none")}
			ref={chatBottomRef}>
			<ChatDraftTooltip draftOptions={draftOptions} />

			<ChatVoiceRecorderContext.Provider value={{ ...chatVoiceRecorderOptions }}>
				<div className={styles.ChatBottom}>
					<LayoutBody />
					<div className={cn(styles.ChatBottomWrapper)}>
						<ChatVoiceRecorderContent />
						{!isVoiceRecording && (
							<>
								{variant !== "comments" && <ChatPresent />}

								<ChatSmile
									setMessageText={value => {
										draftOptions.insertText(value);
									}}
								/>
								<ChatDraft draftOptions={draftOptions} />
								{/* <SlateEditor /> */}
								{variant !== "comments" && <ChatMenu />}
								{!isDesktop && <SendButton />}
							</>
						)}

						{!isDesktop && checkIsVoiceRecording && <ChatVoiceRecorderButton />}
					</div>
				</div>
				{isDesktop && <SendButton />}
				{isDesktop && checkIsVoiceRecording && <ChatVoiceRecorderButton />}
				<ChatVoiceRecorder />
			</ChatVoiceRecorderContext.Provider>
		</div>
	);
};

export default ChatBottom;
