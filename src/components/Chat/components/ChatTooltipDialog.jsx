import cn from "classnames";
import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getDataRequest, sendPostRequest } from "../../../api/requestsApi";
import { ROLE_BUYER } from "../../../constants/roles";
import { ChatContext } from "../../../context";
import { IconAdd, IconHand, IconTrash } from "../../../ui/Icons";
import ModalWrapper from "../../../ui/Modal/ModalWrapper";
import { Tooltip } from "../../../ui/Tooltip";
import styles from "../Chat.module.scss";
import { CHAT_TYPES } from "../constants";

import { ChatModalSearchDialogs } from "./modals";

const ChatTooltipDialog = ({ options }) => {
	const [addParticipants, setAddParticipants] = useState(false);

	const {
		setChannelGroupInfoModal,
		setCurrentDialog,
		setCurrentDialogSettings,
		updateDialogsAndDialogSettings,
		userInfo,
		blockUserOptins,
		setDialogs,
		currentDialog,
		setDeleteDialogModal
	} = useContext(ChatContext);

	const { data, showPopper, setShowPopper, classNameTarget, ElementTargetLayout } = options;

	const type_chat = data.dialog_type === CHAT_TYPES.CHAT;
	const type_channel = data.dialog_type === CHAT_TYPES.CHANNEL;
	const type_group = data.dialog_type === CHAT_TYPES.GROUP;
	const myChannelOrGroup = Boolean((type_channel || type_group) && data.owner?.id === userInfo.id);

	return (
		<>
			<Tooltip
				mobile
				color='white'
				ElementTarget={() => ElementTargetLayout}
				classNameContent='!p-0 overflow-hidden'
				classNameTarget={cn(classNameTarget)}
				placement='bottom'
				event='click'
				value={showPopper == data.id}
				onChange={value => {
					if (value) {
						setShowPopper(prev => (prev ? false : data.id));
					} else {
						setShowPopper(false);
					}
				}}>
				<div className='flex flex-col items-center'>
					{(type_channel || type_group) && (
						<div
							className={styles.ChatMessageButton}
							onClick={() => {
								setShowPopper(false);
								setCurrentDialogSettings(data);
								setChannelGroupInfoModal(true);
							}}>
							<IconAdd width={15} height={15} />
							Информация
						</div>
					)}
					{(type_channel || type_group) && myChannelOrGroup && (
						<div
							className={styles.ChatMessageButton}
							onClick={() => {
								setShowPopper(false);
								setAddParticipants(data.id);
							}}>
							<IconAdd width={15} height={15} />
							Добавить участников
						</div>
					)}

					<div
						className={cn(styles.ChatMessageButton, "text-red")}
						onClick={async () => {
							setShowPopper(false);
							setDeleteDialogModal(data);
						}}>
						<IconTrash width={15} height={15} className='stroke-red' />
						{myChannelOrGroup
							? "Удалить и покинуть"
							: `${type_channel ? "Покинуть канал" : type_group ? "Покинуть группу" : "Удалить диалог"}`}
					</div>
					{!data.organization && type_chat && userInfo.role.id === ROLE_BUYER.id && (
						<div
							className={cn(styles.ChatMessageButton,'text-red')}
							onClick={async () => {
								setShowPopper(false);
								const companion = data.companions.find(companion => companion.id !== userInfo.id);
								if (!companion?.id) return;
								if (data.my_block) {
									await blockUserOptins.blockUserDelete(companion.id);
									setCurrentDialog(prev => {
										if (prev.id === currentDialog.id) {
											return { ...prev, my_block: false };
										} else {
											return prev;
										}
									});
									setDialogs(prev =>
										prev.map(item => {
											if (item.id === data.id) {
												return { ...item, my_block: false };
											}

											return item;
										})
									);
								} else {
									await blockUserOptins.blockUserCreate(companion.id);
									setCurrentDialog(prev => {
										if (prev.id === currentDialog.id) {
											return { ...prev, my_block: true };
										} else {
											return prev;
										}
									});
									setDialogs(prev => {
										return prev.map(item => {
											if (item.id === data.id) {
												return { ...item, my_block: true };
											}

											return item;
										});
									});
								}
							}}>
							<IconHand width={16} height={16} className='stroke-red' />
							{data.my_block ? "Разблокировать пользователя" : "Заблокировать пользователя"}
						</div>
					)}
				</div>
			</Tooltip>

			{myChannelOrGroup && (
				<ModalWrapper condition={addParticipants}>
					<ChatModalSearchDialogs
						condition={addParticipants}
						set={setAddParticipants}
						selectedType='add_to_dialog'
						options={{ title: "Добавить участников" }}
						onChange={async (dialog_id, user_ids) => {
							try {
								await sendPostRequest(`/api/dialogs/${dialog_id}/user/add`, { user_ids });
								await updateDialogsAndDialogSettings();
							} catch (error) {
								console.log(error);
							}
						}}
					/>
				</ModalWrapper>
			)}
		</>
	);
};

export const ChatMenuDialog = () => {
	const { setChannelGroupInfoModal, setCurrentDialogSettings, showMenuDialog, setShowMenuDialog, setDeleteDialogModal } = useContext(ChatContext);

	const type_channel = showMenuDialog.dialog_type === CHAT_TYPES.CHANNEL;
	const type_group = showMenuDialog.dialog_type === CHAT_TYPES.GROUP;

	if (!showMenuDialog) return;

	return (
		<>
			<div className='ml-auto flex items-center'>
				{(type_channel || type_group) && (
					<div
						className={cn(styles.ChatMessageButton, "p-2.5")}
						onClick={() => {
							setShowMenuDialog(false);
							setCurrentDialogSettings(showMenuDialog);
							setChannelGroupInfoModal(true);
						}}>
						<IconAdd width={15} height={15} />
					</div>
				)}

				<div
					className={cn(styles.ChatMessageButton, "p-2.5")}
					onClick={async () => {
						setShowMenuDialog(false);
						setDeleteDialogModal(showMenuDialog);
					}}>
					<IconTrash width={15} height={15} className='stroke-red' />
				</div>
			</div>
		</>
	);
};

export default ChatTooltipDialog;
