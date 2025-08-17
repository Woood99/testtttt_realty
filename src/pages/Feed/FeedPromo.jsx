import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { useQueryParams } from '../../hooks/useQueryParams';
import FeedLayout from './FeedLayout';
import FeedPromoBody from './FeedPromoBody';

const FeedPromo = () => {
   const params = useQueryParams();

   const searchParamsTab = [
      {
         id: 0,
         value: 'main',
         label: 'Главная',
      },
      {
         id: 1,
         value: 'stocks',
         label: 'Скидки, акции',
      },
      {
         id: 2,
         value: 'news',
         label: 'Подарки',
      },
      {
         id: 3,
         value: 'calculations',
         label: 'Расчеты',
      },
   ];

   const fetch = async (state, { setTotalPages, setDataCards }) => {
      if (state.type === 'main') {
         const data = {
            city: state.city,
            page: 1,
            limit: 5,
         };
         const fetchDataStocks = await sendPostRequest('/api/promos', { ...data, type: 'stocks' }).then(res => res.data);
         const fetchDataNews = await sendPostRequest('/api/promos', { ...data, type: 'news' }).then(res => res.data);
         const fetchDataCalculations = await sendPostRequest('/api/promos', { ...data, type: 'calculations' }).then(res => res.data);

         setDataCards({
            type: state.type,
            data: [
               { type: 'stocks', data: fetchDataStocks.stocks, total: fetchDataStocks.total, title: 'Скидки, акции' },
               { type: 'news', data: fetchDataNews.news, total: fetchDataNews.total, title: 'Подарки' },
               { type: 'calculations', data: fetchDataCalculations.calculations, total: fetchDataCalculations.total, title: 'Расчеты' },
            ],
         });

         return;
      }
      const data = {
         ...state,
         limit: 15,
      };

      let fetchData;
      if (params.type === 'home') {
         fetchData = await getDataRequest('/api/home/promo', { per_page_promo: 16, per_page_news: 16, per_page_calc: 16, city: state.city }).then(
            res => {
               return {
                  calculations: res.data.calculations || [],
                  news: res.data.news || [],
                  stocks: res.data.promos || [],
               };
            }
         );
      } else {
         fetchData = await sendPostRequest('/api/promos', data).then(res => res.data);
      }
      setTotalPages(fetchData.pages || 1);
      setDataCards(prev => {
         if (state.page === 1) {
            return { ...fetchData };
         } else {
            return {
               ...fetchData,
               [state.type]: [...prev[state.type], ...fetchData[state.type]],
            };
         }
      });
   };

   return (
      <FeedLayout options={{ feedType: 'promo', searchParamsTab, fetch, title: 'Скидки, акции' }}>
         <FeedPromoBody />
      </FeedLayout>
   );
};

export default FeedPromo;
