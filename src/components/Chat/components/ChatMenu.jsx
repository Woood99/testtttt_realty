import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import { ChatContext } from '../../../context';
import { Tooltip } from '../../../ui/Tooltip';
import { getIsDesktop } from '@/redux';
import { IconClip } from '../../../ui/Icons';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import SpecialOfferCreate from '../../../ModalsMain/SpecialOfferCreate';
import Modal from '../../../ui/Modal';
import { CircleVideoRecorder } from '.';
import ChatMenuControls from './ChatMenuControls';

const ChatMenu = () => {
   const { dialogBuilding, currentDialog, getDialog, isOpenMenu, setIsOpenMenu, setIsOpenSmileMenu, isEdit, sendNoteVideo } = useContext(ChatContext);
   const isDesktop = useSelector(getIsDesktop);

   const [specialOfferModal, setSpecialOfferModal] = useState(false);
   const [videoNoteModal, setVideoNoteModal] = useState(false);

   return (
      <>
         {!isEdit && (
            <>
               {isDesktop ? (
                  <Tooltip
                     color="white"
                     ElementTarget={() => (
                        <button type="button" className="flex-center-all mb-[6px] ml-3">
                           <IconClip className="stroke-primary400" width={24} height={24} />
                        </button>
                     )}
                     placement="top-start"
                     offset={[0, 20]}
                     classNameRoot="-mr-4"
                     classNameContent="!p-0 overflow-hidden">
                     <ChatMenuControls options={{ setVideoNoteModal, setSpecialOfferModal }} />
                  </Tooltip>
               ) : (
                  <button
                     type="button"
                     onClick={() => {
                        setIsOpenMenu(prev => !prev);
                        setIsOpenSmileMenu(false);
                     }}>
                     <IconClip className="stroke-primary400" width={24} height={24} />
                  </button>
               )}
            </>
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
         <ModalWrapper condition={videoNoteModal}>
            <Modal
               condition={videoNoteModal}
               set={setVideoNoteModal}
               closeBtnWhite
               options={{ overlayClassNames: '_full', modalClassNames: '!bg-[#212121]', modalContentClassNames: '!p-0 flex-center-all' }}>
               <CircleVideoRecorder
                  submit={async file => {
                     setVideoNoteModal(false);
                     await sendNoteVideo({ file, type: 'video', is_story: 1 });
                  }}
               />
            </Modal>
         </ModalWrapper>
         <ModalWrapper condition={isOpenMenu && !isDesktop}>
            <Modal
               condition={isOpenMenu && !isDesktop}
               set={setIsOpenMenu}
               options={{ overlayClassNames: '_full _bottom !z-[99999]', modalContentClassNames: '!px-3 !pb-2 !pt-14 bg-pageColor' }}>
               <ChatMenuControls options={{ setVideoNoteModal, setSpecialOfferModal }} />
            </Modal>
         </ModalWrapper>
      </>
   );
};

export default ChatMenu;
