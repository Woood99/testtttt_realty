import { useState } from 'react';
import numberReplace from '../../helpers/numberReplace';
import cn from 'classnames';
import ModalExchange from './ModalExchange';
import { IconAdd } from '../../ui/Icons';
import ModalPointsHelp from './ModalPointsHelp';
import ModalReplenish from './ModalReplenish';

const WalletInfoBuyer = ({ summ = 0, points = 0, className }) => {
   const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
   const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
   const [isReplenishModalOpen, setIsReplenishModalOpen] = useState(false);

   return (
      <div className={cn('grid grid-cols-2 gap-3 md1:grid-cols-1', className)}>
         <div className="white-block">
            <div className="flex flex-col h-full">
               <div className="flex justify-between gap-4">
                  <div>
                     <p className="text-small text-primary400 mb-1.5">Баланс</p>
                     <p className="title-2">{numberReplace(summ)} ₽</p>
                  </div>
                  <div className="flex gap-4">
                     <button type="button" className="flex flex-col items-center gap-1.5" onClick={() => setIsReplenishModalOpen(true)}>
                        <div className="bg-blue rounded-full w-7 h-7 flex-center-all">
                           <IconAdd width={12} height={12} className="fill-white" />
                        </div>
                        <span>Вывести</span>
                     </button>
                     <button type="button" className="flex flex-col items-center gap-1.5" onClick={() => setIsReplenishModalOpen(true)}>
                        <div className="bg-blue rounded-full w-7 h-7 flex-center-all">
                           <IconAdd width={12} height={12} className="fill-white" />
                        </div>
                        <span>Пополнить</span>
                     </button>
                     {/* <button type="button" className="">
                        Отправить
                     </button> */}
                  </div>
               </div>
            </div>
         </div>
         <div className="white-block">
            <div className="flex flex-col h-full">
               <div className="flex justify-between gap-4">
                  <div>
                     <p className="text-small text-primary400 mb-1.5">Баллы</p>
                     <p className="title-2">{numberReplace(points)}</p>
                  </div>
                  <div className="flex gap-4">
                     <button type="button" className="flex flex-col items-center gap-1.5" onClick={() => setIsExchangeModalOpen(true)}>
                        <div className="bg-blue rounded-full w-7 h-7 flex-center-all">
                           <IconAdd width={12} height={12} className="fill-white" />
                        </div>
                        <span>Обменять</span>
                     </button>
                  </div>
               </div>
               <button className="blue-link mt-1.5" onClick={() => setIsInfoModalOpen(true)}>
                  Как получать и на что тратить баллы
               </button>
            </div>
         </div>
         <ModalExchange condition={isExchangeModalOpen} set={setIsExchangeModalOpen} />
         <ModalPointsHelp condition={isInfoModalOpen} set={setIsInfoModalOpen} />
         <ModalReplenish condition={isReplenishModalOpen} set={setIsReplenishModalOpen} />
      </div>
   );
};

export default WalletInfoBuyer;
