import React, { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import styles from '../Chat.module.scss';
import { ChatContext, ChatMessagesContext } from '../../../context';
import { Tooltip } from '../../../ui/Tooltip';
import { getIsDesktop, getUserInfo } from '../../../redux/helpers/selectors';
import { IconBadge, IconClip, IconFilm, IconImage, IconImageAdd, IconСamcorder } from '../../../ui/Icons';
import { isBuyer, isSeller } from '../../../helpers/utils';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import SpecialOfferCreate from '../../../ModalsMain/SpecialOfferCreate';
import { ROLE_ADMIN } from '../../../constants/roles';
import Modal from '../../../ui/Modal';
import { CircleVideoRecorder } from '.';
import { setIsCalling } from '../../../redux/slices/videoCallSlice';

const ChatMenu = () => {
   const {
      dialogBuilding,
      currentDialog,
      getDialog,
      isOpenMenu,
      setIsOpenMenu,
      setIsOpenSmileMenu,
      setCreateEventModal,
      sendMessage,
      isVisibleVideoCall,
      currentDialogUserInfo,
   } = useContext(ChatContext);
   const { getInputProps, uploadFileOpen, addFile } = useContext(ChatMessagesContext);
   const isDesktop = useSelector(getIsDesktop);
   const userInfo = useSelector(getUserInfo);
   const userIsSeller = isSeller(userInfo);
   const userIsBuyer = isBuyer(userInfo);

   const [specialOfferModal, setSpecialOfferModal] = useState(false);
   const [videoNoteModal, setVideoNoteModal] = useState(false);

   const photoInputRef = useRef(null);
   const videoInputRef = useRef(null);
   const dispatch = useDispatch();

   const handleFileChange = event => {
      const file = event.target.files[0];
      if (file) {
         addFile([file]);
         event.target.value = null;
      }
   };

   const MenuLayout = () => {
      return (
         <div className={styles.ChatMenuRoot}>
            {isVisibleVideoCall && (
               <button
                  type="button"
                  className={styles.ChatMenuItem}
                  onClick={() => {
                     if (!currentDialogUserInfo) return;
                     dispatch(setIsCalling({ dialog_id: currentDialog.id, partnerInfo: currentDialogUserInfo }));
                  }}>
                  <div className={styles.ChatMenuItemIcon}>
                     <IconСamcorder className="stroke-orange stroke-[2px]" />
                  </div>
                  <span className={styles.ChatMenuText}>Видеозвонок</span>
               </button>
            )}

            <button type="button" className={styles.ChatMenuItem} onClick={uploadFileOpen}>
               <div className={styles.ChatMenuItemIcon}>
                  <IconImageAdd className="fill-blue" />
               </div>
               <span className={styles.ChatMenuText}>{isDesktop ? 'Фото/видео/документ' : 'Галерея'}</span>
            </button>
            {!isDesktop && (
               <>
                  <div className={styles.ChatMenuItem}>
                     <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={photoInputRef}
                     />
                     <button
                        type="button"
                        onClick={e => {
                           e.preventDefault();
                           photoInputRef.current.click();
                        }}
                        className={styles.ChatMenuItemBtn}>
                        <div className={styles.ChatMenuItemIcon}>
                           <IconImage className="fill-red" />
                        </div>
                        <span className={styles.ChatMenuText}>Сделать фото</span>
                     </button>
                  </div>
                  <div className={styles.ChatMenuItem}>
                     <input
                        type="file"
                        accept="video/*"
                        capture="environment"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={videoInputRef}
                     />
                     <button
                        type="button"
                        onClick={e => {
                           e.preventDefault();
                           videoInputRef.current.click();
                        }}
                        className={styles.ChatMenuItemBtn}>
                        <div className={styles.ChatMenuItemIcon}>
                           <IconImage className="fill-red" />
                        </div>
                        <span className={styles.ChatMenuText}>Записать видео</span>
                     </button>
                  </div>
                  {!userIsBuyer && (
                     <div className={styles.ChatMenuItem}>
                        <input
                           type="file"
                           accept="video/*"
                           capture="environment"
                           onChange={handleFileChange}
                           style={{ display: 'none' }}
                           ref={videoInputRef}
                        />
                        <button
                           type="button"
                           onClick={() => {
                              setVideoNoteModal(true);
                              setIsOpenMenu(false);
                           }}
                           className={styles.ChatMenuItemBtn}>
                           <div className={styles.ChatMenuItemIcon}>
                              <IconFilm className="fill-blue" />
                           </div>
                           <span className={styles.ChatMenuText}>Видеозаметка</span>
                        </button>
                     </div>
                  )}
               </>
            )}
            {userIsSeller && dialogBuilding && currentDialog.companion && (
               <>
                  <button type="button" onClick={() => setSpecialOfferModal(true)} className={styles.ChatMenuItem}>
                     <div className={styles.ChatMenuItemIcon}>
                        <IconBadge className="fill-blue" />
                     </div>
                     <span className={styles.ChatMenuText}>Специальное предложение</span>
                  </button>
               </>
            )}
            {userIsSeller && false && (
               <>
                  {/* TODO: создавать может только администратор канала/группы */}
                  <button type="button" className={styles.ChatMenuItem} onClick={() => setCreateEventModal(true)}>
                     <div className={styles.ChatMenuItemIcon}>
                        <IconImageAdd className="fill-blue" />
                     </div>
                     <span className={styles.ChatMenuText}>Мероприятие</span>
                  </button>
               </>
            )}
         </div>
      );
   };

   return (
      <>
         {isOpenMenu && !isDesktop && createPortal(<MenuLayout />, document.getElementById('chat-mobile-actions'))}

         <div className={cn('flex-center-all self-center md1:self-center ml-2')}>
            <input {...getInputProps()} />

            {isDesktop ? (
               <Tooltip
                  color="white"
                  ElementTarget={() => (
                     <button type="button" className="flex-center-all">
                        <IconClip className="stroke-primary400" width={24} height={24} />
                     </button>
                  )}
                  placement="top-start"
                  offset={[0, 20]}
                  classNameContent="!p-0 overflow-hidden">
                  <MenuLayout />
               </Tooltip>
            ) : (
               <button
                  type="button"
                  className={styles.ChatMenuBtn}
                  onClick={() => {
                     setIsOpenMenu(prev => !prev);
                     setIsOpenSmileMenu(false);
                  }}>
                  <IconClip className="stroke-primary400" width={24} height={24} />
               </button>
            )}

            {dialogBuilding?.id && (
               <ModalWrapper condition={specialOfferModal}>
                  <SpecialOfferCreate
                     condition={specialOfferModal}
                     set={setSpecialOfferModal}
                     id={dialogBuilding.id}
                     defaultRecipient={currentDialog.companion}
                     defaultBuilding={dialogBuilding}
                     request={() => {
                        getDialog(currentDialog.id);
                     }}
                  />
               </ModalWrapper>
            )}
         </div>

         <ModalWrapper condition={videoNoteModal}>
            <Modal
               condition={videoNoteModal}
               set={setVideoNoteModal}
               closeBtnWhite
               options={{ overlayClassNames: '_full', modalClassNames: '!bg-[#212121]', modalContentClassNames: '!p-0 flex-center-all' }}>
               <CircleVideoRecorder
                  submit={async file => {
                     setVideoNoteModal(false);
                     await sendMessage(null, { file, type: 'video', is_story: 1 });
                  }}
               />
            </Modal>
         </ModalWrapper>
      </>
   );
};

export default ChatMenu;
