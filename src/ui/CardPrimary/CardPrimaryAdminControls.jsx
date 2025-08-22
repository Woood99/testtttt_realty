import { useState } from 'react';
import { sendPostRequest } from '../../api/requestsApi';
import { PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import Button from '../../uiForm/Button';
import { BtnAction } from '../ActionBtns';
import { IconComplain, IconEdit, IconTrash } from '../Icons';
import Modal from '../Modal';
import ModalWrapper from '../Modal/ModalWrapper';
import { Tooltip } from '../Tooltip';
import DeleteBuildingModal from '../../ModalsMain/DeleteBuildingModal';
import { Link } from 'react-router-dom';

const CardPrimaryAdminControls = ({ options }) => {
   const { isBlockCard, setIsBlockCard, title, id } = options;
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
   const [confirmDeleteModalBlock, setConfirmDeleteModalBlock] = useState(false);

   const toggleBlockCard = () => {
      if (!isBlockCard || !setIsBlockCard) return;
      sendPostRequest(`/admin-api/${isBlockCard ? 'disable' : 'enable'}/object/${id}`).then(res => {
         setConfirmDeleteModalBlock(false);
         setIsBlockCard(prev => !prev);
      });
   };

   return (
      <>
         <Tooltip
            placement="left"
            offset={[10, 5]}
            ElementTarget={() => (
               <Link to={`${PrivateRoutesPath.objects.edit}${id}`} target="_blank">
                  <BtnAction Selector="div" className="relative z-50">
                     <IconEdit className="stroke-blue" width={18} height={18} />
                  </BtnAction>
               </Link>
            )}>
            Редактировать
         </Tooltip>
         <Tooltip
            placement="left"
            offset={[10, 5]}
            ElementTarget={() => (
               <BtnAction className="relative z-50" onClick={() => setConfirmDeleteModal(id)}>
                  <IconTrash className="stroke-red" width={16} height={16} />
               </BtnAction>
            )}>
            Удалить
         </Tooltip>
         {Boolean(isBlockCard && setIsBlockCard) && (
            <>
               <Tooltip
                  classNameTarget="bg-white relative z-[91] rounded-lg"
                  placement="left"
                  offset={[10, 5]}
                  ElementTarget={() => (
                     <BtnAction onClick={() => setConfirmDeleteModalBlock(true)}>
                        <IconComplain className="fill-red" width={18} height={18} />
                     </BtnAction>
                  )}>
                  {isBlockCard ? 'Заблокировать' : 'Разблокировать'}
               </Tooltip>
               <ModalWrapper condition={confirmDeleteModalBlock}>
                  <Modal
                     condition={Boolean(confirmDeleteModalBlock)}
                     set={setConfirmDeleteModalBlock}
                     options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[600px]' }}>
                     <div className="text-center">
                        <h2 className="title-2">
                           Вы действительно хотите {isBlockCard ? 'заблокировать' : 'разблокировать'} {title} ?
                        </h2>
                        <div className="mt-8 grid grid-cols-2 gap-2">
                           <Button onClick={() => setConfirmDeleteModalBlock(false)}>Нет</Button>
                           <Button onClick={toggleBlockCard}>Да</Button>
                        </div>
                     </div>
                  </Modal>
               </ModalWrapper>
            </>
         )}

         <DeleteBuildingModal options={{ condition: confirmDeleteModal, set: setConfirmDeleteModal, title, redirectUrl: RoutesPath.listing }} />
      </>
   );
};

export default CardPrimaryAdminControls;
