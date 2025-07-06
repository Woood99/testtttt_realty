import { getDataRequest } from '../../api/requestsApi';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import DeleteModal from '../DeleteModal';

const DeleteApartmentModal = ({ options }) => {
   const { condition, set, title, redirectUrl = null } = options;

   return (
      <ModalWrapper condition={condition}>
         <DeleteModal
            condition={condition}
            title={<>Вы действительно хотите удалить {title} ?</>}
            set={set}
            request={async id => {
               await getDataRequest(`/admin-api/delete/apartment/${id}`);
               if (redirectUrl) {
                  window.location.href = redirectUrl;
               } else {
                  if (redirectUrl === null) {
                     window.location.reload();
                  }
               }
            }}
         />
      </ModalWrapper>
   );
};

export default DeleteApartmentModal;
