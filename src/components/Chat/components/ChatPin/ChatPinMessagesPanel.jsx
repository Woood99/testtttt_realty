import { ChatMessages } from "..";
import cn from "classnames";
import { useContext, useEffect, useState } from "react";

import { declensionPinMessages } from "@/helpers";

import { ChatContext } from "@/context";

import { IconArrow } from "@/ui/Icons";

import CHAT_BG from "../../../../assets/img/chat-bg.jpg";
import { useChatDraft } from "../ChatDraft/useChatDraft";

const ChatPinMessagesPanel = () => {
	const { chatPinMessages, deleteMessages } = useContext(ChatContext);
	const { isPinMessagePanelOpen, pinMessagePanelClose, pinMessages, pinMessagesLength } = chatPinMessages;

	const [isActive, setIsActive] = useState(false);
	const [showPopperMessage, setShowPopperMessage] = useState(false);
	const [showPopperMessagePosition, setShowPopperMessagePosition] = useState(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsActive(isPinMessagePanelOpen);
		}, 20);

		return () => clearTimeout(timer);
	}, [isPinMessagePanelOpen]);

	const draftOptions = useChatDraft({
		onChange: value => {}
	});

	return (
		<div
			className={cn(
				"bg-white absolute w-full h-full z-[999] top-0 left-0 transition-all duration-300 flex flex-col",
				!isPinMessagePanelOpen && "hidden",
				!isActive && "left-full invisible"
			)}>
			<div className='min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white md1:min-h-[56px] md1:h-[56px]'>
				<button type='button' className='flex-center-all' onClick={pinMessagePanelClose}>
					<IconArrow className='rotate-180 fill-primary400' width={32} height={32} />
				</button>
				<h3 className='title-3-5 ml-4'>{declensionPinMessages(pinMessagesLength)}</h3>
			</div>
			<div
				className='bg-[#e3efff] flex-grow flex flex-col overflow-hidden bg-no-repeat bg-cover'
				style={{ backgroundImage: `url(${CHAT_BG})` }}>
				{isActive && (
					<ChatMessages
						messages={pinMessages}
						variant='pin'
						comments={false}
						showPopperMessage={showPopperMessage}
						setShowPopperMessage={setShowPopperMessage}
						showPopperMessagePosition={showPopperMessagePosition}
						setShowPopperMessagePosition={setShowPopperMessagePosition}
						deleteMessage={data => {
							if (!data) return;
							deleteMessages(data.ids, data.dialog_id, data.myMessage);
						}}
						editMessage={false}
						draftOptions={draftOptions}
					/>
				)}
			</div>
		</div>
	);
};

export default ChatPinMessagesPanel;
