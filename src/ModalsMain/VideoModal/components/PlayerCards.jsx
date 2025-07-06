import React, { useEffect, useState } from 'react';
import getApartmentsPlayer from './getApartmentsPlayer';
import { ThumbPhoto } from '../../../ui/ThumbPhoto';
import getSrcImage from '../../../helpers/getSrcImage';
import numberReplace from '../../../helpers/numberReplace';
import { RoutesPath } from '../../../constants/RoutesPath';

const PlayerCards = ({ data, onClick }) => {
   if (!data.cards.length) return;
   const [cards, setCards] = useState({ items: [], pages: 1, total: 0 });

   useEffect(() => {
      getApartmentsPlayer({ ids: data.cards, per_page: 1 }).then(res => {
         setCards(res);
      });
   }, []);

   const firstItem = cards.items?.slice(0, 1) || [];

   if (!cards.total) return;

   return (
      <div className="mt-4 bg-white rounded-2xl w-[90%] px-4 h-[70px] flex items-center">
         {data.cards.length === 1 ? (
            <>
               {cards.items && cards.items?.[0]?.id && (
                  <div>
                     <a href={`${RoutesPath.apartment}${cards.items[0].id}`} target="_blank" className="flex items-center gap-2">
                        <ThumbPhoto size={60}>
                           <img src={getSrcImage(cards.items[0].images[0])} width={60} height={60} alt="" />
                        </ThumbPhoto>
                        <div>
                           <h4 className="font-medium text-dark">{numberReplace(cards.items[0].price)} ₽</h4>
                           <h3 className="mt-1">{cards.items[0].title}</h3>
                        </div>
                     </a>
                  </div>
               )}
            </>
         ) : (
            <div className="flex items-center w-full" onClick={onClick}>
               <ThumbPhoto size={60} key={firstItem[0]?.id}>
                  <img src={getSrcImage(firstItem[0]?.images[0])} width={60} height={60} alt="" />
               </ThumbPhoto>

               <div className="ml-3">
                  <h4 className="title-4">{firstItem[0]?.complex}</h4>
                  <p className="font-medium">{numberReplace(cards.total || 0)} квартир</p>
               </div>
               <p className="ml-auto">Смотреть всё</p>
            </div>
         )}
      </div>
   );
};

export default PlayerCards;
