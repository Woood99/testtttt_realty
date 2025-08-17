import { useContext } from 'react';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { VideoCallContext } from '../../context';
import Modal from '../../ui/Modal';

const ModalError = () => {
   const { modalError, setModalError } = useContext(VideoCallContext);

   return (
      <ModalWrapper condition={modalError}>
         <Modal
            condition={modalError}
            set={setModalError}
            options={{
               overlayClassNames: '_center-max-content !z-[99999]',
               modalClassNames: 'mmd1:!w-[450px]',
               modalContentClassNames: '!px-8 !pt-12',
            }}>
            <h2 className="title-2-5 mb-3">{modalError.title}</h2>
            <p>{modalError.descr}</p>
         </Modal>
      </ModalWrapper>
   );
};

export default ModalError;
