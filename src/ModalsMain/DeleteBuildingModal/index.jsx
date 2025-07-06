import { getDataRequest } from '../../api/requestsApi';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import DeleteModal from '../DeleteModal';

const DeleteBuildingModal = ({ options }) => {
   const { condition, set, title, redirectUrl = '' } = options;

   return (
      <ModalWrapper condition={condition}>
         <DeleteModal
            condition={condition}
            title={<>Вы действительно хотите удалить {title} ?</>}
            set={set}
            request={async id => {
               await getDataRequest(`/admin-api/delete/object/${id}`);
               if (redirectUrl) {
                  window.location.href = redirectUrl;
               } else {
                  window.location.reload();
               }
            }}
         />
      </ModalWrapper>
   );
};

export default DeleteBuildingModal;
