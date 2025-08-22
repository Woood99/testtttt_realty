import { useContext, useState } from 'react';
import { declensionParticipant } from '../../../../helpers/declensionWords';
import { IconAdd, IconTrash, IconUsers } from '../../../../ui/Icons';
import Modal from '../../../../ui/Modal';
import ModalWrapper from '../../../../ui/Modal/ModalWrapper';
import UserInfo from '../../../../ui/UserInfo';
import { ChatModalSearchDialogs } from '.';
import { sendPostRequest } from '../../../../api/requestsApi';
import DeleteModal from '../../../../ModalsMain/DeleteModal';
import isEmptyArrObj from '../../../../helpers/isEmptyArrObj';
import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import { ChatContext } from '../../../../context';
import { CHAT_TYPES } from '../../constants';
import { useSelector } from 'react-redux';
import { getUserInfo } from '@/redux';
import Avatar from '../../../../ui/Avatar';

const ChannelGroupInfoModal = ({ condition, set, dialog }) => {
   const { updateDialogsAndDialogSettings } = useContext(ChatContext);
   const [addParticipants, setAddParticipants] = useState(false);
   const [deleteParticipant, setDeleteParticipant] = useState(false);

   const { dialog_type, owner, companions } = dialog;

   const userInfo = useSelector(getUserInfo);

   if (!dialog) {
      return;
   }

   const myChannelOrGroup = Boolean(
      (dialog.dialog_type === CHAT_TYPES.CHANNEL || dialog.dialog_type === CHAT_TYPES.GROUP) && dialog.owner?.id === userInfo.id
   );

   const DIALOG_TITLE_TYPES_MAP = {
      [CHAT_TYPES.CHAT]: 'диалоге',
      [CHAT_TYPES.CHANNEL]: 'канале',
      [CHAT_TYPES.GROUP]: 'группе',
   };

   const participantsLength = declensionParticipant(companions?.length + (owner ? 1 : 0));

   return (
      <>
         <ModalWrapper condition={condition}>
            <Modal
               condition={condition}
               set={set}
               options={{
                  overlayClassNames: '_center-max-content-desktop',
                  modalClassNames: 'mmd1:!w-[400px] flex-col',
                  modalContentClassNames: '!py-8 !pb-12 !px-8 md1:px-6',
               }}>
               <h2 className="title-2 mb-8">Информация о {DIALOG_TITLE_TYPES_MAP[dialog_type]}</h2>

               {isEmptyArrObj(dialog) ? (
                  <>
                     <WebSkeleton className="w-[100px] h-10 rounded-lg" />
                  </>
               ) : (
                  <>
                     <div className="flex flex-col items-center">
                        <Avatar size={110} src={dialog.image} title={dialog.name || 'без названия'} />
                        <h3 className="title-3 mt-4">{dialog.name || 'без названия'}</h3>
                        <p className="text-primary400 mt-1 text-small">{participantsLength}</p>
                     </div>

                     <div className="mt-6 pt-6 border-top-lightgray">
                        <div className="flex items-center gap-3">
                           <IconUsers width={16} height={16} className="fill-primary400" />
                           <h3 className="title-3-5 uppercase">{participantsLength}</h3>
                           {myChannelOrGroup && (
                              <button
                                 type="button"
                                 onClick={() => setAddParticipants(dialog.id)}
                                 className="flex-center-all ml-auto"
                                 title="Добавить участника">
                                 <IconAdd className="fill-primary400" />
                              </button>
                           )}
                        </div>
                        <div className="mt-4 flex flex-col gap-4">
                           {owner && (
                              <div className="flex gap-2 justify-between items-center">
                                 <UserInfo avatar={owner.image} name={owner.name} classListName="!text-defaultMax" centered />
                                 <span className="text-blue">Владелец</span>
                              </div>
                           )}
                           {dialog_type !== CHAT_TYPES.CHANNEL && (
                              <>
                                 {companions.map(companion => (
                                    <div key={companion.id} className="flex gap-2 justify-between items-center">
                                       <UserInfo avatar={companion.image} name={companion.name} classListName="!text-defaultMax" centered />
                                       {myChannelOrGroup && (
                                          <button type="button" className="flex-center-all" onClick={() => setDeleteParticipant(companion)}>
                                             <IconTrash className="stroke-red" width={14} height={14} />
                                          </button>
                                       )}
                                    </div>
                                 ))}
                              </>
                           )}
                        </div>
                     </div>
                  </>
               )}
            </Modal>
         </ModalWrapper>

         {myChannelOrGroup && (
            <>
               <ModalWrapper condition={addParticipants}>
                  <ChatModalSearchDialogs
                     condition={addParticipants}
                     set={setAddParticipants}
                     selectedType="add_to_dialog"
                     options={{ title: 'Добавить участников' }}
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

               <ModalWrapper condition={deleteParticipant}>
                  <DeleteModal
                     condition={deleteParticipant}
                     title={<>Вы действительно хотите удалить ?</>}
                     set={setDeleteParticipant}
                     request={async data => {
                        await sendPostRequest(`/api/dialogs/${dialog.id}/user/delete`, { user_ids: [data.id] });
                        await updateDialogsAndDialogSettings();
                        setDeleteParticipant(false);
                     }}
                  />
               </ModalWrapper>
            </>
         )}
      </>
   );
};

export default ChannelGroupInfoModal;
