import { useContext } from 'react';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { VideoCallContext } from '../../context';
import Modal from '../../ui/Modal';

const ModalCameraNotFound = () => {
   const { isOpenModalCameraNotFound, setIsOpenModalCameraNotFound } = useContext(VideoCallContext);

   return (
      <ModalWrapper condition={isOpenModalCameraNotFound}>
         <Modal
            condition={isOpenModalCameraNotFound}
            set={setIsOpenModalCameraNotFound}
            options={{
               overlayClassNames: '_center-max-content !z-[99999]',
               modalClassNames: 'mmd1:!w-[420px]',
               modalContentClassNames: '!px-8 !pt-12',
            }}>
            <h2 className="title-2-5 mb-3">Камера не найдена</h2>
            <p>Убедитесь что камера доступна и перезагрузите страницу.</p>
         </Modal>
      </ModalWrapper>
   );
};

export default ModalCameraNotFound;
