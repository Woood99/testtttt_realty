import { BuyerRoutesPath } from '../../constants/RoutesPath';
import { ExternalLink } from '../../ui/ExternalLink';
import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Button from '../../uiForm/Button';

const RecordViewingSent = ({ condition, set }) => {
   return (
      <ModalWrapper condition={condition}>
         <Modal
            condition={condition}
            set={set}
            options={{
               overlayClassNames: '_center-max-content',
               modalClassNames: 'mmd1:!w-[400px]',
               modalContentClassNames: '!px-10 md1:!px-6',
            }}>
            <h2 className="title-2 text-center mb-4">Заявка отправлена</h2>
            <div className="text-center mb-2 text-primary400 flex flex-col gap-2">
               <p>Продавец должен ответить в течение указанного времени, иначе она отклонится автоматически.</p>
               <p>Вы можете напомнить о себе и связаться с продавцом самостоятельно на странице объявления.</p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
               <ExternalLink to={BuyerRoutesPath.view} className="w-full">
                  <Button Selector="div">Перейти к моим записям</Button>
               </ExternalLink>
               <Button variant="secondary" onClick={() => set(false)}>
                  Закрыть
               </Button>
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default RecordViewingSent;
