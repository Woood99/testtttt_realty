import cn from "classnames";
import { useContext } from "react";

import { ChatContext } from "../../../../context";
import { getLastElementArray } from "../../../../helpers/arrayMethods";
import { getHtmlText } from "../ChatDraft/getHtmlText";
import { ChatMessagePreview } from "../ChatMessages/ui";
import { IconPin } from "@/ui/Icons";

const ChatPinTop = () => {
	const { chatPinMessages, allowScroll, isLoadingDialog } = useContext(ChatContext);
	const { hasPinMessage, pinMessagePanelOpen, pinMessagesList, pinMessagesLength } = chatPinMessages;

	if (!hasPinMessage || isLoadingDialog || allowScroll) return;
	const heightPin = pinMessagesLength === 1 ? "min-h-full" : pinMessagesLength === 2 ? "h-[19px]" : "min-h-[13px]";
	const pinLast = getLastElementArray(pinMessagesList);

	return (
		<div
			className='min-h-14 h-14 px-4 py-2 border-b border-b-primary800 bg-white overflow-hidden md1:min-h-[54px] md1:h-[54px] cursor-pointer'
			onClick={pinMessagePanelOpen}>
			<div className='flex gap-2 h-full'>
				<div className='flex flex-col gap-[1px] overflow-y-auto scrollbarPrimary scrollbarPrimaryNoVisible flex-shrink-0'>
					{pinMessagesList.map(item => {
						return (
							<div
								key={item.id}
								className={cn("bg-blue w-0.5 h-full opacity-60", pinLast.id === item.id && "opacity-100", heightPin)}
							/>
						);
					})}
				</div>
				<div className='flex flex-col justify-between flex-grow max-w-[92%] w-full'>
					<h3 className='font-medium text-dark text-defaultMax md1:text-default'>Закреплённые сообщения</h3>
					<div className='text-dark w-full flex items-center min-w-0'>
						<ChatMessagePreview message={pinLast} className='-translate-y-[2px]' />
						{Boolean(pinLast.text) && <span className='text-small ml-1 cut-one'>{getHtmlText(pinLast.text)}</span>}
					</div>
				</div>
				<div className='self-center ml-auto flex-center-all'>
					<IconPin width={18} height={18} className='stroke-dark' />
				</div>
			</div>
		</div>
	);
};

export default ChatPinTop;
