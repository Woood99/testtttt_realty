import cn from "classnames";
import React, { memo, useContext, useState } from "react";

import { ChatContext } from "@/context";

import { RepeatContent } from "@/components";

import { SimpleScrollbar, WebSkeleton } from "@/ui";

import ChatEmptyDialogs from "../ChatEmptyDialogs";
import ChatNotAuth from "../ChatNotAuth";

import ChatDialogButton from "./ChatDialogButton";

const ChatDialogs = memo(({ sidebarMini = false }) => {
	const { isLoadingDialogs, dialogs, resizeSidebarOptions, isLoadingDialog, notAuth } = useContext(ChatContext);
	const { sidebarWidth, sidebarOptions } = resizeSidebarOptions;

	const [showPopper, setShowPopper] = useState(false);

	const emptyDialogs = dialogs.length === 0 && !isLoadingDialogs;

	return (
		<SimpleScrollbar
			className={cn("overflow-y-auto mmd1:px-2 mmd1:py-2", (notAuth || emptyDialogs) && "flex flex-col flex-grow")}
			variant='custom'>
			<div className={cn("flex flex-col gap-1", !isLoadingDialogs && isLoadingDialog && "opacity-85 pointer-events-none")}>
				{isLoadingDialogs ? (
					<RepeatContent count={12}>
						<div className='flex gap-3 items-center p-3'>
							<WebSkeleton className='w-[54px] h-[54px] rounded-full aspect-square' />
							{sidebarWidth > sidebarOptions.min_width && <WebSkeleton className='w-[150px] h-6 rounded-lg' />}
						</div>
					</RepeatContent>
				) : (
					<>
						{dialogs.map(item => {
							return <ChatDialogButton key={item.id} data={item} options={{ sidebarMini, showPopper, setShowPopper }} />;
						})}
					</>
				)}
			</div>
			{notAuth && <ChatNotAuth />}
			{emptyDialogs && !notAuth && <ChatEmptyDialogs />}
		</SimpleScrollbar>
	);
});

export default ChatDialogs;
