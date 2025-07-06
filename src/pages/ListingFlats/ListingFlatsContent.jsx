import React, { useContext, useState } from 'react';
import { ListingFlatsContext } from '../../context';
import EmptyBlock from '../../components/EmptyBlock';
import CardSecondRow from '../../ui/CardSecond/CardSecondRow';
import Spinner from '../../ui/Spinner';
import Button from '../../uiForm/Button';
import { sendPostRequest } from '../../api/requestsApi';
import { createPortal } from 'react-dom';
import { NotificationTimer } from '../../ui/Tooltip';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../constants/RoutesPath';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';
import CardSecond from '../../ui/CardSecond';
import RepeatContent from '../../components/RepeatContent';
import { CardPrimaryRowSkeleton } from '../../ui/CardPrimaryRow/CardPrimaryRowSkeleton';
import { CardPrimarySkeleton } from '../../ui/CardPrimary/CardPrimarySkeleton';

const ListingFlatsContent = () => {
   const { params, cards, isLoading, isLoadingMore, lastTrigger, isAdmin } = useContext(ListingFlatsContext);
   const [suggestObject, setSuggestObject] = useState(false);

   const isDesktop = useSelector(getIsDesktop);

   const SuggestionsButton = ({ id }) => {
      if (!params.purchase) return;
      return (
         <Button
            size="Small"
            className="relative z-[99]"
            onClick={() => {
               const now = dayjs();

               const requestParams = {
                  order_id: params.purchase,
                  property_type: 'apartment',
                  property_id: id,
                  date: now.format('YYYY-MM-DD'),
                  time: now.format('HH:mm'),
               };

               sendPostRequest('/seller-api/suggestions/create', requestParams).then(res => {
                  setSuggestObject(true);
               });
            }}>
            Предложить объект
         </Button>
      );
   };

   return (
      <div className="container-desktop flex flex-col gap-3 md1:grid md1:grid-cols-2 md2:grid-cols-1">
         {isLoading && lastTrigger === 'filter' ? (
            <RepeatContent count={16}>{isDesktop ? <CardPrimaryRowSkeleton /> : <CardPrimarySkeleton />}</RepeatContent>
         ) : cards.length > 0 ? (
            <>
               {cards.map(item => {
                  return isDesktop ? (
                     <CardSecondRow
                        variant="shadow"
                        {...item}
                        key={item.id}
                        purchase={params.purchase}
                        btnComparisonVisible={!params.purchase}
                        btnFavoriteVisible={!params.purchase}
                        childrenBottom={<SuggestionsButton id={item.id} />}
                        classNameBottom="flex justify-between items-center"
                        controlsAdmin={isAdmin}
                     />
                  ) : (
                     <CardSecond
                        variant="shadow"
                        {...item}
                        key={item.id}
                        purchase={params.purchase}
                        btnComparisonVisible={!params.purchase}
                        btnFavoriteVisible={!params.purchase}
                        childrenBottom={<SuggestionsButton id={item.id} />}
                     />
                  );
               })}
               {isLoadingMore && (
                  <div className="flex items-center my-5">
                     <Spinner className="mx-auto" />
                  </div>
               )}
            </>
         ) : (
            <EmptyBlock />
         )}
         {params.ids && (
            <a href={`${RoutesPath.listingFlats}`} className="w-full mt-4">
               <Button variant="secondary" Selector="div">
                  Смотреть всё
               </Button>
            </a>
         )}
         {suggestObject &&
            createPortal(
               <NotificationTimer show={suggestObject} set={setSuggestObject} classListRoot="min-w-[300px] !pt-6">
                  <p className="font-medium text-defaultMax">Ваше предложение отправлено.</p>
                  <Link className="block underline mt-2" to={`${RoutesPath.purchase.inner}${params.purchase}`}>
                     Перейти к заявке
                  </Link>
               </NotificationTimer>,
               document.getElementById('overlay-wrapper')
            )}
      </div>
   );
};

export default ListingFlatsContent;
