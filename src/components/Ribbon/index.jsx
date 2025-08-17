import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';

import Tabs from '../../ui/Tabs';
import { CardPost, CardStock } from '../../ui/CardStock';
import VideoCard from '../../ui/VideoCard';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { RoutesPath } from '../../constants/RoutesPath';
import { getDataRequest } from '../../api/requestsApi';
import ShortCard from '../../ui/ShortCard';
import { ShortsModal } from '../../ModalsMain/VideoModal';
import { getFilteredObject, mergeArraysFromObject } from '../../helpers/objectMethods';
import EmptyBlock, { EmptyTextBlock } from '../EmptyBlock';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { useQueryParams } from '../../hooks/useQueryParams';
import Input from '../../uiForm/Input';
import { ExternalLink } from '../../ui/ExternalLink';
import getCardsBuildings from '../../api/getCardsBuildings';
import CardPrimary from '../../ui/CardPrimary';
import Specialist from '../../ui/Specialist';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';

import { getCitiesSelector, getIsDesktop } from '@/redux';
import { objectUpdateVideo } from '../../admin/pages/Object/objectUpdateVideo';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ControlsVideoEditModal from '../ControlsVideo/ControlsVideoEditModal';
import ControlsPromoEditModal from '../../admin/pages/Object/ControlsPromoEditModal';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';

