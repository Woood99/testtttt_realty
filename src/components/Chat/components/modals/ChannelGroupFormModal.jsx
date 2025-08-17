import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import Modal from '../../../../ui/Modal';
import DragDropImageSolo from '../../../DragDrop/DragDropImageSolo';
import AVATAR from '../../../../assets/img/avatar.png';
import getImagesObj from '../../../../unifComponents/getImagesObj';
import { getIsDesktop } from '@/redux';
import { ControllerFieldInput } from '../../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../../uiForm/Button';
import { ControllerFieldCheckbox } from '../../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../../helpers/photosRefact';
import { BASE_URL } from '../../../../constants/api';
import ModalWrapper from '../../../../ui/Modal/ModalWrapper';
import { ROLE_ADMIN } from '../../../../constants/roles';
import { ChatModalSearchDialogs } from '.';
import { CHAT_TYPES } from '../../constants';
import { getDialogId } from '../../../../api/getDialogId';
import { sendPostRequest } from '../../../../api/requestsApi';
import { ChatContext } from '../../../../context';

const ChannelGroupFormModal = ({ condition, set, type }) => {
   const { updateDialogsAndDialogSettings } = useContext(ChatContext);

   const {
      handleSubmit,
      control,
      setValue,
      reset,
      formState: { errors },
   } = useForm({
      defaultValues: {
         name: '',
      },
   });
   const [photo, setPhoto] = useState(null);

   const isDesktop = useSelector(getIsDesktop);
   const [addParticipants, setAddParticipants] = useState(false);
   const [submitIsLoading, setSubmitIsLoading] = useState(false);

   const options = {
      title: type === CHAT_TYPES.GROUP ? 'Новая группа' : 'Новый канал',
      inputPlaceholder: type === CHAT_TYPES.GROUP ? 'Название группы' : 'Название канала',
      label: type === CHAT_TYPES.GROUP ? 'группы' : 'канала',
   };

   const onSubmitHandler = async data => {
      try {
         setSubmitIsLoading(true);
         const resData = {
            ...data,
            type,
            recipients_id: [],
         };

         const dialog_id = await getDialogId(resData);

         await updateDialogsAndDialogSettings();

         setSubmitIsLoading(false);
         reset();
         set(false);

         setAddParticipants(dialog_id);
      } catch (error) {}
   };

   return (
      <>
         <ModalWrapper condition={condition}>
            <Modal
               condition={condition}
               set={set}
               options={{ overlayClassNames: '_left', modalClassNames: 'mmd1:!w-[500px]', modalContentClassNames: 'flex flex-col' }}>
               <h2 className="title-2 mb-8">{options.title}</h2>
               <form className="flex flex-col items-center flex-grow" onSubmit={handleSubmit(onSubmitHandler)}>
                  {/* <DragDropImageSolo
                     defaultLayout={() => <img className="w-full h-full" src={AVATAR} />}
                     image={photo?.image}
                     onChange={file => {
                        setPhoto(file ? getImagesObj(file)[0] : null);
                     }}
                     size={175}
                     className="!rounded-full"
                     changeAvatarChildren={!isDesktop && <div className="blue-link mt-3">Изменить аватарку</div>}
                  /> */}
                  <div className="w-full flex flex-col gap-5">
                     <ControllerFieldInput control={control} name="name" beforeText={options.inputPlaceholder} requiredValue errors={errors} />
                     {/* {type === CHAT_TYPES.CHANNEL && (
                        <ControllerFieldCheckbox
                           variant="toggle"
                           control={control}
                           option={{ value: 'allow_comments', label: 'Разрешить комментарии' }}
                           name="allow_comments"
                        />
                     )} */}
                  </div>
                  <Button isLoading={submitIsLoading} className="w-full mt-auto">
                     Сохранить
                  </Button>
               </form>
            </Modal>
         </ModalWrapper>

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
                     console.log(`к диалогу ${dialog_id} успешно добавлены участники ${user_ids}`);
                  } catch (error) {
                     console.log(error);
                  }
               }}
            />
         </ModalWrapper>
      </>
   );
};

export default ChannelGroupFormModal;
