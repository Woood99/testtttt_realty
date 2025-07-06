import Modal from '../../../../ui/Modal';
import ModalWrapper from '../../../../ui/Modal/ModalWrapper';
import Input from '../../../../uiForm/Input';

const ChannelGroupSettingsModal = ({ condition, set }) => {
   const dialog = condition;

   return (
      <ModalWrapper condition={condition}>
         <Modal
            condition={condition}
            set={set}
            options={{
               overlayClassNames: '_center-max-content-desktop',
               modalClassNames: 'mmd1:!w-[400px] mmd1:!h-[700px] flex-col',
               modalContentClassNames: '!py-8 !pb-4 !px-8 md1:px-6',
            }}>
            <h2 className="title-2 mb-8">TEST Редактировать канал</h2>
            <Input before="Название" />
         </Modal>
      </ModalWrapper>
   );
};

export default ChannelGroupSettingsModal;
