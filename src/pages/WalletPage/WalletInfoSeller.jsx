import numberReplace from '../../helpers/numberReplace';
import cn from 'classnames';
import { IconAdd } from '../../ui/Icons';

const WalletInfoSeller = ({ summ = 0, className }) => {
   return (
      <div className={cn(className)}>
         <div className="flex flex-col h-full">
            <h3 className="title-2 mb-6">Кошелёк</h3>
            <div className="flex justify-between gap-4">
               <div>
                  <p className="text-small text-primary400 mb-1.5">Баланс</p>
                  <p className="title-2">{numberReplace(summ)} ₽</p>
               </div>
               <div className="flex gap-4">
                  <button type="button" className="flex flex-col items-center gap-1.5">
                     <div className="bg-blue rounded-full w-7 h-7 flex-center-all">
                        <IconAdd width={12} height={12} className="fill-white" />
                     </div>
                     <span>Вывести</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default WalletInfoSeller;
