import { useContext } from 'react';
import { ROLE_BUYER } from '../../constants/roles';
import { SuggestionsContext } from '../../context';
import { suggestionsTypes } from './suggestions-types';
import { IconClock } from '../../ui/Icons';

const SuggestionIconClock = () => {
   return <IconClock width={14} height={14} className="fill-primary400" />;
};

const SuggestionIconDeclined = () => {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 16 16" className="text-red">
         <g>
            <path
               fill="currentColor"
               fillRule="evenodd"
               d="M15.5 8a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0ZM4.91 4.91a.833.833 0 0 1 1.18 0L8 6.822l1.91-1.91a.833.833 0 0 1 1.18 1.178L9.178 8l1.91 1.91a.833.833 0 0 1-1.178 1.18L8 9.178l-1.91 1.91A.833.833 0 0 1 4.91 9.91L6.822 8l-1.91-1.91a.833.833 0 0 1 0-1.18Z"
               clipRule="evenodd"></path>
         </g>
         <defs>
            <clipPath>
               <path fill="red" d="M0 0h16v16H0z"></path>
            </clipPath>
         </defs>
      </svg>
   );
};

const SuggestionIconConfirmed = () => {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width={17} height={17} className="fill-green">
         <path
            fillRule="evenodd"
            d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm3.8-8.3a1 1 0 0 0-1.42-1.4L7.2 8.46a.28.28 0 0 1-.4 0l-1.1-1.1A1 1 0 0 0 4.3 8.8l2.08 2.09c.34.34.9.34 1.24 0L11.8 6.7z"></path>
      </svg>
   );
};

const SuggestionsCardBadge = ({ status, user, author_is_user, specialist }) => {
   const { suggestions_type } = useContext(SuggestionsContext);

   const isBuyerSuggestionType = suggestions_type.id === suggestionsTypes.buyerOnly.id || suggestions_type.id === suggestionsTypes.buyerAll.id;
   const isSellerSuggestionType = suggestions_type.id === suggestionsTypes.sellerAll.id;

   const authorRoleBuyer = (author_is_user ? user.role : specialist.role) === ROLE_BUYER.id;

   const getStatusMessageTitle = () => {
      switch (status) {
         case 'created':
            return 'Новая заявка на просмотр.';
         case 'confirmed':
            return 'Заявка подтверждена.';
         case 'declined':
            return 'Заявка на просмотр отклонена.';
         case 'purchased':
            return 'Объект забронирован.';
         default:
            return '';
      }
   };

   const getStatusIcon = () => {
      switch (status) {
         case 'created':
            return <SuggestionIconClock />;
         case 'confirmed':
            return <SuggestionIconConfirmed />;
         case 'declined':
            return <SuggestionIconDeclined />;
         case 'purchased':
            return <SuggestionIconConfirmed />;
         default:
            return '';
      }
   };

   const getStatusMessageSubtitle = () => {
      switch (status) {
         case 'created':
            return isBuyerSuggestionType ? (
               authorRoleBuyer ? (
                  <>Ждём подтверждения от продавца</>
               ) : (
                  <>Ждём вашего подтверждения</>
               )
            ) : authorRoleBuyer ? (
               <>Ждём вашего подтверждения</>
            ) : (
               <>Ждём подтверждения от покупателя</>
            );
         case 'confirmed':
            return isBuyerSuggestionType ? (
               authorRoleBuyer ? (
                  <>Вы записаны на просмотр объекта</>
               ) : (
                  <>Вы записаны на просмотр объекта</>
               )
            ) : authorRoleBuyer ? (
               <>Вы приняли заявку на просмотр объекта</>
            ) : (
               <>Покупатель принял заявку на просмотр объекта</>
            );

         default:
            return '';
      }
   };

   const title = getStatusMessageTitle();
   const icon = getStatusIcon();
   const subtitle = getStatusMessageSubtitle();

   if (!title && !subtitle) return;

   return (
      <div className="mt-3 flex gap-2">
         <div className="flex-center-all h-[17px]">{icon}</div>
         <div>
            {Boolean(title) && <p>{title}</p>}
            {(isBuyerSuggestionType || isSellerSuggestionType) && subtitle && <p>{subtitle}</p>}
         </div>
      </div>
   );
};

export default SuggestionsCardBadge;
