import cn from "classnames";
import { useContext, useEffect, useState } from "react";

import { declensionComments } from "@/helpers";

import { ChatContext } from "@/context";

import { IconArrow } from "@/ui/Icons";

import { ChatMessages } from "../..";
import CHAT_BG from "../../../../../assets/img/chat-bg.jpg";
import { useChatDraft } from "../../ChatDraft/useChatDraft";

const ChatMessageCommentsPanel = () => {
	const { messageCommentsOptions, getDialog } = useContext(ChatContext);
	const {
		messageComments,
		messageCommentsIsOpen,
		messageCommentPanelClose,
		messageCommentCreate,
		messageCommentUpdate,
		messageCommentDelete,
		messageCommentGetAll,
		messagesLength,
		isLoadingComments
	} = messageCommentsOptions;

	const [messageText, setMessageText] = useState("");

	const [isActive, setIsActive] = useState(false);
	const [showPopperMessage, setShowPopperMessage] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const sendMessage = async () => {
		try {
			setMessageText("");
			if (Boolean(isEdit)) {
				await messageCommentUpdate(isEdit.id, messageComments.dialog_id, messageComments.message_id, isEdit.text);
				setIsEdit(false);
			} else {
				await messageCommentCreate(messageComments.dialog_id, messageComments.message_id, messageText);
			}
			await messageCommentGetAll(messageComments.dialog_id, messageComments.message_id);
		} catch (error) {}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsActive(messageCommentsIsOpen);
		}, 20);

		return () => clearTimeout(timer);
	}, [messageCommentsIsOpen]);

	const draftOptions = useChatDraft({
		send: sendMessage,
		messageText,
		initialValue: isEdit ? isEdit.text : messageText,
		isEdit: isEdit,
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
		}
	});

	return (
		<div
			className={cn(
				"bg-white absolute w-full h-full z-[999] top-0 left-0 transition-all duration-300 flex flex-col",
				!messageCommentsIsOpen && "hidden",
				!isActive && "left-full invisible"
			)}>
			<div className='min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white md1:min-h-[56px] md1:h-[56px]'>
				<button type='button' className='flex-center-all' onClick={messageCommentPanelClose}>
					<IconArrow className='rotate-180 fill-primary400' width={32} height={32} />
				</button>
				<div className='ml-4'>
					<h3 className='title-3-5'>Обсуждение</h3>
					<p className='text-primary400'>{declensionComments(messagesLength)}</p>
				</div>
			</div>
			<div
				className='bg-[#e3efff] flex-grow flex flex-col overflow-hidden bg-no-repeat bg-cover'
				style={{ backgroundImage: `url(${CHAT_BG})` }}>
				{isActive && !isLoadingComments && (
					<>
						<ChatMessages
							messages={messageComments.data}
							variant='comments'
							comments={false}
							showPopperMessage={showPopperMessage}
							setShowPopperMessage={setShowPopperMessage}
							deleteMessage={async data => {
								if (!data) return;
								await messageCommentDelete(data.ids[0], data.dialog_id, data.message_id);
								await messageCommentGetAll(data.dialog_id, data.message_id);
								await getDialog(data.dialog_id);
							}}
							draftOptions={draftOptions}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default ChatMessageCommentsPanel;
