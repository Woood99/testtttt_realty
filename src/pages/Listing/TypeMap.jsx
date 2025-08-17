import React, { useState } from 'react';

import styles from './Listing.module.scss';
import CardPrimary from '../../ui/CardPrimary';
import ListingMap from './ListingMap';

import { useSelector } from 'react-redux';
import EmptyBlock from '../../components/EmptyBlock';
import debounce from 'lodash.debounce';
import Spinner from '../../ui/Spinner';
import { getIsDesktop } from '@/redux';
import { useQueryParams } from '../../hooks/useQueryParams';
import { RoutesPath } from '../../constants/RoutesPath';
import Button from '../../uiForm/Button';
import { CardPrimarySkeleton } from '../../ui/CardPrimary/CardPrimarySkeleton';

const TypeMap = ({ options }) => {
   const lastTrigger = useSelector(state => state.listing.lastTrigger);
   const [currentMouseEnterId, setCurrentMouseEnterId] = useState(null);
   const [currentMouseEvent, setCurrentMouseEvent] = useState(null);
   const params = useQueryParams();

   const isDesktop = useSelector(getIsDesktop);

   const handleMouseEnter = debounce(state => {
      if (state === currentMouseEnterId) return;
      setCurrentMouseEnterId(state);
      setCurrentMouseEvent('enter');
   }, 300);

   const handleMouseLeave = debounce(state => {
      setCurrentMouseEnterId(state);
      setCurrentMouseEvent('leave');
   }, 300);

   return (
      <div className={`mmd1:px-4 ${styles.ListingMapContainer}`}>
         <div
            className={`${styles.ListingMapCards} scrollbarPrimary`}
            ref={options.listingMapCardsRef}
            onMouseLeave={() => {
               setCurrentMouseEnterId(null);
               setCurrentMouseEvent('leave');
            }}>
            {options.isLoading && lastTrigger === 'filter' ? (
               [...new Array(16)].map((_, index) => {
                  return <CardPrimarySkeleton variant="shadow" key={index} />;
               })
            ) : options.cards.length > 0 ? (
               <>
                  {options.cards.map(item => {
                     if (item.type === 'promo') {
                        // return <BannerMain data={item} key={`${item.id}-promo`} />;
                     } else {
                        return (
                           <CardPrimary
                              variant="shadow"
                              key={item.id}
                              {...item}
                              onMouseEnter={() => {
                                 handleMouseEnter(item.id);
                              }}
                              onMouseLeave={() => {
                                 handleMouseLeave(null);
                              }}
                              geoVisible={!isDesktop}
                           />
                        );
                     }
                  })}
                  {options.isLoadingMore && (
                     <div className="flex items-center my-5">
                        <Spinner className="mx-auto" />
                     </div>
                  )}
               </>
            ) : (
               <EmptyBlock />
            )}
         </div>
         {Boolean(params.home && !isDesktop) && (
            <a href={`${RoutesPath.listing}`} className="w-full my-4 px-4">
               <Button variant="secondary" Selector="div">
                  Смотреть всё
               </Button>
            </a>
         )}
         {isDesktop && (
            <div className={styles.ListingMap}>
               <ListingMap currentMouseEnterId={currentMouseEnterId} currentMouseEvent={currentMouseEvent} />
            </div>
         )}
      </div>
   );
};

export default TypeMap;
