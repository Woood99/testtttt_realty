import cn from "classnames";
import React, { useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getIsDesktop, getUserInfo } from "@/redux";
import { setIsCalling } from "@/redux";

import { ROLE_ADMIN } from "../../../constants/roles";
import { ChatContext, ChatMessagesContext } from "../../../context";
import { isSeller } from "../../../helpers/utils";
import { IconBadge, IconFilm, IconImage, IconImageAdd, IconСamcorder } from "../../../ui/Icons";
import styles from "../Chat.module.scss";

const ChatMenuControls = ({ options }) => {
	const { setVideoNoteModal, setSpecialOfferModal } = options;
	const { dialogBuilding, currentDialog, isVisibleVideoCall, currentDialogUserInfo, setIsOpenMenu, sendNoteVideo } = useContext(ChatContext);
	const { uploadFileOpen, addFile } = useContext(ChatMessagesContext);
	const isDesktop = useSelector(getIsDesktop);
	const userInfo = useSelector(getUserInfo);
	const userIsSeller = isSeller(userInfo);

	const photoInputRef = useRef(null);
	const videoInputRef = useRef(null);
	const videoCircleInputRef = useRef(null);
	const dispatch = useDispatch();

	const handleFileChange = event => {
		const file = event.target.files[0];
		if (file) {
			addFile([file]);
			event.target.value = null;
		}
	};

	return (
		<div className={styles.ChatMenuRoot}>
			<button
				className={styles.ChatMenuItem}
				onClick={e => {
					e.stopPropagation();
					uploadFileOpen();
					setIsOpenMenu(false);
				}}>
				<div className={styles.ChatMenuItemIcon}>
					<IconImageAdd className='fill-blue' width={24} height={24} />
				</div>
				<span className={cn(styles.ChatMenuText, "cut-one")}>{isDesktop ? "Фото/видео/документ" : "Галерея"}</span>
			</button>
			{!isDesktop && (
				<>
					<div className={styles.ChatMenuItem}>
						<input
							type='file'
							accept='image/*'
							capture='environment'
							onChange={handleFileChange}
							style={{ display: "none" }}
							ref={photoInputRef}
						/>
						<button
							type='button'
							onClick={e => {
								e.preventDefault();
								photoInputRef.current.click();
								setIsOpenMenu(false);
							}}
							className={styles.ChatMenuItemBtn}>
							<div className={styles.ChatMenuItemIcon}>
								<IconImage className='fill-red' width={24} height={24} />
							</div>
							<span className={cn(styles.ChatMenuText, "cut-one")}>Сделать фото</span>
						</button>
					</div>
					<div className={styles.ChatMenuItem}>
						<input
							type='file'
							accept='video/*'
							capture='environment'
							onChange={handleFileChange}
							style={{ display: "none" }}
							ref={videoInputRef}
						/>
						<button
							type='button'
							onClick={e => {
								e.preventDefault();
								videoInputRef.current.click();
								setIsOpenMenu(false);
							}}
							className={styles.ChatMenuItemBtn}>
							<div className={styles.ChatMenuItemIcon}>
								<IconСamcorder className='stroke-orange stroke-[2px]' width={24} height={24} />
							</div>
							<span className={cn(styles.ChatMenuText, "cut-one")}>Записать видео</span>
						</button>
					</div>
				</>
			)}
			<div className={cn("w-full", !isDesktop && styles.ChatMenuItem)}>
				<input
					type='file'
					accept='video/*'
					capture='environment'
					onChange={async e => {
						await sendNoteVideo({ file: e.target.files[0], type: "video", is_story: 1 });
					}}
					style={{ display: "none" }}
					ref={videoCircleInputRef}
				/>
				<button
					type='button'
					onClick={() => {
						setIsOpenMenu(false);
						if (isDesktop) {
							videoCircleInputRef.current.click();
						} else {
							setVideoNoteModal(true);
						}
					}}
					className={cn(isDesktop ? styles.ChatMenuItem : styles.ChatMenuItemBtn)}>
					<div className={styles.ChatMenuItemIcon}>
						<IconFilm className='fill-blue' width={24} height={24} />
					</div>
					<span className={cn(styles.ChatMenuText, "cut-one")}>Видеозаметка</span>
				</button>
			</div>
			{userIsSeller && dialogBuilding && currentDialog.companion && (
				<>
					<button type='button' onClick={() => setSpecialOfferModal(true)} className={styles.ChatMenuItem}>
						<div className={styles.ChatMenuItemIcon}>
							<IconBadge className='fill-blue' width={24} height={24} />
						</div>
						<span className={cn(styles.ChatMenuText, "cut-one")}>Специальное предложение</span>
					</button>
				</>
			)}
			{isVisibleVideoCall && (
				<button
					type='button'
					className={cn(styles.ChatMenuItem)}
					onClick={() => {
						if (!currentDialogUserInfo) return;
						dispatch(
							setIsCalling({
								dialog_id: currentDialog.id,
								partnerInfo: {
									...currentDialogUserInfo,
									id: currentDialogUserInfo.role === ROLE_ADMIN ? 1 : currentDialogUserInfo.id
								}
							})
						);
						setIsOpenMenu(false);
					}}>
					<div className={styles.ChatMenuItemIcon}>
						<IconСamcorder className='stroke-orange stroke-[2px]' width={24} height={24} />
					</div>
					<span className={cn(styles.ChatMenuText, "cut-one")}>Видеозвонок</span>
				</button>
			)}
		</div>
	);
};

export default ChatMenuControls;
