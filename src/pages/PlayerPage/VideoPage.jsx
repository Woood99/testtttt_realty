import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { Helmet } from 'react-helmet';
import { VideoPlayer } from '../../ModalsMain/VideoModal';
import { ApartmentsCardsHorizontal } from '../../ModalsMain/VideoModal/components/ApartmentsCards';
import PlayerSimilarVideo from '../../ModalsMain/VideoModal/components/PlayerSimilarVideo';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import Header from '../../components/Header';
import PlayerSimilarShorts from '../../ModalsMain/VideoModal/components/PlayerSimilarShorts';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '@/redux';
import { getCardBuildingsById } from '../../api/getCardsBuildings';
import QuestionToChat from '../../components/QuestionToChat';
import { ROLE_ADMIN, ROLE_SELLER } from '../../constants/roles';
import { RoutesPath } from '../../constants/RoutesPath';

const VideoPage = () => {
   const params = useParams();
   const [data, setData] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const isDesktop = useSelector(getIsDesktop);

   const [similarShorts, setSimilarShort] = useState([]);
   const [similarVideos, setSimilarVideos] = useState([]);
   const [otherVideos, setOtherVideos] = useState([]);
   const [objectData, setObjectData] = useState({});

   const playerRef = useRef(null);

   useEffect(() => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth',
      });
      setIsLoading(true);

      const fetch = async () => {
         try {
            const mainVideo = await getDataRequest(`/api/video/${params.id}`).then(res => res.data);

            setData(mainVideo);
            setIsLoading(false);

            sendPostRequest('/api/metric', {
               type: 'views_video',
               metricable_type: 'App\\Models\\Video',
               metricable_id: +params.id,
            }).then(res => {
               // console.log(res);
            });

            const building = await getCardBuildingsById(mainVideo.building_id);

            const similarShorts = await sendPostRequest('/api/feed/videos', { complex: [mainVideo.building_id], type: 'shorts' }).then(res => {
               const data = res.data.shorts?.filter(item => item && item !== mainVideo.video_url);
               if (data?.length) {
                  return getDataRequest('/api/video-url', { url: data }).then(res => res.data.filter(item => item && !isEmptyArrObj(item)));
               } else {
                  return [];
               }
            });

            const similarVideos = await sendPostRequest('/api/feed/videos', { complex: [mainVideo.building_id], type: 'videos' }).then(res => {
               const data = res.data.videos?.filter(item => item && item !== mainVideo.video_url);
               if (data?.length) {
                  return getDataRequest('/api/video-url', { url: data }).then(res => res.data.filter(item => item && !isEmptyArrObj(item)));
               } else {
                  return [];
               }
            });

            const otherVideos = await sendPostRequest('/api/feed/videos', { type: 'videos', city: building.city }).then(res => {
               const data = res.data.videos.filter(item => item && item !== mainVideo.video_url);
               if (data.length) {
                  return getDataRequest('/api/video-url', { url: data }).then(res =>
                     res.data.filter(item => item && !isEmptyArrObj(item)).filter(item1 => !similarVideos.some(item2 => item1.id === item2.id))
                  );
               } else {
                  return [];
               }
            });

            setSimilarShort(similarShorts);
            setSimilarVideos(similarVideos);
            setOtherVideos(otherVideos);
            setObjectData(building);
         } catch (error) {
            console.log(error);
         }
      };

      fetch();
   }, [params.id]);

   return (
      <>
         <Helmet>
            <title>{data ? data.name : ''}</title>
            <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
            <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
         </Helmet>
         <div className="site-container">
            <Header />
            <main className="main mmd1:py-2">
               <div className="main-wrapper">
                  <div className="container relative md1:px-0">
                     {!isLoading ? (
                        <div>
                           {data ? (
                              <VideoPlayer
                                 variant="page"
                                 data={data}
                                 objectData={objectData}
                                 className="grid mmd1:grid-cols-[1fr_350px] gap-4 md1:gap-3"
                                 refElement={playerRef}
                                 childrenVideo={
                                    <>
                                       {Boolean(data.cards?.length) && (
                                          <ApartmentsCardsHorizontal
                                             options={{
                                                params: { ids: data.cards.slice(0, 50), per_page: 35 },
                                                showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}&ids=1&${data.cards
                                                   .map(id => `id=${id}`)
                                                   .join('&')}`,
                                                title: 'Квартиры этого обзора',
                                             }}
                                          />
                                       )}
                                       <QuestionToChat
                                          classNames="white-block mt-3"
                                          building_id={data.building_id}
                                          organization_id={data.developer.id}
                                          specialist_id={data?.author?.role === ROLE_SELLER.id ? data?.author?.id : null}
                                       />
                                    </>
                                 }>
                                 <div className="flex flex-col gap-8 md1:px-4 md1:pb-4 min-w-0 white-block-small self-start">
                                    <PlayerSimilarShorts player={playerRef.current} data={similarShorts} />
                                    <PlayerSimilarVideo data={similarVideos} title="Видео этого ЖК" />
                                    <PlayerSimilarVideo data={otherVideos} title="Смотрите также" />
                                 </div>
                              </VideoPlayer>
                           ) : (
                              '404'
                           )}
                        </div>
                     ) : (
                        <>
                           {isDesktop ? (
                              <div className="grid grid-cols-[1fr_350px] gap-4 text-white">
                                 <div className="select-none rounded-xl">
                                    <WebSkeleton className="w-full pt-[56.25%] rounded-xl mt-2" />
                                    <WebSkeleton className="w-3/4 h-8 rounded-xl mt-2" />
                                    <div className="mt-4 flex items-center gap-3 w-full">
                                       <WebSkeleton className="w-10 h-10 rounded-full" />
                                       <WebSkeleton className="w-2/5 h-10 rounded-lg" />
                                    </div>
                                 </div>
                                 <div>
                                    <WebSkeleton className="w-full h-[90vh] rounded-xl mt-2" />
                                 </div>
                              </div>
                           ) : (
                              <div className="text-white">
                                 <div className="select-none rounded-xl">
                                    <WebSkeleton className="w-full pt-[56.25%] rounded-xl mt-2" />
                                    <WebSkeleton className="w-3/4 h-8 rounded-xl mt-2" />
                                    <div className="mt-4 flex items-center gap-3 w-full">
                                       <WebSkeleton className="w-10 h-10 rounded-full" />
                                       <WebSkeleton className="w-2/5 h-10 rounded-lg" />
                                    </div>
                                 </div>
                              </div>
                           )}
                        </>
                     )}
                  </div>
               </div>
            </main>
         </div>
      </>
   );
};

export default VideoPage;
