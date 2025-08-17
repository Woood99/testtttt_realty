import cn from "classnames";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";

import { handleCopyText } from "@/helpers";

import { ChatContext, ChatMessageContext, ChatMessagesContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { SimpleScrollbar, Tooltip } from "@/ui";
import { IconArrow, IconEdit, IconEllipsis, IconTrash } from "@/ui/Icons";

import { ChatMessageReads } from "../..";
import styles from "../../../Chat.module.scss";
import { CHAT_TYPES } from "../../../constants";
import { useChatReaction } from "../../../hooks";
import { getHtmlText } from "../../ChatDraft/getHtmlText";
import { MenuLayout, SmileItem } from "../../ChatSmile";

import { SMILES, SMILES_ONE, SMILES_REACTIONS } from "@/data/smiles";

const ChatMessageTooltip = () => {
	const { cachedDialog, setCachedDialog } = useContext(ChatContext);
	const isDesktop = useSelector(getIsDesktop);

	const { draftOptions, showPopperPosition, setShowPopperPosition } = useContext(ChatMessagesContext);
	const {
		data,
		showPopper,
		setShowPopper,
		myMessage,
		userInfo,
		getDialog,
		currentDialog,
		currentDialogUserInfo,
		chatPinMessages,
		deleteMessage,
		setFilesUpload,
		audioData,
		videoData,
		editMessage,
		variant
	} = useContext(ChatMessageContext);

	const { chatReactionCreate, chatReactionDelete, chatReactionCreateFake, chatReactionDeleteFake } = useChatReaction();
	const { pinMessageCreate, pinMessageDelete, pinMessageCreateFake, pinMessageDeleteFake, pinMessageGetAll } = chatPinMessages;
	const [isOpenMoreSmiles, setIsOpenMoreSmiles] = useState(false);

	const isVisiblePin = variant !== "comments" && (currentDialog.dialog_type === CHAT_TYPES.CHANNEL ? currentDialogUserInfo.myChannelOrGroup : true);

	const onClickSmile = async value => {
		const isActive = data.reactions?.filter(item => item.user.id === userInfo.id).find(i => i.value === value);
		if (!data.reactions) return;
		setShowPopper(false);
		setIsOpenMoreSmiles(false);
		const current = cachedDialog[currentDialog.id];
		if (current) {
			if (isActive) {
				chatReactionDeleteFake(current.result, setCachedDialog, data, userInfo);
			} else {
				chatReactionCreateFake(current.result, setCachedDialog, value, data, userInfo);
			}
		}
		if (isActive) {
			await chatReactionDelete(isActive.id, currentDialog.id, data.id);
		} else {
			await chatReactionCreate(currentDialog.id, data.id, value);
		}
		await getDialog(currentDialog.id);
	};

	return (
		<Tooltip
			offset={[5, 5]}
			mobileDefault
			color='white'
			ElementTarget={() => (
				<div className={cn(styles.ChatMessageMoreInner)}>
					<IconEllipsis className='fill-dark pointer-events-none' width={16} height={16} />
				</div>
			)}
			classNameTarget={cn(styles.ChatMessageMore, myMessage ? styles.ChatMessageMoreMe : styles.ChatMessageMoreOther)}
			classNameContent='!p-0 !shadow-none bg-transparent-imp !rounded-none'
			placement={isDesktop ? (myMessage ? "left-start" : "right-start") : "auto"}
			event='click'
			virtualPosition={showPopperPosition}
			value={showPopper === data.id}
			classNameTargetActive={styles.ChatMessageMoreActive}
			onChange={value => {
				if (data.loading) return;
				if (!isDesktop) return;

				if (value) {
					setShowPopper(prev => (prev ? false : data.id));
				} else {
					setShowPopperPosition(null);
					setShowPopper(false);
				}
				setIsOpenMoreSmiles(false);
			}}>
			<div className='flex flex-col items-center gap-2'>
				{variant !== "comments" && (
					<div className='bg-white shadow-primary p-1 rounded-[24px] flex gap-1 items-center'>
						{SMILES_REACTIONS.map((item, index) => {
							return (
								<SmileItem
									className='text-littleBig !rounded-full'
									key={index}
									item={item}
									onClick={() => {
										onClickSmile(item);
									}}
								/>
							);
						})}
						<button
							type='button'
							className='flex-center-all bg-primary700 rounded-full w-7 h-7 mr-2'
							onClick={e => {
								e.stopPropagation();
								setIsOpenMoreSmiles(prev => !prev);
							}}>
							<IconArrow width={18} height={18} className={cn("rotate-90", isOpenMoreSmiles && "!-rotate-90")} />
						</button>
					</div>
				)}

				{!isOpenMoreSmiles && (
					<div className='bg-white shadow-primary flex flex-col items-start rounded-[10px] overflow-hidden min-w-64'>
						<ChatMessageReads />
						{isVisiblePin && (
							<>
								<button
									className={styles.ChatMessageButton}
									onClick={async () => {
										setShowPopper(false);
										const current = cachedDialog[currentDialog.id];
										const is_active = data.is_pin || variant === "pin";
										if (current) {
											if (is_active) {
												pinMessageDeleteFake(current.result, data);
											} else {
												pinMessageCreateFake(current.result, data);
											}
										}
										if (is_active) {
											await pinMessageDelete(currentDialog.id, data.id);
										} else {
											await pinMessageCreate(currentDialog.id, data.id);
										}
										pinMessageGetAll(currentDialog.id);
									}}>
									<IconArrow width={15} height={15} />
									{Boolean(data.is_pin || variant === "pin") ? "Открепить" : " Закрепить"}
								</button>
							</>
						)}
						{data.text && (
							<button
								className={styles.ChatMessageButton}
								onClick={() => {
									handleCopyText(getHtmlText(data.text));
									setShowPopper(false);
								}}>
								<IconArrow width={15} height={15} />
								Копировать текст
							</button>
						)}
						{Boolean(editMessage && myMessage && !data.is_json && !audioData && videoData?.is_story !== 1) && (
							<button
								className={styles.ChatMessageButton}
								onClick={() => {
									setFilesUpload([]);
									setShowPopper(false);
									draftOptions.setIsEdit({
										text: data.text || "",
										text_old: data.text || "",
										id: data.id,
										dialog_id: currentDialog.id,
										files: data.files,
										photos: data.photos
									});
								}}>
								<IconEdit width={16} height={16} className='stroke-blue stroke-[1.5px]' />
								Редактировать
							</button>
						)}

						{myMessage && (
							<button
								className={styles.ChatMessageButton}
								onClick={() => {
									setShowPopper(false);
									deleteMessage?.({
										ids: [data.id],
										dialog_id: currentDialog.id,
										myMessage: Boolean(myMessage),
										message_id: data.message_id
									});
								}}>
								<IconTrash width={15} height={15} className='fill-red' />
								Удалить
							</button>
						)}
					</div>
				)}
				{isOpenMoreSmiles && (
					<div className='bg-white shadow-primary flex flex-col items-start rounded-[10px] overflow-hidden w-full'>
						<SimpleScrollbar className='w-full'>
							<div className='py-4 px-3 flex flex-col gap-3'>
								<MenuLayout
									title='Часто используемые'
									data={SMILES_ONE}
									className='text-littleBig'
									setMessageText={async value => {
										onClickSmile(value);
									}}
								/>
								<MenuLayout
									title='Все'
									data={SMILES}
									className='text-littleBig'
									setMessageText={value => {
										onClickSmile(value);
									}}
								/>
							</div>
						</SimpleScrollbar>
					</div>
				)}
			</div>
		</Tooltip>
	);
};

export default ChatMessageTooltip;
