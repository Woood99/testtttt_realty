import { memo, useContext, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { FeedContext } from '../../context';
import FeedTagsMore from './FeedTagsMore';
import CardBasicSkeleton from '../../components/CardBasicSkeleton';
import { CardStock } from '../../ui/CardStock';
import EmptyBlock from '../../components/EmptyBlock';
import ControlsPromoEditModal from '../../admin/pages/Object/ControlsPromoEditModal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Spinner from '../../ui/Spinner';
import { RoutesPath } from '../../constants/RoutesPath';
import Button from '../../uiForm/Button';
import RepeatContent from '../../components/RepeatContent';

const FeedPromoBodyLayout = memo(({ data, onDeleteCard = () => {} }) => {
   const { isLoading } = useContext(FeedContext);
   const [modalPromoEdit, setModalPromoEdit] = useState(false);

   return (
      <div className="grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1">
         {isLoading ? (
            <RepeatContent count={3}>
               <CardBasicSkeleton bg={false} />
            </RepeatContent>
         ) : data?.length > 0 ? (
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
});

const FeedPromoBodyLayoutMain = memo(({ onDeleteCard = () => {} }) => {
   const { isLoading, dataCards, searchParamsTab, onChangeTab } = useContext(FeedContext);
   const [modalPromoEdit, setModalPromoEdit] = useState(false);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-8">
            <RepeatContent count={3}>
               <div className="grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1">
                  <RepeatContent count={3}>
                     <CardBasicSkeleton bg={false} />
                  </RepeatContent>
               </div>
            </RepeatContent>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-8">
         {dataCards.data?.map((item, index) => {
            if (!item.total) return;
            return (
               <div key={index}>
                  {!isLoading && (
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
                              <CardStock
                                 deleteCard={() => onDeleteCard(card.id)}
                                 {...card}
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
                           </SwiperSlide>
                        );
                     })}
                  </Swiper>
               </div>
            );
         })}

         <ModalWrapper condition={modalPromoEdit}>
            <ControlsPromoEditModal data={modalPromoEdit?.data} set={setModalPromoEdit} refetchData={modalPromoEdit?.refetchData} />
         </ModalWrapper>
      </div>
   );
});

const FeedPromoBody = memo(() => {
   const { tags, params, dataCards, feedSelector, fetching, totalPages } = useContext(FeedContext);

   return (
      <div className="white-block mt-3">
         {Boolean(tags.length && params.type !== 'home' && feedSelector.type !== 'main') && (
            <>
               <h3 className="title-3 mb-4">Поиск по тегам</h3>
               <FeedTagsMore />
            </>
         )}
         <div>
            {feedSelector.type === 'main' && (
               <FeedPromoBodyLayoutMain
                  onDeleteCard={() => {
                     window.location.reload();
                  }}
                  data={dataCards}
               />
            )}
            {feedSelector.type !== 'main' && (
               <>
                  <FeedPromoBodyLayout
                     data={dataCards[feedSelector.type]}
                     onDeleteCard={() => {
                        window.location.reload();
                     }}
                     type={feedSelector.type}
                  />
                  {Boolean(fetching && totalPages >= feedSelector.page) && (
                     <div className="flex items-center mt-10">
                        <Spinner className="mx-auto" />
                     </div>
                  )}
               </>
            )}
         </div>
         {params.type === 'home' && (
            <a href={`${RoutesPath.feedPromos}?tab=${feedSelector.type}`} className="w-full mt-8">
               <Button variant="secondary" Selector="div">
                  Смотреть всё
               </Button>
            </a>
         )}
      </div>
   );
});

export default FeedPromoBody;
