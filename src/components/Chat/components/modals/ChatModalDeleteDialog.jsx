import React, { useContext, useState } from 'react';
import { ChatContext } from '../../../../context';
import Modal from '../../../../ui/Modal';
import ModalWrapper from '../../../../ui/Modal/ModalWrapper';
import Avatar from '../../../../ui/Avatar';
import { getShortNameSurname } from '../../../../helpers/changeString';
import { useSearchParams } from 'react-router-dom';
import { getDataRequest } from '../../../../api/requestsApi';

const ChatModalDeleteDialog = () => {
   const { deleteDialogModal, setDeleteDialogModal, getDialogUserInfo, setDialogs } = useContext(ChatContext);

   const dialogUserInfo = getDialogUserInfo(deleteDialogModal);
   const [searchParams, setSearchParams] = useSearchParams();
   const [isLoadingDelete, setIsLoadingDelete] = useState(false);

   const onHandlerDelete = async () => {
      if (isLoadingDelete) return;
      setIsLoadingDelete(true);

      if (dialogUserInfo.myChannelOrGroup) {
         await getDataRequest(`/api/dialogs/${deleteDialogModal.id}/delete`);
      } else {
         if (dialogUserInfo.type_channel || dialogUserInfo.type_group) {
            await getDataRequest(`/api/dialogs/${deleteDialogModal.id}/user/leave`);
         } else if (dialogUserInfo.type_chat) {
            await getDataRequest(`/api/dialogs/${deleteDialogModal.id}/delete`);
         }
      }
      setDialogs(prev => prev.filter(item => item.id !== deleteDialogModal.id));

      if (+searchParams.get('dialog') === deleteDialogModal.id) {
         searchParams.delete('dialog');
         setSearchParams(searchParams);
      }
      setIsLoadingDelete(false);
      onHandlerCancel();
   };

   const onHandlerCancel = () => {
      if (isLoadingDelete) return;

      setDeleteDialogModal(false);
   };

   return (
      <ModalWrapper condition={deleteDialogModal}>
         <Modal
            condition={Boolean(deleteDialogModal)}
            set={setDeleteDialogModal}
            options={{ overlayClassNames: '_center-max-content', modalClassNames: 'mmd1:!w-[400px]', modalContentClassNames: '!pt-8 !px-6' }}>
            {deleteDialogModal && (
               <>
                  <div className="flex items-center gap-3">
                     <Avatar src={dialogUserInfo.image} title={getShortNameSurname(dialogUserInfo.name, dialogUserInfo.surname)} size={36} />
                     <h3 className="title-3-5">
                        {dialogUserInfo.myChannelOrGroup
                           ? 'Удалить и покинуть'
                           : `${dialogUserInfo.type_channel ? 'Покинуть канал' : dialogUserInfo.type_group ? 'Покинуть группу' : 'Удалить диалог'}`}
                     </h3>
                  </div>
                  <p className="mt-4 text-defaultMax">
                     {dialogUserInfo.myChannelOrGroup
                        ? `Вы уверены что хотите удалить и покинуть ${dialogUserInfo.type_group ? 'группу' : 'канал'}`
                        : `${
                             dialogUserInfo.type_channel
                                ? 'Вы уверены что хотите покинуть канал'
                                : dialogUserInfo.type_group
                                ? 'Вы уверены что хотите покинуть группу'
                                : 'Вы уверены что хотите удалить чат с'
                          }`}
                     <span className="font-medium">&nbsp;{dialogUserInfo.name}?</span>
                  </p>

                  <div className="mt-8 flex justify-end gap-4">
                     <button className="blue-link text-defaultMax" onClick={onHandlerCancel}>
                        Отмена
                     </button>
                     <button className="blue-link text-defaultMax" onClick={onHandlerDelete}>
                        Удалить
                     </button>
                  </div>
               </>
            )}
         </Modal>
      </ModalWrapper>
   );
};

export default ChatModalDeleteDialog;
