import { ChatTooltipDialog } from "..";
import cn from "classnames";
import React, { memo, useContext } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { useLongPress } from "@/hooks";

import { ChatContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { Avatar } from "@/ui";
import { IconEllipsis, IconMegaphone, IconUsers } from "@/ui/Icons";

import styles from "../../Chat.module.scss";

import { BuildingNameLayout, LastMessageTextLayout, LastMessageTimeLayout, UnreadMessagesCount } from "./ui";

const ChatDialogButton = memo(({ data, options }) => {
	const { sidebarMini, showPopper, setShowPopper } = options;

	const { currentDialog, chatSearchDialog, showMenuDialog, setShowMenuDialog, getDialogUserInfo } = useContext(ChatContext);

	const { closeSearchPanel } = chatSearchDialog;

	const [_, setSearchParams] = useSearchParams();

	const handleLongPress = () => {
		setShowMenuDialog(data);
	};

	const longPressProps = useLongPress(handleLongPress, 500);

	const isDesktop = useSelector(getIsDesktop);
	const dialogInfo = getDialogUserInfo(data);

	const handleButtonClick = () => {
		if (currentDialog.id === data.id) {
			return;
		}
		if (showMenuDialog?.id) {
			setShowMenuDialog(false);
			return;
		}
		if (showPopper) return;
		setSearchParams({ dialog: data.id });
		closeSearchPanel();
	};

	const handleButtonContextMenu = e => {
		if (!isDesktop) return;
		e.preventDefault();
		setShowPopper(prev => (prev ? false : data.id));
	};

	const is_active = currentDialog.id === data.id;

	return (
		<button
			key={data.id}
			type='button'
			className={cn(
				styles.ChatSidebarDialog,
				is_active && styles.ChatSidebarDialogActive,
				showMenuDialog?.id === data.id && !isDesktop && "!bg-primary800",
				!sidebarMini && "h-[82px] max-h-[82px]"
			)}
			onClick={handleButtonClick}
			onContextMenu={handleButtonContextMenu}
			{...longPressProps}>
			<div className='flex gap-3 flex-grow min-w-0'>
				<Avatar size={sidebarMini ? 52 : 60} src={dialogInfo.image} title={dialogInfo.userName} />

				<div className='flex-grow min-w-0'>
					<div className='mt-1.5 flex gap-3 items-center'>
						<div className='font-medium text-defaultMax cut-one flex-grow'>
							<span>
								{dialogInfo.type_group && <IconUsers className={cn("fill-dark mr-1")} width={14} height={14} />}
								{dialogInfo.type_channel && <IconMegaphone className={cn("stroke-dark mr-1")} width={14} height={14} />}
								{dialogInfo.userName}
							</span>
							<BuildingNameLayout data={data} />
						</div>
						{!sidebarMini && <LastMessageTimeLayout data={data} />}
					</div>
					<div className={cn("mt-1 w-full col-span-2 row-start-2 flex items-start gap-3", sidebarMini ? "!hidden" : "")}>
						<div className='text-primary400 w-[95%]'>
							<LastMessageTextLayout data={{ last_message: data.last_message, ...dialogInfo }} is_active={is_active} />
						</div>
						<div className='ml-auto flex flex-grow items-center gap-2 relative'>
							<UnreadMessagesCount data={data} currentDialog={currentDialog} />
							{isDesktop && (
								<ChatTooltipDialog
									options={{
										data,
										showPopper,
										setShowPopper,
										classNameTarget: styles.ChatSidebarDialogTooltip,
										ElementTargetLayout: <IconEllipsis className={cn("pointer-events-none fill-[#000]")} width={16} height={16} />
									}}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</button>
	);
});

export default ChatDialogButton;
