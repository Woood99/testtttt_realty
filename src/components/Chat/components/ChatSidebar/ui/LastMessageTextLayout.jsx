import { useSelector } from "react-redux";

import { isEmptyArrObj, truncateString } from "@/helpers";

import { getUserInfo } from "@/redux";

import { getHtmlText } from "../../ChatDraft/getHtmlText";
import { ChatMessagePreview } from "../../ChatMessages/ui";

const LastMessageTextLayout = ({ data }) => {
	const last_message = data.last_message;
	if (!(last_message && !isEmptyArrObj(last_message))) return;

	const userInfo = useSelector(getUserInfo);

	return (
		<div className='cut cut-2 break-all w-full'>
			<span className='text-blue font-medium mr-1 leading-none'>
				{(data.type_chat || data.type_group) && <>{userInfo.id === last_message.user.id ? "Вы" : truncateString(data.userName, 12)}:</>}
			</span>
			<ChatMessagePreview message={last_message} className='text-small' />
			{Boolean(last_message.text) && <span className='text-small'>{getHtmlText(last_message.text)}</span>}
		</div>
	);
};

export default LastMessageTextLayout;
