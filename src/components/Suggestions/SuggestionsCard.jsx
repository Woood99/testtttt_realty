import cn from 'classnames';
import { SuggestionsCardActionsContext } from '../../context';
import SuggestionsCardActions from './SuggestionsCardActions';
import SuggestionsCardBadge from './SuggestionsCardBadge';

import styles from './SuggestionsCard.module.scss';
import dayjs from 'dayjs';
import getSrcImage from '../../helpers/getSrcImage';
import { getApartmentTitle } from '../../helpers/getApartmentTitle';
import numberReplace from '../../helpers/numberReplace';
import Button from '../../uiForm/Button';
import { RoutesPath } from '../../constants/RoutesPath';

const SuggestionsCard = ({ card, variant, className }) => {
   const is_active = card.is_active;
   const images = card.images;

   const link = card.type === 'building' ? `${RoutesPath.building}${card.id}` : `${RoutesPath.apartment}${card.id}`;

   return (
      <article className={cn(styles.SuggestionsCardRoot, variant === 'default' && styles.SuggestionsCardDefaultRoot, className)}>
         {Boolean(is_active) && <a href={link} className="CardLinkElement z-50" />}
         <div className={cn('flex flex-col h-full')}>
            <p className="font-medium text-defaultMax mb-4">
               {dayjs(card.date).format('DD MMMM YYYY')}, {card.time}
            </p>
            <div className="flex gap-3 relative">
               <img src={getSrcImage(images?.[0] || '')} className="w-[70px] h-[70px] rounded-xl" width={70} height={70} alt="" />
               <div className="flex flex-col gap-1 overflow-hidden">
                  {Boolean(card.price) && <p className="cut-one font-medium">{numberReplace(card.price)} ₽</p>}
                  <p className="cut-one">{card.type === 'apartment' ? getApartmentTitle(card) : card.title}</p>
                  <p className="cut-one text-primary400 mb-1">
                     {card.city} {card.address}
                  </p>
               </div>
            </div>
            <SuggestionsCardBadge {...card} />
            <div className="mt-auto">
               <div className="mt-6 relative z-[60]">
                  {Boolean(is_active) && (
                     <SuggestionsCardActionsContext.Provider value={{ ...card }}>
                        <SuggestionsCardActions />
                     </SuggestionsCardActionsContext.Provider>
                  )}
                  {Boolean(!is_active) && (
                     <Button size="34" Selector="div" className="flex-center-all gap-2 !bg-[#fff5e2] w-full !text-dark">
                        Объявление снято с продажи
                     </Button>
                  )}
               </div>
            </div>
         </div>
      </article>
   );
};

export default SuggestionsCard;
