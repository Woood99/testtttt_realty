import React from 'react';
import { useCookies } from 'react-cookie';

import Chat from '../../components/Chat';
import Modal from '../../ui/Modal';
import SelectAccLogModal from '../SelectAccLogModal';

const ChatModal = ({ condition, set, defaultDialogId = null }) => {
   const [cookies] = useCookies();

   return (
      <>
         {cookies.loggedIn ? (
            <Modal
               options={{
                  overlayClassNames: '_full',
                  modalClassNames: '',
                  modalContentClassNames: '!pl-8 !pr-10 !pb-6 !pt-12 md1:!p-0 !overflow-hidden',
               }}
               condition={condition}
               set={set}>
               <Chat onCloseModal={() => set(false)} defaultDialogId={defaultDialogId} />
            </Modal>
         ) : (
            <SelectAccLogModal condition={condition} set={set} />
         )}
      </>
   );
};

export default ChatModal;
