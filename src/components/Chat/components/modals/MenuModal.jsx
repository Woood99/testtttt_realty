import { useContext, useState } from "react";
import { useSelector } from "react-redux";

import { useAuth, useHistoryState } from "@/hooks";

import { capitalizeWords, changePhoneFormat, isAdmin, isBuyer, isSeller } from "@/helpers";

import { ChatContext } from "@/context";

import { getUserInfo } from "@/redux";

import { CreateStory } from "@/components";

import { Avatar, ElementNavBtn, Maybe, Modal, ModalWrapper } from "@/ui";
import { IconArrow, IconBlocked, IconExit, IconLock2, IconMegaphone, IconNotebook, IconUsers, IconVideo, IconVideoRecord } from "@/ui/Icons";

import styles from "../../Chat.module.scss";
import ChatNotAuth from "../ChatNotAuth";

import ProfileEditModal from "@/pagesUser/Profile/ProfileEditModal";

const MenuModal = () => {
	const { setGroupFormModal, setChannelFormModal, setBlockedUserList, notAuth, sidebarModalOpen, setSidebarModalOpen } = useContext(ChatContext);

	const userInfo = useSelector(getUserInfo);
	const userIsBuyer = isBuyer(userInfo);
	const userIsSeller = isSeller(userInfo);
	const { logout } = useAuth();
	const [isOpenEditProfile, setIsOpenEditProfile] = useHistoryState(false);
	const [isOpenCreateStory, setIsOpenCreateStory] = useHistoryState(false);

	return (
		<>
			<ModalWrapper condition={sidebarModalOpen}>
				<Modal
					options={{ overlayClassNames: "_left", modalClassNames: "mmd1:!w-[400px]", modalContentClassNames: "flex flex-col !px-3" }}
					condition={sidebarModalOpen}
					set={setSidebarModalOpen}>
					<Maybe condition={!notAuth} fallback={<ChatNotAuth />}>
						<Maybe condition={userInfo}>
							<button
								type='button'
								onClick={() => {
									setIsOpenEditProfile(true);
								}}
								className='flex items-center gap-3 mb-5 md1:mb-4 relative transition-all duration-200 rounded-xl py-2 px-3 mmd1:hover:bg-primary700'>
								<Avatar src={userInfo.image} title={capitalizeWords(userInfo.name, userInfo.surname)} size={60} />
								<div className='flex flex-col gap-1.5'>
									<p className='text-defaultMax font-medium'>
										{userInfo.surname || ""} {userInfo.name || ""}
									</p>
									<Maybe condition={userInfo.phone}>
										<p className='text-primary400'>{changePhoneFormat(userInfo.phone)}</p>
									</Maybe>
								</div>
								<IconArrow width={28} height={28} className='ml-auto' />
							</button>
						</Maybe>
						<div className='flex flex-col border-top-lightgray'>
							<div className='mt-2'>
								<Maybe condition={userIsSeller}>
									<button
										onClick={() => {
											setSidebarModalOpen(false);
											setGroupFormModal(true);
										}}
										className={styles.ChatMenuButton}>
										<ElementNavBtn>
											<IconNotebook />
											<span>Создать групповой чат</span>
										</ElementNavBtn>
									</button>
									<button
										onClick={() => {
											setSidebarModalOpen(false);
											setChannelFormModal(true);
										}}
										className={styles.ChatMenuButton}>
										<ElementNavBtn>
											<IconMegaphone />
											<span>Создать канал</span>
										</ElementNavBtn>
									</button>
									<button
										onClick={() => {
											setIsOpenCreateStory(true);
										}}
										className={styles.ChatMenuButton}>
										<ElementNavBtn>
											<IconVideoRecord />
											<span>Создать сторис</span>
										</ElementNavBtn>
									</button>
								</Maybe>
								<Maybe condition={userIsBuyer}>
									<button onClick={() => setBlockedUserList(true)} className={styles.ChatMenuButton}>
										<ElementNavBtn>
											<IconBlocked />
											<span>Заблокированные пользователи</span>
										</ElementNavBtn>
									</button>
								</Maybe>
								<button
									onClick={async () => {
										await logout(userInfo.id);
										window.location.reload();
									}}
									className={styles.ChatMenuButton}>
									<ElementNavBtn>
										<IconExit />
										<span>Выйти</span>
									</ElementNavBtn>
								</button>
							</div>
						</div>
					</Maybe>
				</Modal>
			</ModalWrapper>
			<ProfileEditModal condition={isOpenEditProfile} set={setIsOpenEditProfile} />
			<CreateStory condition={isOpenCreateStory} set={setIsOpenCreateStory} />
		</>
	);
};

export default MenuModal;
