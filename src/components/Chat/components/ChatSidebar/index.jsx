import cn from "classnames";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { checkDialogId } from "@/api/getDialogId";

import { ChatContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { Maybe, ModalWrapper } from "@/ui";
import { IconClose } from "@/ui/Icons";

import styles from "../../Chat.module.scss";
import { CHAT_TYPES } from "../../constants";
import { ChatMenuDialog } from "../ChatTooltipDialog";
import { ChatCreateDialogLayout, MenuModal } from "../modals";

import ChatDialogs from "./ChatDialogs";

const ChatSidebar = () => {
	const {
		resizeSidebarOptions,
		showMenuDialog,
		setShowMenuDialog,
		setSidebarModalOpen,
		createDialogWithDevelopModal,
		setCreateDialogWithDevelopModal,
		createDialogWithSpecialistModal,
		setCreateDialogWithSpecialistModal
	} = useContext(ChatContext);

	const { sidebarRef, sidebarWidth, startResizing, sidebarMini, sidebarOptions } = resizeSidebarOptions;

	const isDesktop = useSelector(getIsDesktop);

	const [_, setSearchParams] = useSearchParams();

	const onSubmitHandler = async data => {
		const dialog_id = await checkDialogId(data);

		setCreateDialogWithDevelopModal(false);
		setCreateDialogWithSpecialistModal(false);
		setSidebarModalOpen(false);

		setTimeout(() => {
			if (dialog_id) {
				setSearchParams({ dialog: dialog_id });
			} else {
				const params = {
					not_dialog: 1,
					recipients_id: data.recipients_id || "",
					organization_id: data.organization_id || ""
				};

				const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ""));
				setSearchParams(new URLSearchParams(Object.fromEntries(Object.entries(filteredParams).map(([k, v]) => [k, v.toString()]))));
			}
		}, 50);
	};

	return (
		<div
			className={cn(styles.ChatSidebar, sidebarMini && styles.ChatSidebarMini)}
			ref={sidebarRef}
			style={{
				width: isDesktop ? `${sidebarWidth <= sidebarOptions.min_width ? `${sidebarOptions.mini_width}px` : `${sidebarWidth}px`}` : "100%"
			}}>
			<div
				className={cn(
					"min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 md1:min-h-[52px] md1:h-[52px]",
					sidebarMini && "justify-center"
				)}>
				{!showMenuDialog && <h3 className='title-2 pl-1'>Чаты</h3>}
				<Maybe condition={!isDesktop}>
					{showMenuDialog && (
						<button className={cn("flex-center-all")} onClick={() => setShowMenuDialog(false)}>
							<IconClose width={26} height={26} />
						</button>
					)}
					<ChatMenuDialog />
				</Maybe>
			</div>
			<ChatDialogs sidebarMini={sidebarMini} />

			{isDesktop && <div className={styles.ChatSidebarResizer} onMouseDown={startResizing} />}
			<MenuModal />
			<ModalWrapper condition={createDialogWithDevelopModal}>
				<ChatCreateDialogLayout
					condition={createDialogWithDevelopModal}
					set={setCreateDialogWithDevelopModal}
					options={{
						type: "developers",
						api: "/api/developers/page",
						inputPlaceholder: isDesktop ? "Название застройщика" : "Застройщик",
						onSubmitDeveloper: item => {
							onSubmitHandler({ organization_id: item.id, type: CHAT_TYPES.CHAT });
						},
						onSubmitSpecialist: item => {
							onSubmitHandler({ recipients_id: [item.id], type: CHAT_TYPES.CHAT });
						}
					}}
				/>
			</ModalWrapper>
			<ModalWrapper condition={createDialogWithSpecialistModal}>
				<ChatCreateDialogLayout
					condition={createDialogWithSpecialistModal}
					set={setCreateDialogWithSpecialistModal}
					options={{
						type: "specialists",
						api: "/api/specialists/page",
						inputPlaceholder: isDesktop ? "ФИО менеджера" : "Менеджер",
						onSubmitDeveloper: item => {
							onSubmitHandler({ organization_id: item.id, type: CHAT_TYPES.CHAT });
						},
						onSubmitSpecialist: item => {
							onSubmitHandler({ recipients_id: [item.id], type: CHAT_TYPES.CHAT });
						}
					}}
				/>
			</ModalWrapper>
		</div>
	);
};

export default ChatSidebar;
