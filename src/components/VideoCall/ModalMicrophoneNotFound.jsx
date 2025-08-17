import { useContext } from 'react';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { VideoCallContext } from '../../context';
import Modal from '../../ui/Modal';

const ModalMicrophoneNotFound = () => {
   const { isOpenModalMicrophoneNotFound, setIsOpenModalMicrophoneNotFound } = useContext(VideoCallContext);

   return (
      <ModalWrapper condition={isOpenModalMicrophoneNotFound}>
         <Modal
            condition={isOpenModalMicrophoneNotFound}
            set={setIsOpenModalMicrophoneNotFound}
            options={{
               overlayClassNames: '_center-max-content !z-[99999]',
               modalClassNames: 'mmd1:!w-[420px]',
               modalContentClassNames: '!px-8 !pt-12',
            }}>
            <h2 className="title-2-5 mb-3">Микрофон не найден</h2>
            <p>Убедитесь что микрофон доступен и перезагрузите страницу.</p>
         </Modal>
      </ModalWrapper>
   );
};

export default ModalMicrophoneNotFound;