const feedParamsTab = [
   {
      id: 0,
      value: 'all',
      label: 'Всё',
   },
   {
      id: 1,
      value: 'stocks',
      label: 'Скидки',
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
   {
      id: 4,
      value: 'videos',
      label: 'Видео',
   },
   {
      id: 5,
      value: 'shorts',
      label: 'Клипы',
   },
];

export const FeedContent = ({ data = [], type = '' }) => {
   const [shortsModal, setShortsModal] = useState(false);

   const [searchValue, setSearchValue] = useState('');

   const [filteresCards, setFilteresCards] = useState(data);

   useEffect(() => {
      setFilteresCards(data);
   }, [data]);

   useEffect(() => {
      const cards = data.filter(item => ['title', 'name', 'descr'].some(field => item[field]?.toLowerCase().includes(searchValue.toLowerCase())));
      setFilteresCards(cards);
   }, [searchValue]);

   return (
      <>
         <Input
            before="Поиск по названию"
            value={searchValue}
            onChange={value => {
               setSearchValue(value.trim());
            }}
         />
         <div className="grid grid-cols-3 gap-x-3 gap-y-10 md3:grid-cols-2 border-t border-t-primary800 mt-5 pt-5">
            {filteresCards.length ? (
               <>
                  {type === 'shorts' ? (
                     <>
                        {filteresCards.map(item => {
                           return (
                              <div key={item.id} className="col-span-1">
                                 <ShortCard data={item} setShortsOpen={() => setShortsModal(true)} contentVisible={false} />
                              </div>
                           );
                        })}
                        <ShortsModal
                           condition={shortsModal !== false}
                           set={setShortsModal}
                           data={filteresCards}
                           startData={filteresCards.find(item => item.id === shortsModal)}
                           startIndex={filteresCards.findIndex(item => item.id === shortsModal)}
                        />
                     </>
                  ) : (
                     <>
                        {filteresCards.map(item => {
                           if (item.type === 'stock' || item.type === 'news' || item.type === 'calculation') {
                              return (
                                 <div key={item.id} className="col-span-4">
                                    <CardPost {...item} />
                                 </div>
                              );
                           }
                           if (item.type === 'video' || item.type === 'short') {
                              return (
                                 <div key={item.id} className="col-span-4">
                                    <VideoCard data={item} userVisible playerIn userTop playerInVisibleControls={item.type === 'video'} />
                                 </div>
                              );
                           }
                        })}
                     </>
                  )}
               </>
            ) : (
               <div className="col-span-3">
                  <EmptyBlock block={false} />
               </div>
            )}
         </div>
      </>
   );
};

export const FeedContentPrimary = ({ data = [], type = '' }) => {
   const [shortsModal, setShortsModal] = useState(false);

   const [searchValue, setSearchValue] = useState('');

   const [filteresCards, setFilteresCards] = useState(data);

   const isSearch = type !== 'all' && type !== 'objects' && type !== 'specialists';

   useEffect(() => {
      setSearchValue('');
      setFilteresCards(data);
   }, [data]);

   useEffect(() => {
      if (isSearch) {
         const cards = data.filter(item => ['title', 'name', 'descr'].some(field => item[field]?.toLowerCase().includes(searchValue.toLowerCase())));
         setFilteresCards(cards);
      }
   }, [searchValue]);

   return (
      <>
         {/* {isSearch && (
            <Input
               className="border-b border-b-primary800 mb-5 pb-5"
               before="Поиск по названию"
               value={searchValue}
               onChange={value => {
                  setSearchValue(value.trim());
               }}
            />
         )} */}
         <div>
            {filteresCards.length ? (
               <>
                  {type === 'shorts' && (
                     <div>
                        <h2 className="title-2-5 mb-4">Клипы</h2>

                        <div className="grid grid-cols-5 gap-x-3 gap-y-10 md2:grid-cols-4 md3:grid-cols-3 md4:grid-cols-2">
                           {filteresCards.map(item => {
                              return (
                                 <div key={item.id}>
                                    <ShortCard data={item} setShortsOpen={() => setShortsModal(item.id)} contentVisible={false} />
                                 </div>
                              );
                           })}
                           <ShortsModal
                              condition={shortsModal !== false}
                              set={setShortsModal}
                              data={filteresCards}
                              startData={filteresCards.find(item => item.id === shortsModal)}
                              startIndex={filteresCards.findIndex(item => item.id === shortsModal)}
                           />
                        </div>
                     </div>
                  )}
                  {type === 'videos' && (
                     <div>
                        <h2 className="title-2-5 mb-4">Клипы</h2>
                        <div className="grid grid-cols-3 gap-x-3 gap-y-10 md2:grid-cols-2 md4:grid-cols-1">
                           {filteresCards.map(item => {
                              return (
                                 <div key={item.id}>
                                    <VideoCard data={item} userVisible />
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
                  {(type === 'stocks' || type === 'news' || type === 'calculations') && (
                     <div>
                        <h2 className="title-2-5 mb-4">{type === 'stocks' ? 'Скидки' : type === 'calculations' ? 'Расчёты' : 'Подарки'}</h2>
                        <div className="grid grid-cols-3 gap-x-3 gap-y-10 md2:grid-cols-2 md4:grid-cols-1">
                           {filteresCards.map(item => {
                              return (
                                 <div key={item.id}>
                                    <CardStock {...item} />
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </>
            ) : (
               <div>
                  <EmptyBlock block={false} />
               </div>
            )}
         </div>
      </>
   );
};

export const FeedBlock = ({ data = [], emptyText = '', isLoadingData = false }) => {
   const [searchParams, setSearchParams] = useSearchParams();
   const params = useQueryParams();

   const [dataCards, setDataCards] = useState({});
   const [isLoading, setIsLoading] = useState(true);
   const [defaultTab, setDefaultTab] = useState(0);
   const allCards = mergeArraysFromObject(dataCards);

   useEffect(() => {
      const fetch = async () => {
         setIsLoading(true);

         const stocksData = data.filter(item => item.type === 'stock');
         const calculationsData = data.filter(item => item.type === 'calculation');
         const newsData = data.filter(item => item.type === 'news');
         const videosData = data.filter(item => item.type === 'video');
         const shortsData = data.filter(item => item.type === 'short');

         const videosCards = videosData.length
            ? await getDataRequest(`/api/video-url`, { url: videosData.map(item => item.link) }).then(res => res.data)
            : [];

         const shortsCards = shortsData.length
            ? await getDataRequest(`/api/video-url`, { url: shortsData.map(item => item.link) }).then(res => res.data)
            : [];

         setDataCards({
            stocks: stocksData,
            calculations: calculationsData,
            news: newsData,
            videos: videosCards
               .filter(item => !isEmptyArrObj(item))
               .map(item => ({
                  ...item,
                  type: 'video',
               })),
            shorts: shortsCards
               .filter(item => !isEmptyArrObj(item))
               .map(item => ({
                  ...item,
                  type: 'short',
               })),
         });
         setIsLoading(false);
      };
      fetch();
   }, [data?.length]);

   useEffect(() => {
      if (isEmptyArrObj(dataCards)) return;
      if (params.tab) {
         const newDataCards = { ...dataCards };
         Object.keys(newDataCards).forEach(key => {
            if (Array.isArray(newDataCards[key]) && newDataCards[key].length === 0) {
               delete newDataCards[key];
            }
         });
         const filteredFeedParamsTab = feedParamsTab
            .filter(item => newDataCards.hasOwnProperty(item.value))
            .map((item, index) => ({ ...item, id: index + 1 }));
         setDefaultTab(filteredFeedParamsTab.find(item => item.value === params.tab)?.id || 0);
      }
   }, [dataCards]);

   return (
      <section>
         {Boolean(isLoading || isLoadingData) ? (
            <>
               <WebSkeleton className="w-full h-[43px] rounded-lg" />
               <WebSkeleton className="mt-6 w-full h-[40px] rounded-lg" />
               <div className="flex flex-col gap-y-10 border-t border-t-primary800 mt-5 pt-5">
                  {[...new Array(3)].map((_, index) => {
                     return (
                        <div className="select-none rounded-xl" key={index}>
                           <div className="mb-3 flex items-center gap-3 w-full">
                              <WebSkeleton className="w-10 h-10 rounded-full" />
                              <WebSkeleton className="w-4/5 h-10 rounded-lg" />
                           </div>
                           <WebSkeleton className="rounded-xl h-[480px] w-full" />
                           <div className="mt-4 flex justify-between gap-3">
                              <WebSkeleton className="w-full h-12 rounded-xl" />
                           </div>
                        </div>
                     );
                  })}
               </div>
            </>
         ) : (
            <>
               {allCards.length ? (
                  <Tabs
                     defaultValue={defaultTab}
                     data={[
                        getFilteredObject(allCards.length, {
                           name: 'Всё',
                           valueName: 'all',
                           body: <FeedContent data={allCards} />,
                           count: allCards.length,
                        }),
                        getFilteredObject(dataCards.stocks.length, {
                           name: 'Скидки',
                           valueName: 'stocks',
                           body: <FeedContent data={dataCards.stocks} />,
                           count: dataCards.stocks.length,
                        }),
                        getFilteredObject(dataCards.news.length, {
                           name: 'Подарки',
                           valueName: 'news',
                           body: <FeedContent data={dataCards.news} />,
                           count: dataCards.news.length,
                        }),
                        getFilteredObject(dataCards.calculations.length, {
                           name: 'Расчеты',
                           valueName: 'calculations',
                           body: <FeedContent data={dataCards.calculations} />,
                           count: dataCards.calculations.length,
                        }),
                        getFilteredObject(dataCards.videos.length, {
                           name: 'Видео',
                           valueName: 'videos',
                           body: <FeedContent data={dataCards.videos} />,
                           count: dataCards.videos.length,
                        }),
                        getFilteredObject(dataCards.shorts.length, {
                           name: 'Клипы',
                           valueName: 'shorts',
                           body: <FeedContent data={dataCards.shorts} type="shorts" />,
                           count: dataCards.shorts.length,
                        }),
                     ].filter(item => !isEmptyArrObj(item))}
                     onChange={(_, item) => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('tab', item.valueName);
                        setSearchParams(newParams);
                     }}
                  />
               ) : (
                  emptyText && (
                     <EmptyTextBlock block={false}>
                        <h3 className="title-3 mt-4">{emptyText}</h3>
                     </EmptyTextBlock>
                  )
               )}
            </>
         )}
      </section>
   );
};

export const FeedBlockPrimary = ({ data = [], currentComplexId, onClickShowAll, data_type = 'default', customHref = '', refetchData }) => {
   const isDesktop = useSelector(getIsDesktop);
   const citiesItems = useSelector(getCitiesSelector);
   const [newData, setNewData] = useState([]);
   const [shortsModal, setShortsModal] = useState(false);

   const [modalVideoEdit, setModalVideoEdit] = useState(false);
   const [modalPromoEdit, setModalPromoEdit] = useState(false);

   const queryParams = [currentComplexId && `complex=${currentComplexId}`].filter(Boolean).join('&');

   const href = customHref || `${RoutesPath.feed}?${queryParams ? `${queryParams}` : ''}`;

   const navigateToChat = useNavigateToChat();

   useEffect(() => {
      const fetchData = async () => {
         const videosData = data.filter(item => item.type === 'video');
         const shortsData = data.filter(item => item.type === 'short');
         const objectsData = data.filter(item => item.type === 'object');

         const videosCards =
            videosData.length && data_type === 'default'
               ? await getDataRequest(`/api/video-url`, { url: videosData.map(item => item.link) }).then(res => res.data)
               : data_type === 'data'
               ? videosData
               : [];
         const shortsCards =
            shortsData.length && data_type === 'default'
               ? await getDataRequest(`/api/video-url`, { url: shortsData.map(item => item.link) }).then(res => res.data)
               : data_type === 'data'
               ? shortsData
               : [];

         const objectsCards =
            objectsData.length && data_type === 'default'
               ? await getCardsBuildings({ visibleObjects: objectsData.map(item => item.id), per_page: 4 }).then(res => res.cards)
               : data_type === 'data'
               ? objectsData
               : [];

         setNewData([
            [{ name: 'Объекты застройщика', valueName: 'objects', data: objectsCards }],
            [{ name: 'Менеджеры отдела продаж', valueName: 'specialists', data: data.filter(item => item.type === 'specialist') }],
            [
               { name: 'Клипы', valueName: 'shorts', data: shortsCards.filter(item => !isEmptyArrObj(item)) },
               { name: 'Видео', valueName: 'videos', data: videosCards.filter(item => !isEmptyArrObj(item)) },
            ],
            [
               { name: 'Скидки', valueName: 'stocks', data: data.filter(item => item.type === 'stock') },
               { name: 'Подарки', valueName: 'news', data: data.filter(item => item.type === 'news') },
               { name: 'Расчеты', valueName: 'calculations', data: data.filter(item => item.type === 'calculation') },
            ],
         ]);
      };

      fetchData();
   }, [JSON.stringify(data)]);

   if (!data.length) return;

   return (
      <div className="flex flex-col gap-3">
         {newData.map((el, index) => {
            const count = el.reduce((sum, el) => sum + el.data.length, 0);
            if (!count) return;
            return (
               <div className="white-block flex flex-col gap-12" key={index}>
                  {el
                     .filter(item => item.data.length)
                     .map((item, index) => {
                        if (item.data.length === 0) return;

                        return (
                           <div key={index} className="">
                              <div className="flex justify-between items-center gap-4 mb-5">
                                 <h2 className="title-2">{item.name}</h2>
                                 {item.data.length >= 0 && (
                                    <div className="self-start">
                                       {onClickShowAll ? (
                                          <button className="blue-link _active" onClick={() => onClickShowAll?.(index)}>
                                             Смотреть всё
                                          </button>
                                       ) : (
                                          <ExternalLink to={`${href}&tab=${item.valueName}`} className="blue-link _active">
                                             Смотреть всё
                                          </ExternalLink>
                                       )}
                                    </div>
                                 )}
                              </div>
                              <Swiper
                                 modules={[Navigation]}
                                 navigation={{
                                    prevEl: '.slider-btn-prev',
                                    nextEl: '.slider-btn-next',
                                 }}
                                 observeParents={true}
                                 observer={true}
                                 slidesPerView={item.valueName === 'shorts' || item.valueName === 'specialists' ? 2 : 1.3}
                                 spaceBetween={16}
                                 breakpoints={{
                                    540: {
                                       slidesPerView: item.valueName === 'shorts' || item.valueName === 'specialists' ? 2 : 2,
                                    },
                                    722: {
                                       slidesPerView: item.valueName === 'shorts' || item.valueName === 'specialists' ? 3 : 2,
                                    },
                                    940: {
                                       slidesPerView: item.valueName === 'shorts' || item.valueName === 'specialists' ? 4 : 3,
                                    },
                                 }}>
                                 {item.data.map((card, index) => {
                                    if (item.valueName === 'shorts' && index < 7) {
                                       return (
                                          <SwiperSlide key={card.id}>
                                             <ShortCard
                                                data={card}
                                                setShortsOpen={() => setShortsModal(card.id)}
                                                contentVisible={false}
                                                controlsAdmin
                                                deleteCard={async deleteCardData => {
                                                   await objectUpdateVideo(deleteCardData, card.building_id, citiesItems);
                                                   if (refetchData.shorts) {
                                                      refetchData.shorts();
                                                   }
                                                }}
                                                edit={data => setModalVideoEdit({ data, is_short: true, refetchData: refetchData?.shorts })}
                                             />
                                          </SwiperSlide>
                                       );
                                    }
                                    if (item.valueName === 'videos' && index < 5) {
                                       return (
                                          <SwiperSlide key={card.id}>
                                             <VideoCard
                                                data={card}
                                                userVisible
                                                controlsAdmin
                                                deleteCard={async deleteCardData => {
                                                   await objectUpdateVideo(deleteCardData, card.building_id, citiesItems);
                                                   if (refetchData.videos) {
                                                      refetchData.videos();
                                                   }
                                                }}
                                                edit={data => setModalVideoEdit({ data, is_short: false, refetchData: refetchData?.videos })}
                                             />
                                          </SwiperSlide>
                                       );
                                    }
                                    if (item.valueName === 'objects' && index < 5) {
                                       return (
                                          <SwiperSlide key={card.id}>
                                             <CardPrimary {...card} />
                                          </SwiperSlide>
                                       );
                                    }
                                    if (item.valueName === 'specialists' && index < 5) {
                                       return (
                                          <SwiperSlide key={card.id}>
                                             <Specialist
                                                {...card}
                                                link
                                                visibleChat
                                                onClickChat={async () => {
                                                   await navigateToChat({ recipients_id: [card.id] });
                                                }}
                                             />
                                          </SwiperSlide>
                                       );
                                    }
                                    if (index < 5) {
                                       return (
                                          <SwiperSlide key={card.id}>
                                             <CardStock
                                                {...card}
                                                controlsAdmin
                                                editCard={() => {
                                                   const data = {
                                                      ...card,
                                                      building_id: card.building_id,
                                                      is_calculation: card.type === 'calculation',
                                                      is_news: card.type === 'news',
                                                   };
                                                   setModalPromoEdit({ data, refetchData: refetchData?.promos });
                                                }}
                                                deleteCard={async () => {
                                                   await new Promise(resolve => setTimeout(resolve, 2000)); // небольшая задержка !!!
                                                   if (refetchData.promos) {
                                                      refetchData.promos();
                                                   }
                                                }}
                                             />
                                          </SwiperSlide>
                                       );
                                    }
                                 })}
                                 {isDesktop && (
                                    <>
                                       <NavBtnPrev disabled className="slider-btn-prev !absolute left-4 top-[80px]" />
                                       <NavBtnNext className="slider-btn-next !absolute right-4 top-[80px]" />
                                    </>
                                 )}
                              </Swiper>
                              {item.valueName === 'shorts' && (
                                 <ShortsModal
                                    condition={shortsModal !== false}
                                    set={setShortsModal}
                                    data={item.data}
                                    startData={item.data.find(item => item.id === shortsModal)}
                                    startIndex={item.data.findIndex(item => item.id === shortsModal)}
                                 />
                              )}
                           </div>
                        );
                     })}
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

         <ModalWrapper condition={modalPromoEdit}>
            <ControlsPromoEditModal data={modalPromoEdit?.data} set={setModalPromoEdit} refetchData={modalPromoEdit?.refetchData} />
         </ModalWrapper>
      </div>
   );
};
