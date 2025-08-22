import { useState } from 'react';
import { PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import { BtnAction } from '../ActionBtns';
import { IconEdit, IconTrash } from '../Icons';
import { Tooltip } from '../Tooltip';
import { Link } from 'react-router-dom';
import DeleteApartmentModal from '../../ModalsMain/DeleteApartmentModal';

const CardSecondaryAdminControls = ({ options }) => {
   const { title, id } = options;
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

   return (
      <>
         <Tooltip
            placement="left"
            offset={[10, 5]}
            ElementTarget={() => (
               <Link to={`${PrivateRoutesPath.apartment.edit}${id}`} target="_blank">
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

         <DeleteApartmentModal
            options={{
               title: title,
               condition: confirmDeleteModal,
               set: setConfirmDeleteModal,
               redirectUrl: RoutesPath.listing,
            }}
         />
      </>
   );
};

export default CardSecondaryAdminControls;
