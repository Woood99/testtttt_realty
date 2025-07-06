import { useEffect, useState } from 'react';
import { suggestionsDateRange, suggestionsTypes } from '../../../components/Suggestions/suggestions-types';
import { suggestionsCreateDateRange } from '../../../components/Suggestions/suggestions-create-date-range';
import { sendPostRequest } from '../../../api/requestsApi';
import { BuyerRoutesPath } from '../../../constants/RoutesPath';
import SuggestionsProvider from '../../../components/Suggestions/SuggestionsProvider';
import { Swiper, SwiperSlide } from 'swiper/react';
import SuggestionsCard from '../../../components/Suggestions/SuggestionsCard';
import { Link } from 'react-router-dom';

const SuggestionsHome = () => {
   const suggestions_type = suggestionsTypes.buyerAll;
   const [suggestions, setSuggestions] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         const params = {
            per_page: 115,
            page: 1,
            author_is_user: null,
            status: 'all',
            ...suggestionsCreateDateRange(suggestionsDateRange[0].days),
            order_by_created_at: 0,
            order_by_view_time: null,
         };

         const { data: result } = await sendPostRequest(suggestions_type.endpoint, params);

         setSuggestions(result.items);
      };

      fetchData();
   }, []);

   if (!suggestions.length) return;

   return (
      <div className="container-desktop mb-2">
         <div className="white-block-small mmd2:col-span-2">
            <div className="flex w-full mb-4">
               <Link to={BuyerRoutesPath.view} className="ml-auto blue-link">
                  Смотреть всё
               </Link>
            </div>

            <SuggestionsProvider suggestions_type={suggestions_type}>
               <Swiper
                  spaceBetween={24}
                  slidesPerView={1.1}
                  breakpoints={{
                     799: {
                        slidesPerView: 2,
                     },
                     1222: {
                        slidesPerView: 3,
                     },
                  }}
                  wrapperClass="items-stretch"
                  className="min-w-0">
                  {suggestions.map((card, index) => {
                     return (
                        <SwiperSlide key={index}>
                           <SuggestionsCard card={card} suggestions_type={suggestions_type} variant="default" className="h-full" />
                        </SwiperSlide>
                     );
                  })}
               </Swiper>
            </SuggestionsProvider>
         </div>
      </div>
   );
};

export default SuggestionsHome;
