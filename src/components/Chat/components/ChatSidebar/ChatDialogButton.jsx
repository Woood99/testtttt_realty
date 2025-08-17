import { ChatTooltipDialog } from "..";
import cn from "classnames";
import React, { memo, useContext } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { ROLE_ADMIN } from "@/constants";

import { useLongPress } from "@/hooks";

import { getShortNameSurname } from "@/helpers";

import { ChatContext } from "@/context";

import { getIsDesktop, getUserInfo } from "@/redux";

import { Avatar, UserInfo } from "@/ui";
import { IconEllipsis, IconMegaphone, IconUsers } from "@/ui/Icons";

import styles from "../../Chat.module.scss";
import { CHAT_TYPES } from "../../constants";

import { BuildingNameLayout, LastMessageTextLayout, LastMessageTimeLayout, UnreadMessagesCount } from "./ui";

const ChatDialogButton = memo(({ data, options }) => {
	const { sidebarMini, showPopper, setShowPopper } = options;

	const { currentDialog, chatSearchDialog, showMenuDialog, setShowMenuDialog } = useContext(ChatContext);

	const { closeSearchPanel } = chatSearchDialog;
	const userInfo = useSelector(getUserInfo);

	const [_, setSearchParams] = useSearchParams();

	const handleLongPress = () => {
		console.log(data);

		setShowMenuDialog(data);
	};

	const longPressProps = useLongPress(handleLongPress, 500);

	const isDesktop = useSelector(getIsDesktop);

	const type_chat = data.dialog_type === CHAT_TYPES.CHAT;
	const type_channel = data.dialog_type === CHAT_TYPES.CHANNEL;
	const type_group = data.dialog_type === CHAT_TYPES.GROUP;
	const is_organization = data.organization && userInfo?.role?.id !== ROLE_ADMIN.id;
	let dialog_info = {};

	if (is_organization) {
		dialog_info = {
			...data.organization,
			isOrganization: true
		};
	} else {
		if (type_chat && data.companions?.length) {
			dialog_info = {
				...data.companions.find(item => item.id !== userInfo.id),
				isOrganization: false
			};
		} else {
			dialog_info = {
				name: data.name,
				image: data.image,
				isOrganization: false
			};
		}
	}

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

	const userName = is_organization ? dialog_info.name : getShortNameSurname(dialog_info.name, dialog_info.surname);

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
				<Avatar size={sidebarMini ? 52 : 60} src={dialog_info.image} title={userName} />

				<div className='flex-grow min-w-0'>
					<div className='mt-1.5 flex gap-3 items-center'>
						<div className='font-medium text-defaultMax cut-one flex-grow'>
							<span>
								{type_group && <IconUsers className={cn("fill-dark mr-1")} width={14} height={14} />}
								{type_channel && <IconMegaphone className={cn("fill-dark mr-1")} width={14} height={14} />}
								{userName}
							</span>
							<BuildingNameLayout data={data} />
						</div>
						{!sidebarMini && <LastMessageTimeLayout data={data} />}
					</div>
					<div className={cn("mt-1 w-full col-span-2 row-start-2 flex items-start gap-3", sidebarMini ? "!hidden" : "")}>
						<div className='text-primary400 w-[95%]'>
							<LastMessageTextLayout data={data} is_active={is_active} />
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
				{/* {!sidebarMini && (
					<div className='flex flex-col items-end  gap-1.5 mt-2 md1:pointer-events-none'>
						<div className='flex items-center gap-1 relative'>
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
				)} */}
			</div>
			{/* <UserInfo
				sizeAvatar={sidebarMini ? 52 : 64}
				avatar={dialog_info.image}
				textAvatar={userName}
				name={
					<div className='cut-one afsfasfasfas'>
						<span>
							{type_group && <IconUsers className={cn("fill-dark mr-1")} width={14} height={14} />}
							{type_channel && <IconMegaphone className={cn("fill-dark mr-1")} width={14} height={14} />}
							{userName}
						</span>
						<BuildingNameLayout data={data} />
					</div>
				}
				classListName='text-defaultMax mb-0.5'
				className={cn("min-w-0 mr-4 md1:pointer-events-none", sidebarMini && "!mr-0")}
				classNameContent={cn("mt-1.5 flex-grow", sidebarMini ? "!hidden" : "")}
				classNameWrapper='!justify-start'
				posChildren={
					<div className={cn("text-primary400 w-full", sidebarMini ? "!hidden" : "")}>
						<LastMessageTextLayout data={data} is_active={is_active} />
					</div>
				}
				centered
			/> */}
		</button>
	);
});

export default ChatDialogButton;
