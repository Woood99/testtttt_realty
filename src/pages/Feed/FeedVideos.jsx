import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabsBody, TabsNav, TabsTitle } from '../../ui/Tabs';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import CardBasicSkeleton from '../../components/CardBasicSkeleton';
import EmptyBlock from '../../components/EmptyBlock';
import VideoCard from '../../ui/VideoCard';
import BlockShorts from '../../components/BlockShorts';
import { useSearchParams } from 'react-router-dom';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { FeedContextLayout } from '../../context';
import MainLayout from '../../layouts/MainLayout';
import HelmetVideos from '../../Helmets/HelmetVideos';
import FeedLayout from './FeedLayout';
import FeedTagsMore from './FeedTagsMore';
import FeedTitle from './FeedTitle';
import Spinner from '../../ui/Spinner';
import { setType } from '../../redux/slices/feedSlice';
import Button from '../../uiForm/Button';
import { RoutesPath } from '../../constants/RoutesPath';
import { useQueryParams } from '../../hooks/useQueryParams';
import { getCitiesSelector } from '../../redux/helpers/selectors';
import { objectUpdateVideo } from '../../admin/pages/Object/objectUpdateVideo';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ControlsVideoEditModal from '../../components/ControlsVideo/ControlsVideoEditModal';

const LayoutVideos = ({ data, isLoading = false, onDeleteCard = () => {} }) => {
   const citiesItems = useSelector(getCitiesSelector);

   const [modalVideoEdit, setModalVideoEdit] = useState(false);

   return (
      <div className="grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1">
         {isLoading ? (
            [...new Array(6)].map((_, index) => {
               return <CardBasicSkeleton key={index} bg={false} />;
            })
         ) : data && data.length > 0 ? (
            data.map((card, index) => {
               return (
                  <VideoCard
                     data={card}
                     key={index}
                     userVisible
                     controlsAdmin
                     deleteCard={async deleteCardData => {
                        await objectUpdateVideo(deleteCardData, card.building_id, citiesItems);
                        onDeleteCard(deleteCardData.id);
                     }}
                     edit={data =>
                        setModalVideoEdit({
                           data,
                           is_short: false,
                           refetchData: () => {
                              window.location.reload();
                           },
                        })
                     }
                  />
               );
            })
         ) : (
            <div className="w-full col-span-full">
               <EmptyBlock block={false} />
            </div>
         )}

         <ModalWrapper condition={modalVideoEdit}>
            <ControlsVideoEditModal
               data={modalVideoEdit?.data}
               set={setModalVideoEdit}
               is_short={modalVideoEdit?.is_short}
               refetchData={modalVideoEdit?.refetchData}
            />
         </ModalWrapper>
      </div>
   );
};

const LayoutShorts = ({ data, isLoading = false, onDeleteCard = () => {} }) => {
   const citiesItems = useSelector(getCitiesSelector);
   const [modalVideoEdit, setModalVideoEdit] = useState(false);

   return (
      <div className="grid grid-cols-5 gap-4 md1:grid-cols-4 md2:grid-cols-3 md3:grid-cols-2">
         {isLoading ? (
            [...new Array(10)].map((_, index) => {
               return (
                  <div className="select-none rounded-xl" key={index}>
                     <WebSkeleton className="rounded-xl h-[361px] w-full" />
                     <WebSkeleton className="mt-4 w-full h-8 rounded-xl" />
                  </div>
               );
            })
         ) : data && data.length > 0 ? (
            <BlockShorts
               data={data}
               controlsAdmin
               onDeleteCard={async deleteCardData => {
                  await objectUpdateVideo(deleteCardData, deleteCardData.building_id, citiesItems);
                  onDeleteCard(deleteCardData.id);
               }}
               onEditCard={data => {
                  setModalVideoEdit({
                     data,
                     is_short: true,
                     refetchData: () => {
                        window.location.reload();
                     },
                  });
               }}
            />
         ) : (
            <div className="w-full col-span-full">
               <EmptyBlock block={false} />
            </div>
         )}

         <ModalWrapper condition={modalVideoEdit}>
            <ControlsVideoEditModal
               data={modalVideoEdit?.data}
               set={setModalVideoEdit}
               is_short={modalVideoEdit?.is_short}
               refetchData={modalVideoEdit?.refetchData}
            />
         </ModalWrapper>
      </div>
   );
};

