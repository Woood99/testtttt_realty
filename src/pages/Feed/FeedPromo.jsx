import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TabsBody, TabsNav, TabsTitle } from '../../ui/Tabs';
import { CardStock } from '../../ui/CardStock';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import CardBasicSkeleton from '../../components/CardBasicSkeleton';
import EmptyBlock from '../../components/EmptyBlock';
import { FeedContextLayout } from '../../context';
import MainLayout from '../../layouts/MainLayout';
import HelmetPromos from '../../Helmets/HelmetPromos';
import FeedLayout from './FeedLayout';
import FeedTagsMore from './FeedTagsMore';
import FeedTitle from './FeedTitle';
import { setType } from '../../redux/slices/feedSlice';
import Spinner from '../../ui/Spinner';
import { RoutesPath } from '../../constants/RoutesPath';
import Button from '../../uiForm/Button';
import { useQueryParams } from '../../hooks/useQueryParams';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ControlsPromoEditModal from '../../admin/pages/Object/ControlsPromoEditModal';

const Layout = ({ data, isLoading = false, onDeleteCard = () => {}, type }) => {
   const [modalPromoEdit, setModalPromoEdit] = useState(false);

   return (
      <div className="grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1">
         {isLoading ? (
            [...new Array(3)].map((_, index) => {
               return <CardBasicSkeleton bg={false} key={index} />;
            })
         ) : data && data.length > 0 ? (
            data.map((card, index) => {
               return (
                  <CardStock
                     deleteCard={() => onDeleteCard(card.id)}
                     {...card}
                     key={index}
                     controlsAdmin
                     editCard={() => {                        
                        const data = {
                           ...card,
                           building_id: card.building_id,
                           is_calculation: card.type === 'calculations',
                           is_news: card.type === 'news',
                        };

                        setModalPromoEdit({
                           data,
                           refetchData: () => {
                              window.location.reload();
                           },
                        });
                     }}
                  />
               );
            })
         ) : (
            <div className="w-full col-span-3">
               <EmptyBlock block={false} />
            </div>
         )}

         <ModalWrapper condition={modalPromoEdit}>
            <ControlsPromoEditModal data={modalPromoEdit?.data} set={setModalPromoEdit} refetchData={modalPromoEdit?.refetchData} />
         </ModalWrapper>
      </div>
   );
};

const FeedPromo = () => {
   const params = useQueryParams();
   const feedSelector = useSelector(state => state.feed);
   const searchParamsTab = [
      {
         id: 0,
         value: 'stocks',
         label: 'Скидки, акции',
      },
      {
         id: 1,
         value: 'news',
         label: 'Подарки',
      },
      {
         id: 2,
         value: 'calculations',
         label: 'Расчеты',
      },
   ];

   const dispatch = useDispatch();

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
      <MainLayout helmet={<HelmetPromos />}>
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
               feedType: 'promo',
               setTotalPages,
               totalPages,
               fetching,
               setFetching,
            }}>
            <FeedLayout>
               <div className="container-desktop">
                  <div className="white-block">
                     <FeedTitle title="Скидки, акции" />
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
                        <Layout
                           data={dataCards[feedSelector.type]}
                           isLoading={isLoading}
                           onDeleteCard={id => {
                              setDataCards(prev => {
                                 return {
                                    ...prev,
                                    [feedSelector.type]: prev[feedSelector.type].filter(item => item.id !== id),
                                 };
                              });
                           }}
                           type={feedSelector.type}
                        />
                        {Boolean(fetching && totalPages >= feedSelector.page) && (
                           <div className="flex items-center mt-10">
                              <Spinner className="mx-auto" />
                           </div>
                        )}
                     </TabsBody>
                     {params.type === 'home' && (
                        <a href={`${RoutesPath.feedPromos}?tab=${feedSelector.type}`} className="w-full mt-8">
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

export default FeedPromo;
