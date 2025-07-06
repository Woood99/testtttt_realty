import React, { useContext, useEffect, useState } from 'react';
import getCardsBuildings from '../../api/getCardsBuildings';
import CardPrimary from '../../ui/CardPrimary';
import { DetailedStatisticsContext } from '../../context';
import PaginationPage from '../../components/Pagination';
import { sendPostRequest } from '../../api/requestsApi';
import CardSecond from '../../ui/CardSecond';
import CardBasicSkeleton from '../../components/CardBasicSkeleton';
import { CardStock } from '../../ui/CardStock';
import { CardPrimarySkeleton } from '../../ui/CardPrimary/CardPrimarySkeleton';

const DetailedStatisticsTabLayout = ({ data }) => {
   const { cards, setCards } = useContext(DetailedStatisticsContext);
   const cardsData = cards.find(item => item.name === data.name);

   const fetch = async (page = null) => {
      const currentCardsData = cards.find(item => item.name === data.name);

      let result;
      if (data.type === 'complex') {
         result = await getCardsBuildings({ visibleObjects: data.cardIds, page: page || 1, per_page: 9 }).catch(err => {});
      }

      if (data.type === 'apart') {
         result = await sendPostRequest('/api/apartments', { ids: data.cardIds, per_page: 9, page: page || 1 })
            .then(res => res.data)
            .catch(err => {});
      }

      if (data.type === 'promo') {
         result = await sendPostRequest('/api/promos', { type: data.subtype, ids: data.cardIds, limit: 12, page: page || 1, fix_time: true })
            .then(res => res.data)
            .catch(err => {});
      }

      if (page) {
         setCards([
            ...cards.filter(item => item.name !== data.name),
            {
               ...currentCardsData,
               data: result,
               isLoading: false,
               page: page,
            },
         ]);
      } else {
         setCards([
            ...cards.filter(item => item.name !== data.name),
            {
               ...currentCardsData,
               data: result,
               isLoading: false,
               page: 1,
               init: true,
            },
         ]);
      }
   };

   const changeCurrentPage = page => {
      setCards([
         ...cards.filter(item => item.name !== data.name),
         {
            ...cardsData,
            isLoading: true,
         },
      ]);
      fetch(page);
   };

   useEffect(() => {
      if (!data.cardIds) return;
      if (cardsData.init) return;
      fetch();
   }, [data]);

   if (data.type === 'complex') {
      return (
         <>
            <div className="grid grid-cols-3 gap-4">
               {cardsData.isLoading
                  ? [...new Array(3)].map((_, index) => {
                       return <CardPrimarySkeleton key={index} />;
                    })
                  : cardsData.data.cards.map((item, index) => <CardPrimary key={index} {...item} />)}
            </div>
            {!cardsData.isLoading && (
               <PaginationPage currentPage={cardsData.page} setCurrentPage={changeCurrentPage} total={cardsData.data.pages} className="my-6" />
            )}
         </>
      );
   }

   if (data.type === 'apart') {
      return (
         <>
            <div className="grid grid-cols-3 gap-4">
               {cardsData.isLoading
                  ? [...new Array(3)].map((_, index) => {
                       return <CardPrimarySkeleton key={index} />;
                    })
                  : cardsData.data.items.map((item, index) => <CardSecond key={index} {...item} />)}
            </div>
            {!cardsData.isLoading && (
               <PaginationPage currentPage={cardsData.page} setCurrentPage={changeCurrentPage} total={cardsData.data.pages} className="my-6" />
            )}
         </>
      );
   }

   if (data.type === 'promo') {
      return (
         <>
            <div className="grid grid-cols-3 gap-4">
               {cardsData.isLoading
                  ? [...new Array(3)].map((_, index) => {
                       return <CardBasicSkeleton key={index} />;
                    })
                  : cardsData.data[data.subtype].map((item, index) => <CardStock {...item} key={index} />)}
            </div>
            {!cardsData.isLoading && (
               <PaginationPage currentPage={cardsData.page} setCurrentPage={changeCurrentPage} total={cardsData.data.pages} className="my-6" />
            )}
         </>
      );
   }

   return <>Блок ещё не разработан...</>;
};

export default DetailedStatisticsTabLayout;
