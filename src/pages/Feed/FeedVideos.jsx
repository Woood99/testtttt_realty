import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { useQueryParams } from '../../hooks/useQueryParams';
import FeedLayout from './FeedLayout';
import FeedPromoBody from './FeedPromoBody';
import FeedVideosBody from './FeedVideosBody';

const FeedVideos = () => {
   const params = useQueryParams();

   const searchParamsTab = [
      {
         id: 0,
         value: 'main',
         label: 'Главная',
      },
      {
         id: 1,
         value: 'videos',
         label: 'Видео',
      },
      {
         id: 2,
         value: 'shorts',
         label: 'Клипы',
      },
   ];

   const fetch = async (state, { setTotalPages, setDataCards }) => {
      if (state.type === 'main') {
         const data = {
            city: state.city,
            page: 1,
         };
         const urlsVideos = await sendPostRequest('/api/feed/videos', { ...data, type: 'videos', per_page: 5 }).then(res => res.data);
         const urlsShorts = await sendPostRequest('/api/feed/videos', { ...data, type: 'shorts', per_page: 7 }).then(res => res.data);

         const fetchDataVideos = urlsVideos.videos.length
            ? await getDataRequest(`/api/video-url`, { url: urlsVideos.videos }).then(res => res.data)
            : [];
         const fetchDataShorts = urlsShorts.shorts.length
            ? await getDataRequest(`/api/video-url`, { url: urlsShorts.shorts }).then(res => res.data)
            : [];

         setDataCards({
            type: state.type,
            data: [
               { type: 'videos', data: fetchDataVideos, total: urlsVideos.total, title: 'Видео' },
               { type: 'shorts', data: fetchDataShorts, total: urlsShorts.total, title: 'Клипы' },
            ],
         });

         return;
      }
      const data = {
         ...state,
         per_page: state.type === 'videos' ? 18 : state.type === 'shorts' ? 25 : 16,
      };

      if (params.type === 'home') {
         await getDataRequest('/api/home/video', { per_page_videos: 40, per_page_shorts: 40, city: data.city }).then(res => {
            setDataCards({ [data.type]: res.data[data.type], total: res.data[data.type].length });
         });

         return;
      }
      const urls = await sendPostRequest('/api/feed/videos', data).then(res => res.data);
      const fetchData = urls[data.type].length ? await getDataRequest(`/api/video-url`, { url: urls[data.type] }).then(res => res.data) : [];

      setTotalPages(urls.pages || 1);

      setDataCards(prev => {
         return {
            pages: urls.pages,
            total: urls.total,
            [state.type]: state.page === 1 ? [...fetchData] : [...prev[state.type], ...fetchData],
         };
      });
   };

   return (
      <FeedLayout options={{ feedType: 'video', searchParamsTab, fetch, title: 'Видео и Клипы' }}>
         <FeedVideosBody />
      </FeedLayout>
   );
};

export default FeedVideos;
