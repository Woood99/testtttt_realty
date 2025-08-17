import { memo, useContext, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';

import { FeedContext } from '../../context';
import FeedTagsMore from './FeedTagsMore';
import CardBasicSkeleton from '../../components/CardBasicSkeleton';
import EmptyBlock from '../../components/EmptyBlock';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Spinner from '../../ui/Spinner';
import { RoutesPath } from '../../constants/RoutesPath';
import Button from '../../uiForm/Button';
import { getCitiesSelector } from '@/redux';
import VideoCard from '../../ui/VideoCard';
import { objectUpdateVideo } from '../../admin/pages/Object/objectUpdateVideo';
import ControlsVideoEditModal from '../../components/ControlsVideo/ControlsVideoEditModal';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { mapOrNull } from '../../helpers/arrayMethods';
import BlockShorts from '../../components/BlockShorts';
import RepeatContent from '../../components/RepeatContent';
import ShortCard from '../../ui/ShortCard';
import { ShortsModal } from '../../ModalsMain/VideoModal';

const LayoutVideos = memo(({ data, onDeleteCard = () => {} }) => {
   const { isLoading } = useContext(FeedContext);

   const citiesItems = useSelector(getCitiesSelector);

   const [modalVideoEdit, setModalVideoEdit] = useState(false);

   return (
      <div className="grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1">
         {isLoading ? (
            <RepeatContent count={6}>
               <CardBasicSkeleton bg={false} />
            </RepeatContent>
         ) : data?.length > 0 ? (
            data.map((card, index) => {
               return (
                  <VideoCard
                     widthImage={365}
                     heightImage={234}
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
});

const LayoutShorts = memo(({ data, onDeleteCard = () => {}, dynamicShortsParams }) => {
   const { isLoading } = useContext(FeedContext);

   const citiesItems = useSelector(getCitiesSelector);
   const [modalVideoEdit, setModalVideoEdit] = useState(false);

   return (
      <div className="grid grid-cols-5 gap-4 md1:grid-cols-4 md2:grid-cols-3 md3:grid-cols-2">
         {isLoading ? (
            <RepeatContent count={10}>
               <div className="select-none rounded-xl">
                  <WebSkeleton className="rounded-xl h-[361px] w-full" />
                  <WebSkeleton className="mt-4 w-full h-8 rounded-xl" />
               </div>
            </RepeatContent>
         ) : data?.length > 0 ? (
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
               dynamicShortsParams={
                  dynamicShortsParams
                     ? {
                          url: '/api/feed/videos',
                          params: {
                             city: dynamicShortsParams.values.city.label,
                             developer: mapOrNull(dynamicShortsParams.values.developers),
                             complex: mapOrNull(dynamicShortsParams.values.complexes),
                             author: mapOrNull(dynamicShortsParams.values.authors),
                             tags: dynamicShortsParams.values.tags?.length ? dynamicShortsParams.values.tags : null,
                             type: 'shorts',
                             page: 1,
                             per_page: 999,
                          },
                       }
                     : null
               }
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
});

const LayoutVideosMain = memo(({ onDeleteCard = () => {}, dynamicShortsParams }) => {
   const { isLoading, dataCards, onChangeTab, searchParamsTab } = useContext(FeedContext);
   const [modalVideoEdit, setModalVideoEdit] = useState(false);
   const [shortsModal, setShortsModal] = useState(false);
   const citiesItems = useSelector(getCitiesSelector);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-8">
            <div className="grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1">
               <RepeatContent count={3}>
                  <CardBasicSkeleton bg={false} />
               </RepeatContent>
            </div>
            <div className="grid grid-cols-5 gap-4 md1:grid-cols-4 md2:grid-cols-3 md3:grid-cols-2">
               <RepeatContent count={5}>
                  <div className="select-none rounded-xl">
                     <WebSkeleton className="rounded-xl h-[361px] w-full" />
                     <WebSkeleton className="mt-4 w-full h-8 rounded-xl" />
                  </div>
               </RepeatContent>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-8">
         {dataCards.data?.map((item, index) => {
            if (!item.total) return;
            return (
               <div key={index}>
                  {!!item.total && (
                     <div className="mb-4 flex justify-between gap-4 items-start">
                        <h2 className="title-2-5">{item.title}</h2>
                        {item.total > 3 && (
                           <button
                              type="button"
                              onClick={() => {
                                 const currentTab = searchParamsTab.find(el => el.value === item.type);
                                 onChangeTab(currentTab.id);
                              }}
                              className="blue-link">
                              Смотреть все
                           </button>
                        )}
                     </div>
                  )}
                  {Boolean(item.type === 'videos') && (
                     <Swiper
                        slidesPerView={1.2}
                        breakpoints={{
                           500: {
                              slidesPerView: 2,
                           },
                           799: {
                              slidesPerView: 2.5,
                           },
                           1222: {
                              slidesPerView: 3,
                           },
                        }}
                        spaceBetween={16}>
                        {item.data.map((card, index) => {
                           return (
                              <SwiperSlide key={index}>
                                 <VideoCard
                                    widthImage={365}
                                    heightImage={234}
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
                              </SwiperSlide>
                           );
                        })}
                     </Swiper>
                  )}

                  {Boolean(item.type === 'shorts') && (
                     <>
                        <Swiper
                           slidesPerView={2}
                           breakpoints={{
                              500: {
                                 slidesPerView: 2.5,
                              },
                              799: {
                                 slidesPerView: 4,
                              },
                              1222: {
                                 slidesPerView: 5,
                              },
                           }}
                           spaceBetween={16}>
                           {item.data.map((card, index) => {
                              return (
                                 <SwiperSlide key={index}>
                                    <ShortCard
                                       data={card}
                                       key={index}
                                       setShortsOpen={() => setShortsModal(card.id)}
                                       edit={() => {
                                          setModalVideoEdit({
                                             data: card,
                                             is_short: true,
                                             refetchData: () => {
                                                window.location.reload();
                                             },
                                          });
                                       }}
                                       deleteCard={async deleteCardData => {
                                          await objectUpdateVideo(deleteCardData, deleteCardData.building_id, citiesItems);
                                          onDeleteCard(deleteCardData.id);
                                       }}
                                       controlsAdmin
                                    />
                                 </SwiperSlide>
                              );
                           })}
                        </Swiper>
                        <ShortsModal
                           condition={shortsModal !== false}
                           set={setShortsModal}
                           data={item.data}
                           startData={item.data.find(item => item.id === shortsModal)}
                           startIndex={item.data.findIndex(item => item.id === shortsModal)}
                           dynamicShortsParams={{
                              url: '/api/feed/videos',
                              params: {
                                 city: dynamicShortsParams.values.city.label,
                                 developer: null,
                                 complex: null,
                                 author: null,
                                 tags: null,
                                 type: 'shorts',
                                 page: 1,
                                 per_page: 999,
                              },
                           }}
                        />
                     </>
                  )}
               </div>
            );
         })}
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
});

const FeedVideosBody = memo(() => {
   const { tags, params, dataCards, feedSelector, fetching, totalPages, isLoadingTags } = useContext(FeedContext);

   return (
      <div className="white-block mt-3">
         {Boolean(tags.length && params.type !== 'home' && feedSelector.type !== 'main' && !isLoadingTags) && (
            <>
               <h3 className="title-3 mb-4">Поиск по тегам</h3>
               <FeedTagsMore />
            </>
         )}
         <div>
            {feedSelector.type === 'main' && (
               <LayoutVideosMain
                  onDeleteCard={() => {
                     window.location.reload();
                  }}
                  data={dataCards}
                  dynamicShortsParams={feedSelector}
               />
            )}
            {feedSelector.type !== 'main' && (
               <>
                  {feedSelector.type === 'videos' ? (
                     <LayoutVideos
                        data={dataCards.videos}
                        onDeleteCard={() => {
                           window.location.reload();
                        }}
                     />
                  ) : (
                     <LayoutShorts
                        data={dataCards.shorts}
                        onDeleteCard={() => {
                           window.location.reload();
                        }}
                        dynamicShortsParams={params.type !== 'home' ? feedSelector : null}
                     />
                  )}
                  {Boolean(fetching && totalPages >= feedSelector.page) && (
                     <div className="flex items-center mt-10">
                        <Spinner className="mx-auto" />
                     </div>
                  )}
               </>
            )}
         </div>
         {params.type === 'home' && (
            <a href={`${RoutesPath.feedVideos}?tab=${feedSelector.type}`} className="w-full mt-8">
               <Button variant="secondary" Selector="div">
                  Смотреть всё
               </Button>
            </a>
         )}
      </div>
   );
});

export default FeedVideosBody;
