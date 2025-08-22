import { ChatMessages, ChatPinMessagesPanel, ChatPinTop } from "..";
import cn from "classnames";
import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { useQueryParams } from "@/hooks";

import { isEmptyArrObj } from "@/helpers";

import { ChatContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { Spinner } from "@/ui";
import { IconLock } from "@/ui/Icons";

import CHAT_BG from "../../../../assets/img/chat-bg.jpg";
import styles from "../../Chat.module.scss";
import { useChatDraft } from "../ChatDraft/useChatDraft";
import { ChatMessageCommentsPanel } from "../ChatMessages/ui";
import { useSlateEditor } from "../SlateEditor";

import ChatMainBuildingTop from "./ChatMainBuildingTop";
import ChatMainUserTop from "./ChatMainUserTop";

const ChatMain = () => {
	const {
		currentDialog,
		isLoadingDialog,
		messages,
		deleteMessages,
		allowScroll,
		showPopperMessage,
		setShowPopperMessage,
		showPopperMessagePosition,
		setShowPopperMessagePosition,
		sendMessage,
		messageText,
		isEdit,
		setIsEdit,
		setMessageText,
		authUser,
		authLoading,
		isLoadingDialogs,
		setIsOpenSmileMenu
	} = useContext(ChatContext);

	const isDesktop = useSelector(getIsDesktop);
	const params = useQueryParams();

	const draftOptions = useSlateEditor({
		value: messageText,
		isEdit,
		setIsEdit,
		onChange: value => {
			if (isEdit) {
				setIsEdit(prev => ({
					...prev,
					text: value
				}));
			} else {
				setMessageText(value);
			}
		},
		send: value => {
			sendMessage(null, null, value);
		},
		handleFocus: () => {
			setIsOpenSmileMenu(false);
		}
	});

	return (
		<div
			className={cn(
				styles.ChatMain,
				!isDesktop && (params.dialog || params.not_dialog || !isEmptyArrObj(currentDialog)) && styles.ChatMainActive
			)}>
			<div className={styles.ChatMainInner} style={{ backgroundImage: `url(${CHAT_BG})` }}>
				{params.dialog || params.not_dialog || (currentDialog.is_fake && !currentDialog.is_member) ? (
					<>
						<ChatMainUserTop />
						<ChatMainBuildingTop />
						<ChatPinTop />
						{allowScroll && (
							<div className='h-full flex-center-all flex-col gap-8 mx-4'>
								<div className='title-2-5'>
									<Spinner className='!border-dark !border-b-[transparent]' />
								</div>
								<div className='title-2-5 flex items-center gap-3 mx-4 text-center md1:flex-col'>
									<IconLock width={25} height={25} />
									<span>Защищено сквозным шифрованием</span>
								</div>
							</div>
						)}
						{Boolean(+params.dialog === currentDialog.id || (currentDialog.is_fake && !currentDialog.is_member)) && (
							<ChatMessages
								messages={messages}
								comments={false}
								deleteMessage={data => {
									if (!data) return;
									deleteMessages(data.ids, data.dialog_id, data.myMessage);
								}}
								showPopperMessage={showPopperMessage}
								setShowPopperMessage={setShowPopperMessage}
								showPopperMessagePosition={showPopperMessagePosition}
								setShowPopperMessagePosition={setShowPopperMessagePosition}
								draftOptions={draftOptions}
							/>
						)}
					</>
				) : (
					<>
						{!(!authUser && !authLoading && !isLoadingDialogs && !isLoadingDialog) && (
							<div className='title-2-5 h-full flex-center-all gap-3 mx-4 text-center'>Выберите, кому хотели бы написать</div>
						)}
					</>
				)}
			</div>
			<ChatPinMessagesPanel />
			<ChatMessageCommentsPanel />
		</div>
	);
};

export default ChatMain;
