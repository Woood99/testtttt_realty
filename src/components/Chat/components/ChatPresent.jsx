import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import { IconMoney, IconPresent } from '../../../ui/Icons';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Modal from '../../../ui/Modal';
import { ChatContext, ChatMessagesContext } from '../../../context';
import Button from '../../../uiForm/Button';
import Input from '../../../uiForm/Input';
import numberReplace from '../../../helpers/numberReplace';
import { getIsDesktop, getUserInfo } from '@/redux';
import Textarea from '../../../uiForm/Textarea';
import { CHAT_TYPES } from '../constants';
import { BuyerRoutesPath } from '../../../constants/RoutesPath';
import { ExternalLink } from '../../../ui/ExternalLink';
import { ROLE_BUYER } from '../../../constants/roles';

import PRESENT_IMAGE from '../../../assets/img/present2.jpg';
import hasText from './ChatDraft/hasText';

const ChatPresent = () => {
   const { currentDialog } = useContext(ChatContext);
   const { draftOptions } = useContext(ChatMessagesContext);

   const [isStartModalOpen, setIsStartModalOpen] = useState(false);
   const [isSendModalOpen, setIsSendModalOpen] = useState(null);
   const [isOpenOtherAmount, setIsOpenOtherAmount] = useState(null);
   const [isOpenInsufficientFunds, setIsOpenInsufficientFunds] = useState(false);
   const [otherAmount, setOtherAmount] = useState('');
   const [textareaValue, setTextareaValue] = useState('');
   const userInfo = useSelector(getUserInfo);
   const isDesktop = useSelector(getIsDesktop);

   const companion = currentDialog?.companions?.find(item => item.id !== userInfo?.id);

   if (!companion) return;
   if (userInfo?.role?.id !== ROLE_BUYER.id) return;
   if (currentDialog.dialog_type !== CHAT_TYPES.CHAT) return;

   if (!isDesktop && hasText(draftOptions?.messageText)) return;

   return false; // временно

   return (
      <>
         <button type="button" className="mr-3 mmd1:mb-[4px]" title="Отправить подарок" onClick={() => setIsStartModalOpen(true)}>
            <IconPresent className="stroke-primary400" width={24} height={24} />
         </button>

         <ModalWrapper condition={isStartModalOpen}>
            <Modal
               condition={isStartModalOpen}
               set={setIsStartModalOpen}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: 'mmd1:!w-[470px]', modalContentClassNames: '!px-6' }}>
               <ExternalLink
                  to={BuyerRoutesPath.walletPage}
                  className="text-defaultMax font-medium block text-right mb-4 transition-all hover:text-blue">
                  Баланс <br />0 ₽
               </ExternalLink>
               <div className="bg-primary700 rounded-[20px] p-5">
                  <h3 className="title-3 mb-2">Как отправить вознаграждение менеджеру:</h3>
                  <ul className="list-disc ml-5">
                     <li>Выберите сумму, которую хотите отправить.</li>
                     <li>Нажмите на кнопку "Отправить подарок".</li>
                  </ul>
               </div>

               {isOpenOtherAmount ? (
                  <Input
                     label="Сумма"
                     size="60"
                     className="mt-4"
                     placeholder="Введите желаемую сумму"
                     after="₽"
                     onChange={value => setOtherAmount(value)}
                     value={otherAmount}
                     onlyNumber
                     convertNumber
                     maxValue="1000000000"
                     maxLength={9}
                  />
               ) : (
                  <div className="mt-8 grid grid-cols-3 gap-4">
                     <button
                        type="button"
                        className="border border-solid border-primary800 bg-white rounded-xl relative hover:-translate-y-1.5 transition-all flex-grow flex-shrink basis-0 flex flex-col justify-center items-center md1:!w-full md1:px-4 gap-1.5 h-[120px]"
                        onClick={() => setIsSendModalOpen(10000)}>
                        <img src={PRESENT_IMAGE} className="w-14" height="h-14" alt="10 000 ₽" />
                        <p className="text-defaultMax">10 000 ₽</p>
                     </button>
                     <button
                        type="button"
                        className="border border-solid border-primary800 bg-white rounded-xl relative hover:-translate-y-1.5 transition-all flex-grow flex-shrink basis-0 flex flex-col justify-center items-center md1:!w-full md1:px-4 gap-1.5 h-[120px]"
                        onClick={() => setIsSendModalOpen(20000)}>
                        <img src={PRESENT_IMAGE} className="w-14" height="h-14" alt="20 000 ₽" />
                        <p className="text-defaultMax">20 000 ₽</p>
                     </button>
                     <button
                        type="button"
                        className="border border-solid border-primary800 bg-white rounded-xl relative hover:-translate-y-1.5 transition-all flex-grow flex-shrink basis-0 flex flex-col justify-center items-center md1:!w-full md1:px-4 gap-1.5 h-[120px]"
                        onClick={() => setIsSendModalOpen(50000)}>
                        <img src={PRESENT_IMAGE} className="w-14" height="h-14" alt="30 000 ₽" />
                        <p className="text-defaultMax">50 000 ₽</p>
                     </button>
                  </div>
               )}
               <div className="mt-4 flex justify-between gap-4 items-center">
                  <button className="blue-link text-defaultMax" onClick={() => setIsOpenOtherAmount(prev => !prev)}>
                     {isOpenOtherAmount ? 'Скрыть' : 'Своя сумма'}
                  </button>
                  {isOpenOtherAmount && (
                     <button
                        type="button"
                        className="blue-link"
                        onClick={() => {
                           if (!otherAmount.length) {
                              console.log('ошибка');
                           } else {
                              setIsSendModalOpen(otherAmount);
                           }
                        }}>
                        Отправить
                     </button>
                  )}
               </div>
            </Modal>
         </ModalWrapper>
         <ModalWrapper condition={Boolean(isSendModalOpen)}>
            <Modal
               condition={Boolean(isSendModalOpen)}
               set={setIsSendModalOpen}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[470px]', modalContentClassNames: '!px-6' }}>
               <div className="flex flex-col items-center">
                  <h3 className="text-defaultMax text-center">
                     <p className="font-medium mb-1">Менеджер увидит сообщение:</p>
                     <span className="font-medium">{userInfo.name}</span> отправил(а) вам &nbsp;
                     <br />
                     подарок на сумму <span className="font-medium">{numberReplace(isSendModalOpen || '')} ₽</span>
                  </h3>
                  <div className="mt-4 border border-solid border-primary800 bg-white rounded-xl relative transition-all flex-grow flex-shrink basis-0 flex flex-col justify-center items-center md1:!w-full md1:px-4 gap-1.5 h-[120px] p-4">
                     <img src={PRESENT_IMAGE} className="w-14" height="h-14" alt="Подарок" />
                     <p>Вам подарок</p>
                  </div>
               </div>
               <Textarea
                  className="mt-4"
                  classNameTextarea="!pr-10"
                  maxLength={200}
                  value={textareaValue}
                  onChange={value => setTextareaValue(value)}
                  placeholder="Ваше сообщение"
                  minHeight={80}
                  smile={isDesktop}
               />
               <Button
                  className="w-full mt-6"
                  onClick={() => {
                     setIsOpenInsufficientFunds(true);
                     setIsSendModalOpen(false);
                     setIsStartModalOpen(false);
                  }}>
                  Отправить подарок &nbsp;{numberReplace(isSendModalOpen || '')} ₽
               </Button>
            </Modal>
         </ModalWrapper>
         <ModalWrapper condition={isOpenInsufficientFunds}>
            <Modal
               condition={isOpenInsufficientFunds}
               set={setIsOpenInsufficientFunds}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[470px]', modalContentClassNames: '!px-6' }}>
               <h2 className="title-2-5 text-center">Требуется пополнение баланса</h2>
               <ExternalLink to={BuyerRoutesPath.walletPage} className="mt-5 w-full">
                  <Button Selector="div">Перейти в кошелёк</Button>
               </ExternalLink>
            </Modal>
         </ModalWrapper>
      </>
   );
};

export default ChatPresent;
