import { useSelector } from "react-redux";

import { getUserInfo } from "@/redux";

import isEmptyArrObj from "../../../../../helpers/isEmptyArrObj";
import { getHtmlText } from "../../ChatDraft/getHtmlText";
import { ChatMessagePreview } from "../../ChatMessages/ui";

const LastMessageTextLayout = ({ data }) => {
	const last_message = data.last_message;
	if (!(last_message && !isEmptyArrObj(last_message))) return;

	const userInfo = useSelector(getUserInfo);

	return (
		<div className='cut cut-2 break-all w-full'>
			<span className='text-blue font-medium mr-1 leading-none'>{userInfo.id === last_message.user.id ? "Вы" : last_message.user.name}:</span>
			<ChatMessagePreview message={last_message} className='inline-block' />
			{Boolean(last_message.text) && <span className='text-small'>{getHtmlText(last_message.text)}</span>}
		</div>
	);
};

export default LastMessageTextLayout;
