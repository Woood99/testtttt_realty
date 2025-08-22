import cn from "classnames";
import React from "react";
import { useSelector } from "react-redux";

import { getIsDesktop, getUserInfo } from "@/redux";

import { IconChat } from "@/ui/Icons";

import { RoutesPath } from "../../constants/RoutesPath";

const ChatBtnFixed = () => {
	const userInfo = useSelector(getUserInfo);
	const isDesktop = useSelector(getIsDesktop);
	const count = userInfo?.counts?.dialogs || 0;

	return (
		<a href={RoutesPath.chat} className={cn("fixed bottom-4 right-4 flex-center-all w-16 h-16 md1:w-14 md1:h-14 bg-blue rounded-xl z-[9999]")}>
			{Boolean(count) && (
				<div className='bg-dark text-white rounded-full w-5 h-5 text-[12px] leading-none flex-center-all -top-2 -right-2 absolute'>
					{count}
				</div>
			)}
			<IconChat className='stroke-white' width={isDesktop ? 28 : 24} height={isDesktop ? 28 : 24} />
		</a>
	);
};

export default ChatBtnFixed;
