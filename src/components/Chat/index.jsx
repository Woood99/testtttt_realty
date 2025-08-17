import cn from "classnames";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { RoutesPath } from "@/constants";

import { useHistoryState } from "@/hooks";

import { ChatContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { ModalWrapper } from "@/ui";

import styles from "./Chat.module.scss";
import {
	ChannelGroupFormModal,
	ChannelGroupInfoModal,
	ChannelGroupSettingsModal,
	ChatApartmentsByBuilding,
	ChatContacts,
	ChatMain,
	ChatModalBlockedUserList,
	ChatModalDeleteDialog,
	ChatModalDeleteMessages,
	ChatSidebar,
	ChatSidebarMenu,
	ChatSidebarRight
} from "./components";
import { CHAT_TYPES } from "./constants";
import { useChat, useChatSearchDialog, useResizeSidebar } from "./hooks";

const Chat = ({ onCloseModal, defaultDialogId = null, variantChat = "page", tag, fake_dialog = null }) => {
	const options = useChat({ defaultDialogId, tag, fake_dialog });
	const location = useLocation();
	const isDesktop = useSelector(getIsDesktop);

	const chatSearchDialog = useChatSearchDialog();
	const resizeSidebarOptions = useResizeSidebar(variantChat === "mini");

	const [groupFormModal, setGroupFormModal] = useState(false);
	const [channelFormModal, setChannelFormModal] = useState(false);
	const [channelGroupSettingsModal, setChannelGroupSettingsModal] = useState(false);
	const [channelGroupInfoModal, setChannelGroupInfoModal] = useState(false);
	const [blockedUserList, setBlockedUserList] = useState(false);
	const [contactsModalOpen, setContactsModalOpen] = useHistoryState(false);

	return (
		<ChatContext.Provider
			value={{
				onCloseModal,
				variantChat,
				chatSearchDialog,
				groupFormModal,
				setGroupFormModal,
				channelFormModal,
				setChannelFormModal,
				channelGroupSettingsModal,
				setChannelGroupSettingsModal,
				channelGroupInfoModal,
				setChannelGroupInfoModal,
				setBlockedUserList,
				...options,
				resizeSidebarOptions,
				fake_dialog,
				contactsModalOpen,
				setContactsModalOpen
			}}>
			<div
				className={cn(
					styles.ChatRoot,
					variantChat === "mini" && styles.ChatRootMini,
					location.pathname === RoutesPath.chat && options.themeOptions.theme === "dark" && styles.ChatThemeDark,
					options.showPopperMessage && !isDesktop && styles.ChatRootShadow
				)}
				ref={options.chatRootRef}
				onClick={() => {
					if (options.showPopperMessage) {
						options.setShowPopperMessage(false);
					}
				}}>
				<div className={styles.ChatContainer}>
					<ChatSidebarMenu />
					<ChatSidebar />
					<ChatMain />
					<ChatSidebarRight />
				</div>
			</div>
			<ChatModalDeleteMessages deleteMessagesModal={options.deleteMessagesModal} setDeleteMessagesModal={options.setDeleteMessagesModal} />

			<ChannelGroupFormModal type={CHAT_TYPES.GROUP} condition={groupFormModal} set={setGroupFormModal} />
			<ChannelGroupFormModal type={CHAT_TYPES.CHANNEL} condition={channelFormModal} set={setChannelFormModal} />
			<ChannelGroupSettingsModal condition={channelGroupSettingsModal} set={setChannelGroupSettingsModal} />
			<ChannelGroupInfoModal condition={channelGroupInfoModal} set={setChannelGroupInfoModal} dialog={options.currentDialogSettings} />
			<ModalWrapper condition={options.apartmentsByBuildingModal}>
				<ChatApartmentsByBuilding />
			</ModalWrapper>
			<ModalWrapper condition={blockedUserList}>
				<ChatModalBlockedUserList condition={blockedUserList} set={setBlockedUserList} />
			</ModalWrapper>
			<ChatContacts />
			<ChatModalDeleteDialog />
		</ChatContext.Provider>
	);
};

export default Chat;
