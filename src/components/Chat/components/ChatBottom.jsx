import { ChatMenu, ChatPresent, ChatSmile, ChatVoiceRecorder } from ".";
import cn from "classnames";
import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { ChatContext, ChatMessagesContext, ChatVoiceRecorderContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { FilesList } from "@/components/DragDrop/DragDropItems";

import { IconCheckedSecond, IconClose, IconEdit, IconSend } from "@/ui/Icons";

import styles from "../Chat.module.scss";
import { useChatVoiceRecorder } from "../hooks";

import { getHtmlText } from "./ChatDraft/getHtmlText";
import { ChatMessagePreview } from "./ChatMessages/ui";
import { ChatVoiceRecorderButton, ChatVoiceRecorderContent } from "./ChatVoiceRecorder";
import { SlateEditor, clearEditor, insertTextSafe, isEditorEmpty, setEditorValue } from "./SlateEditor";

const LayoutBody = () => {
	const { filesUpload, setFilesUpload } = useContext(ChatContext);
	const { draftOptions, deleteFile } = useContext(ChatMessagesContext);
	const isDesktop = useSelector(getIsDesktop);
	const SIZE = isDesktop ? 160 : 130;

	return (
		<>
			{draftOptions.isEdit && (
				<div className='py-3 mb-3 flex border-b border-b-primary800'>
					<IconEdit width={18} height={18} className='mr-3 mt-2 stroke-blue flex-shrink-0' />
					<div className='flex-grow max-w-[90%]'>
						<p className='text-blue mb-1'>Редактируемое сообщение</p>
						<div className='flex items-center min-w-0'>
							<ChatMessagePreview message={{ ...draftOptions.isEdit, text: draftOptions.isEdit?.text_old }} />
							<div className='cut cut-1'>{getHtmlText(draftOptions.isEdit?.text_old)}</div>
						</div>
					</div>

					<button
						className='ml-auto h-max mt-2'
						onClick={() => {
							draftOptions.setIsEdit?.(false);
							setFilesUpload([]);
							setEditorValue(draftOptions.editor, null);
						}}>
						<IconClose width={24} height={24} className='fill-primary400' />
					</button>
				</div>
			)}
			{Boolean(!draftOptions.isEdit && filesUpload.length) && (
				<FilesList
					files={filesUpload}
					size={SIZE}
					deleteFile={deleteFile}
					className='py-3 mb-3 flex items-center gap-3 border-b border-b-primary800 overflow-x-auto scrollbarPrimary'
				/>
			)}
		</>
	);
};

const SendButton = () => {
	const { isVoiceRecording, filesUpload } = useContext(ChatContext);
	const { draftOptions } = useContext(ChatMessagesContext);
	const isDesktop = useSelector(getIsDesktop);

	const checkForSend = Boolean(
		(((draftOptions.isEdit && !isEditorEmpty(draftOptions.editor)) || !isEditorEmpty(draftOptions.editor)) && !isVoiceRecording) ||
			filesUpload.length
	);
	if (!checkForSend) return;

	return (
		<button
			className={cn(isDesktop && styles.ChatBtnBlue, !isDesktop && "ml-4")}
			onMouseDown={e => e.preventDefault()}
			onClick={() => {
				draftOptions.onSubmitHandler();
				clearEditor(draftOptions.editor);
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
		variant !== "comments" && !draftOptions.isEdit && isEditorEmpty(draftOptions.editor) && !filesUpload.length
	);

	return (
		<div
			className={cn("flex items-center gap-2 mmd1:max-w-[920px] mmd1:mx-auto relative", isLoadingDialog && "opacity-80 pointer-events-none")}
			ref={chatBottomRef}>
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
										insertTextSafe(draftOptions.editor, value);
									}}
								/>
								<SlateEditor options={draftOptions} />
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
