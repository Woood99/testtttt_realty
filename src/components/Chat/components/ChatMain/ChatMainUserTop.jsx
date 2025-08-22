import { ChatTooltipDialog } from "..";
import cn from "classnames";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ROLE_ADMIN, RoutesPath } from "@/constants";

import { declensionParticipant, getShortNameSurname, isEmptyArrObj } from "@/helpers";

import { ChatContext } from "@/context";

import { getIsDesktop, getVideoCallInfo } from "@/redux";
import { setIsCalling } from "@/redux";

import { Maybe, UserInfo, WebSkeleton } from "@/ui";
import { IconArrow, IconCall, IconEllipsis, IconСamcorder } from "@/ui/Icons";

import { Button } from "@/uiForm";

import { CHAT_TYPES } from "../../constants";

const ChatMainUserTop = () => {
	const { videoCallDelayTimer } = useSelector(getVideoCallInfo);
	const navigate = useNavigate();

	const {
		currentDialog,
		currentDialogUserInfo,
		isLoadingDialog,
		allowScroll,
		setCurrentDialogSettings,
		setChannelGroupInfoModal,
		isVisibleVideoCall
	} = useContext(ChatContext);

	const isDesktop = useSelector(getIsDesktop);
	const dispatch = useDispatch();

	const [showPopperSettings, setShowPopperSettings] = useState(false);

	if (isLoadingDialog || allowScroll) {
		return (
			<div className='min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white pl-2.5 md1:min-h-[56px] md1:h-[56px]'>
				<div className='flex items-center gap-3'>
					<WebSkeleton className='w-[28px] h-[28px] rounded-lg' />
					<WebSkeleton className='w-[38px] h-[38px] rounded-full' />
					<WebSkeleton className='w-[150px] h-8 rounded-lg' />
				</div>
			</div>
		);
	}

	if (isEmptyArrObj(currentDialog)) return;

	const channelOrGroup = currentDialog.dialog_type === CHAT_TYPES.CHANNEL || currentDialog.dialog_type === CHAT_TYPES.GROUP;

	return (
		<div className='min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white pl-2.5 md1:min-h-[56px] md1:h-[56px]'>
			{!isDesktop && (
				<button
					onClick={() => {
						if (window.history.state && window.history.state.idx > 0) {
							navigate(-1);
						} else {
							navigate(RoutesPath.chat);
						}
					}}
					className='mr-3 flex-center-all'>
					<IconArrow className='rotate-180 fill-dark' width={28} height={28} />
				</button>
			)}
			<UserInfo
				className={cn("min-w-0 mr-4", channelOrGroup && "cursor-pointer")}
				onClick={() => {
					if (channelOrGroup) {
						setCurrentDialogSettings(currentDialog);
						setChannelGroupInfoModal(true);
					}
				}}
				avatar={currentDialogUserInfo.image}
				name={getShortNameSurname(currentDialogUserInfo.name, currentDialogUserInfo.surname)}
				pos={
					<>
						{(currentDialog.dialog_type === CHAT_TYPES.CHANNEL || currentDialog.dialog_type === CHAT_TYPES.GROUP) && (
							<>{declensionParticipant(currentDialog.companions.length + (currentDialog.owner ? 1 : 0))}</>
						)}
					</>
				}
				centered
				nameHref={
					currentDialog.dialog_type === CHAT_TYPES.CHAT
						? `${
								currentDialogUserInfo.isOrganization
									? `${RoutesPath.developers.inner}${currentDialogUserInfo.id}`
									: `${RoutesPath.specialists.inner}${currentDialogUserInfo.id}`
							}
                  `
						: null
				}
			/>
			<div className='ml-auto flex items-center gap-1'>
				<Maybe condition={isVisibleVideoCall}>
					<Button
						isLoading={videoCallDelayTimer}
						size='Small'
						variant='fourth'
						className='px-3'
						onClick={() => {
							if (!currentDialogUserInfo) return;

							dispatch(
								setIsCalling({
									dialog_id: currentDialog.id,
									partnerInfo: {
										...currentDialogUserInfo,
										id: currentDialogUserInfo.role === ROLE_ADMIN.id ? 1 : currentDialogUserInfo.id
									}
								})
							);
						}}>
						<IconСamcorder width={22} height={22} className='stroke-blue stroke-[2px]' />
					</Button>
					<Button
						isLoading={videoCallDelayTimer}
						size='Small'
						variant='fourth'
						className='px-3'
						onClick={() => {
							if (!currentDialogUserInfo) return;

							dispatch(
								setIsCalling({
									dialog_id: currentDialog.id,
									partnerInfo: {
										...currentDialogUserInfo,
										id: currentDialogUserInfo.role === ROLE_ADMIN.id ? 1 : currentDialogUserInfo.id
									}
								})
							);
						}}>
						<IconCall width={22} height={22} className='stroke-blue' />
					</Button>
				</Maybe>

				<button className='flex-center-all ml-3'>
					<ChatTooltipDialog
						options={{
							data: currentDialog,
							showPopper: showPopperSettings,
							setShowPopper: setShowPopperSettings,
							ElementTargetLayout: <IconEllipsis className={cn("pointer-events-none rotate-90 fill-dark")} width={20} height={20} />
						}}
					/>
				</button>
			</div>
		</div>
	);
};

export default ChatMainUserTop;