const FeedVideos = () => {
   const params = useQueryParams();
   const dispatch = useDispatch();
   const feedSelector = useSelector(state => state.feed);

   const searchParamsTab = [
      {
         id: 0,
         value: 'videos',
         label: 'Видео',
      },
      {
         id: 1,
         value: 'shorts',
         label: 'Клипы',
      },
   ];

   const [dataCards, setDataCards] = useState({});
   const [isLoading, setIsLoading] = useState(true);
   const [totalPages, setTotalPages] = useState(1);
   const [fetching, setFetching] = useState(false);

   const [searchParams, setSearchParams] = useSearchParams();
   const [buildingData, setBuildingData] = useState(null);

   const [tags, setTags] = useState([]);

   const fetch = async state => {
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
      <MainLayout helmet={<HelmetVideos />}>
         <FeedContextLayout.Provider
            value={{
               searchParamsTab,
               tags,
               setTags,
               isLoading,
               setIsLoading,
               setDataCards,
               buildingData,
               setBuildingData,
               fetch,
               feedType: 'video',
               setTotalPages,
               totalPages,
               fetching,
               setFetching,
            }}>
            <FeedLayout>
               <div className="container-desktop">
                  <div className="white-block">
                     <FeedTitle title="Видео и Клипы" />
                     <TabsNav>
                        {searchParamsTab.map((item, index) => {
                           return (
                              <TabsTitle
                                 border
                                 onChange={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    const currentTabName = searchParamsTab.find(item => item.id === index)?.value;
                                    newParams.set('tab', currentTabName);
                                    setSearchParams(newParams);
                                    dispatch(setType(currentTabName));
                                 }}
                                 value={feedSelector.type === item.value}
                                 key={index}>
                                 {item.label}
                              </TabsTitle>
                           );
                        })}
                     </TabsNav>
                  </div>
                  <div className="white-block mt-3">
                     {Boolean(tags.length && params.type !== 'home') && (
                        <>
                           <h3 className="title-3 mb-4">Часто ищут</h3>
                           <FeedTagsMore tags={tags} feedSelector={feedSelector} />
                        </>
                     )}
                     <TabsBody className="!mt-0">
                        {feedSelector.type === 'videos' ? (
                           <LayoutVideos
                              data={dataCards.videos}
                              isLoading={isLoading}
                              onDeleteCard={id => {
                                 setDataCards(prev => {
                                    return {
                                       ...prev,
                                       [feedSelector.type]: prev[feedSelector.type].filter(item => item.id !== id),
                                    };
                                 });
                              }}
                           />
                        ) : (
                           <LayoutShorts
                              data={dataCards.shorts}
                              isLoading={isLoading}
                              onDeleteCard={id => {
                                 setDataCards(prev => {
                                    return {
                                       ...prev,
                                       [feedSelector.type]: prev[feedSelector.type].filter(item => item.id !== id),
                                    };
                                 });
                              }}
                           />
                        )}
                        {Boolean(fetching && totalPages >= feedSelector.page) && (
                           <div className="flex items-center mt-10">
                              <Spinner className="mx-auto" />
                           </div>
                        )}
                     </TabsBody>
                     {params.type === 'home' && (
                        <a href={`${RoutesPath.feedVideos}?tab=${feedSelector.type}`} className="w-full mt-8">
                           <Button variant="secondary" Selector="div">
                              Смотреть всё
                           </Button>
                        </a>
                     )}
                  </div>
               </div>
            </FeedLayout>
         </FeedContextLayout.Provider>
      </MainLayout>
   );
};

export default FeedVideos;
