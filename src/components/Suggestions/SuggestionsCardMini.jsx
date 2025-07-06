import cn from 'classnames';
import { SuggestionsCardActionsContext } from '../../context';
import SuggestionsCardActions from './SuggestionsCardActions';
import SuggestionsCardBadge from './SuggestionsCardBadge';

import styles from './SuggestionsCard.module.scss';
import dayjs from 'dayjs';
import Button from '../../uiForm/Button';

const SuggestionsCardMini = ({ card, variant, className }) => {
   const is_active = card.is_active;

   return (
      <article className={cn(styles.SuggestionsCardRoot, variant === 'default' && styles.SuggestionsCardDefaultRoot, className)}>
         <div className={cn('flex flex-col h-full')}>
            <p className="font-medium text-defaultMax">
              Запись на {dayjs(card.date).format('DD MMMM YYYY')}, {card.time}
            </p>
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

export default SuggestionsCardMini;
