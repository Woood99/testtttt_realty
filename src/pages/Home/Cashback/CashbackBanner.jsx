import BannerInfo from '../../../components/BannerInfo';
import Modal from '../../../ui/Modal';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Button from '../../../uiForm/Button';
import { Link } from 'react-router-dom';
import styles from './Cashback.module.scss';
import Tag from '../../../ui/Tag';
import { useState } from 'react';
import { BuyerRoutesPath, RoutesPath } from '../../../constants/RoutesPath';

const CashbackBanner = () => {
   const [modalCashbackOpen, setModalCashbackOpen] = useState(false);

   return (
      <>
         <BannerInfo className="mt-3">
            <h3 className="title-3">Получите кешбэк при покупке квартиры</h3>
            <Button className="md1:w-full" onClick={() => setModalCashbackOpen(true)}>
               Узнать больше
            </Button>
         </BannerInfo>

         <ModalWrapper condition={modalCashbackOpen}>
            <Modal
               condition={modalCashbackOpen}
               set={setModalCashbackOpen}
               options={{ overlayClassNames: '_right', modalClassNames: 'mmd1:!max-w-[550px]' }}>
               <h2 className="title-2 mb-6">Вопросы и ответы</h2>
               <div className="flex flex-col gap-4">
                  <div className="bg-primary700 rounded-[20px] p-5">
                     <h3 className="title-3 mb-2">Как получить кешбэк?</h3>
                     <ul className="list-disc ml-5 mb-3">
                        <li>
                           Авторизуйтесь на портале&nbsp;
                           <Link to="/" className="blue-link">
                              Inrut.ru
                           </Link>
                        </li>
                        <li>
                           Найдите недвижимость с бейджиком&nbsp;
                           <Tag size="small" color="green" className="!inline">
                              Кешбэк
                           </Tag>
                           , на котором указана сумма кешбэка, которую вы получите после покупки квартиры.
                        </li>
                        <li>
                           Совершите покупку с помощью портала&nbsp;
                           <Link to="/" className="blue-link">
                              Inrut.ru
                           </Link>
                        </li>
                        <li>
                           После покупки в течение 30 суток кешбэк будет начислен в ваш&nbsp;
                           <Link to={BuyerRoutesPath.walletPage} className="blue-link" target="_blank">
                              кошелёк.
                           </Link>
                        </li>
                     </ul>
                  </div>
                  <div className="bg-primary700 rounded-[20px] p-5">
                     <h3 className="title-3 mb-2">В каком случае я не получу кешбэк?</h3>
                     <ul className="list-disc ml-5 mb-3">
                        <li>
                           Если вы не авторизовались на портале&nbsp;
                           <Link to="/" className="blue-link">
                              Inrut.ru
                           </Link>
                        </li>
                        <li>
                           Если вы совершили покупку не через портал&nbsp;
                           <Link to="/" className="blue-link">
                              Inrut.ru
                           </Link>
                        </li>
                        <li>Если вы отменили покупку.</li>
                     </ul>
                  </div>
               </div>

               <Link to={RoutesPath.cashbackConditions} className="blue-link font-medium mt-4" target="_blank">
                  Условия акции «Кешбэк»
               </Link>
            </Modal>
         </ModalWrapper>
      </>
   );
};

export default CashbackBanner;
