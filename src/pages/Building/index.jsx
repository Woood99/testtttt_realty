import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BodyAndSidebar from '../../components/BodyAndSidebar';
import BuildingInfo from './BuildingInfo';
import BuildingSidebar from './BuildingSidebar';
import BuildingApartments from './BuildingApartments';
import BuildingСonstruction from './BuildingСonstruction';
import GalleryThumb from '../../components/GalleryThumb';
import { FeedBlockPrimary } from '../../components/Ribbon';
import BlockApartmentRenov from '../../components/BlockApartmentRenov';
import BlockEcologyParks from '../../components/BlockEcologyParks';
import BuildingMap from './BuildingMap';
import HeaderFixedNav from '../../components/HeaderFixedNav';
import ModalSidebar from './BuildingSidebar/ModalSidebar';
import RecordViewing from '../../ModalsMain/RecordViewing';

import SelectAccLogModal from '../../ModalsMain/SelectAccLogModal';
import BuildingStatistics from './BuildingStatistics';

import BuildingSimilarCity from './BuildingSimilarCity';
import BuildingSpecialists from './BuildingSpecialists';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import BlockPersonalDiscount from '../../components/BlockPersonalDiscount';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { BuildingContext } from '../../context';
import MainLayout from '../../layouts/MainLayout';
import HelmetBuilding from '../../Helmets/HelmetBuilding';
import Header from '../../components/Header';
import Button from '../../uiForm/Button';
import { RoutesPath } from '../../constants/RoutesPath';
import { SidebarMove } from '../../components/Sidebar';
import ChoiceSpecialistForChat from '../../ModalsMain/ChoiceSpecialistForChat';
import ParallaxComponent from '../../components/ParallaxComponent';
import ShareModal from '../../ModalsMain/ShareModal';
import { BtnActionComparison, BtnActionFavorite, BtnActionShare } from '../../ui/ActionBtns';
import FixedBlock from '../../components/FixedBlock';
import { checkAuthUser, getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import ErrorLoading from '../../components/ErrorLoading';

import { useBuilding } from './useBuilding';
import { useToggleNotification } from '../../hooks/useToggleNotification';
import { isAdmin, isSeller } from '../../helpers/utils';
import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';
import QuestionToChat from '../../components/QuestionToChat';
import AnimatedText from '../../ui/AnimatedText';
import RecordViewingSent from '../../ModalsMain/RecordViewing/RecordViewingSent';
import SuggestionsProvider from '../../components/Suggestions/SuggestionsProvider';
import { suggestionsTypes } from '../../components/Suggestions/suggestions-types';
import SuggestionsCard from '../../components/Suggestions/SuggestionsCard';
import RecordViewingContact from '../../ModalsMain/RecordViewing/RecordViewingContact';
import BuildingSkeleton from './BuildingSkeleton';
import { sendPostRequest } from '../../api/requestsApi';

const Building = () => {
   const { id } = useParams();
   const stickyHelpRef = useRef(null);
   const galleryThumbRef = useRef(null);
   const [isOpenRecordView, setIsOpenRecordView] = useState(false);
   const [applicationSentModal, setApplicationSentModal] = useState(false);
   const [isOpenShareModal, setIsOpenShareModal] = useState(false);

   const isDesktop = useSelector(getIsDesktop);
   const { isVisibleNotification, setIsVisibleNotification, onClose: notifOnClose } = useToggleNotification('building_notif_status');

   const [userRole, setUserRole] = useState('');
   const userInfo = useSelector(getUserInfo);
   const authUser = useSelector(checkAuthUser);

   useEffect(() => {
      if (isAdmin(userInfo)) {
         setUserRole(ROLE_ADMIN.name);
      } else if (isSeller(userInfo) && userInfo.associated_objects?.includes(+id)) {
         setUserRole(ROLE_SELLER.name);
      } else {
         setUserRole(ROLE_BUYER.name);
      }
   }, [userInfo]);

   const {
      buildingData,
      minPriceAllObjects,
      maxPriceAllObjects,
      advantages,
      setIsOpenChoiceSpecialist,
      specialistsData,
      goToChat,
      goToChatCall,
      buildingDataError,
      myDiscount,
      frames,
      constructItems,
      isOpenChoiceSpecialist,
      suggestions,
      getSuggestions,
      isLoading,
      isOpenChoiceSpecialistCall,
      setIsOpenChoiceSpecialistCall,
   } = useBuilding(id);

   return (
      <MainLayout helmet={<HelmetBuilding data={buildingData} />}>
         <Header />
         {isLoading && <BuildingSkeleton />}
         {Boolean(!buildingDataError && !isLoading) && (
            <BuildingContext.Provider
               value={{
                  ...buildingData,
                  minPriceAllObjects,
                  maxPriceAllObjects,
                  advantages,
                  setIsOpenChoiceSpecialist,
                  setIsOpenShareModal,
                  specialistsData,
                  goToChat,
                  goToChatCall,
                  isVisibleNotification,
                  setIsVisibleNotification,
                  notifOnClose,
                  userRole,
                  setIsOpenChoiceSpecialistCall,
               }}>
               <main className={`main ${!isDesktop ? '!pb-[110px]' : ''}`}>
                  {isDesktop && <HeaderFixedNav />}
                  <ParallaxComponent condition={!isDesktop} block={galleryThumbRef.current} container={stickyHelpRef.current}>
                     <SidebarMove block={stickyHelpRef.current} targets={['building_sidebar_el_1', 'building_sidebar_el_2']}>
                        <div className="main-wrapper md1:pt-0">
                           <div className="container-desktop">
                              {userRole === ROLE_SELLER.name && <BuildingStatistics buildingData={buildingData} />}
                              {!isEmptyArrObj(buildingData.gallery) && (
                                 <section className="mb-3" ref={galleryThumbRef}>
                                    <GalleryThumb items={buildingData.gallery} videosGallery={buildingData.videos_gallery}>
                                       <div className="absolute top-[26px] right-[26px]  md1:top-4 md1:right-4 z-10 flex items-center gap-2">
                                          <BtnActionFavorite
                                             id={id}
                                             type="complex"
                                             variant="circle"
                                             className={userRole === ROLE_SELLER.name ? 'opacity-60 pointer-events-none' : ''}
                                          />
                                          <BtnActionComparison
                                             id={id}
                                             type="complex"
                                             variant="circle"
                                             className={userRole === ROLE_SELLER.name ? 'opacity-60 pointer-events-none' : ''}
                                          />
                                          <BtnActionShare variant="circle" set={setIsOpenShareModal} />
                                       </div>
                                    </GalleryThumb>
                                 </section>
                              )}

                              <BodyAndSidebar className="relative">
                                 <div className="flex flex-col gap-3 min-w-0" style={{ marginTop: isDesktop ? 0 : 400 }} ref={stickyHelpRef}>
                                    {Boolean(suggestions.length) && (
                                       <SuggestionsProvider
                                          suggestions_type={suggestionsTypes.buyerAll}
                                          customUpdate={() => {
                                             getSuggestions(id);
                                          }}>
                                          {suggestions.map(card => {
                                             return (
                                                <section key={card.status_id}>
                                                   <div className="white-block">
                                                      <SuggestionsCard card={card} suggestions_type={suggestionsTypes.buyerAll} variant="default" />
                                                   </div>
                                                </section>
                                             );
                                          })}
                                       </SuggestionsProvider>
                                    )}
                                    <BuildingInfo />

                                    {/* <section>
                                       <ProgressBar
                                          className="white-block"
                                          data={[
                                             { name: 'Заявка на просмотр', active: true },
                                             { name: 'Принято или отклонено', active: false },
                                             { name: 'Просмотр объекта', active: false },
                                             { name: 'Бронирование', active: false },
                                             { name: 'Сделка', active: false },
                                             { name: 'Кешбэк и подарок', active: false },
                                          ]}
                                       />
                                    </section> */}

                                    {userRole === ROLE_BUYER.name && (
                                       <>
                                          {myDiscount &&
                                             !isEmptyArrObj(myDiscount) &&
                                             myDiscount.map(item => {
                                                return (
                                                   <section key={item.id}>
                                                      <BlockPersonalDiscount data={item} mainData={buildingData} variant="block" />
                                                   </section>
                                                );
                                             })}
                                       </>
                                    )}
                                 </div>
                                 {isDesktop && (
                                    <BuildingSidebar
                                       className="building_sidebar_el_1"
                                       setIsOpenRecordView={setIsOpenRecordView}
                                       controls
                                       specialists={specialistsData}
                                    />
                                 )}
                              </BodyAndSidebar>
                           </div>
                           <section className="mt-3 relative z-10" id="section-apartments-id">
                              <div className="container-desktop">
                                 <BuildingApartments frames={frames} tags={buildingData.tags} advantages={advantages} userRole={userRole} />
                              </div>
                           </section>

                           <div className="container-desktop">
                              <BodyAndSidebar className="mt-3">
                                 <div className="flex flex-col gap-3 min-w-0">
                                    {Boolean(specialistsData.length) && (
                                       <section>
                                          <BuildingSpecialists descr="" specialists={specialistsData} building_id={buildingData.id} />
                                       </section>
                                    )}
                                    <QuestionToChat
                                       classNames="white-block"
                                       building_id={buildingData.id}
                                       organization_id={buildingData.developer.id}
                                       isSpecialist={Boolean(specialistsData.length)}
                                    />
                                    <FeedBlockPrimary
                                       data={[
                                          ...buildingData.videos.map(item => ({ link: item, type: 'video' })),
                                          ...buildingData.shorts.map(item => ({ link: item, type: 'short' })),
                                       ]}
                                       currentComplexId={buildingData.id}
                                    />
                                    <FeedBlockPrimary
                                       data={[
                                          ...buildingData.stock.map(item => ({ ...item, building_id: buildingData.id, type: 'stock' })),
                                          ...buildingData.calculations.map(item => ({ ...item, building_id: buildingData.id, type: 'calculation' })),
                                          ...buildingData.news.map(item => ({ ...item, building_id: buildingData.id, type: 'news' })),
                                       ]}
                                       currentComplexId={buildingData.id}
                                    />
                                    {Boolean(buildingData.apartmentRenov.length || buildingData.videos_apartRenov.length) && (
                                       <section id="section-apartRenov-id">
                                          <BlockApartmentRenov
                                             videosData={buildingData.videos_apartRenov}
                                             data={buildingData.apartmentRenov}
                                             sidebar={<ModalSidebar setIsOpenRecordView={setIsOpenRecordView} />}
                                          />
                                       </section>
                                    )}
                                    {Boolean(buildingData.ecologyParks.length || buildingData.videos_ecologyParks.length) && (
                                       <section id="section-ecologyParks-id">
                                          <BlockEcologyParks
                                             videosData={buildingData.videos_ecologyParks}
                                             data={buildingData.ecologyParks}
                                             sidebar={<ModalSidebar setIsOpenRecordView={setIsOpenRecordView} />}
                                          />
                                       </section>
                                    )}
                                    {Boolean(constructItems.length) && (
                                       <section id="section-constPrgs-id">
                                          <BuildingСonstruction
                                             data={constructItems}
                                             frames={frames}
                                             options={{
                                                frames,
                                                dataObject: buildingData,
                                             }}
                                             sidebar={<ModalSidebar setIsOpenRecordView={setIsOpenRecordView} />}
                                          />
                                       </section>
                                    )}
                                    {!isDesktop && (
                                       <BuildingSidebar setIsOpenRecordView={setIsOpenRecordView} controls specialists={specialistsData} />
                                    )}
                                 </div>
                                 {isDesktop && <BuildingSidebar className="building_sidebar_el_2" setIsOpenRecordView={setIsOpenRecordView} />}
                              </BodyAndSidebar>
                              <section className="mt-3" id="section-location-id">
                                 <BuildingMap currentBuilding={buildingData} coordinates={buildingData.location} variant="block" />
                              </section>
                              <BuildingSimilarCity id={buildingData.id} currentCity={buildingData.city} defaultPrice={buildingData.minPrice || 0} />
                           </div>
                        </div>
                     </SidebarMove>
                  </ParallaxComponent>

                  {userRole === ROLE_BUYER.name && (
                     <FixedBlock activeDefault conditionWidth={!isDesktop}>
                        <div className="py-2.5 px-4 gap-2 grid grid-cols-2 md3:grid-cols-1">
                           <Button size="Small" onClick={goToChat}>
                              Задать вопрос в чат
                           </Button>
                           <Button size="Small" variant="secondary" onClick={() => setIsOpenRecordView(true)}>
                              <AnimatedText texts={['Записаться на просмотр', 'Записаться на онлайн-показ']} intervalTime={3000} />
                           </Button>
                        </div>
                     </FixedBlock>
                  )}
               </main>

               {authUser ? (
                  <>
                     {Boolean(suggestions.length) ? (
                        <RecordViewingContact
                           condition={isOpenRecordView}
                           set={setIsOpenRecordView}
                           suggestions={suggestions}
                           customUpdate={async () => {
                              setIsOpenRecordView(false);
                              await getSuggestions(id);
                           }}
                        />
                     ) : (
                        <>
                           <ModalWrapper condition={isOpenRecordView}>
                              <RecordViewing
                                 condition={isOpenRecordView}
                                 set={setIsOpenRecordView}
                                 type="building"
                                 id={buildingData?.id}
                                 developName={buildingData.developer.name}
                                 objectData={buildingData}
                                 specialists={specialistsData}
                                 onUpdate={() => {
                                    getSuggestions(id);
                                    setIsOpenRecordView(false);
                                    setApplicationSentModal(true);
                                 }}
                              />
                           </ModalWrapper>
                        </>
                     )}
                  </>
               ) : (
                  <SelectAccLogModal condition={isOpenRecordView} set={setIsOpenRecordView} />
               )}
               <RecordViewingSent condition={applicationSentModal} set={setApplicationSentModal} />
               <ChoiceSpecialistForChat
                  condition={isOpenChoiceSpecialist}
                  set={setIsOpenChoiceSpecialist}
                  specialists={specialistsData}
                  building_id={buildingData.id}
                  title="Выберите менеджера для консультации"
                  descr="Напишите застройщику в чат, он подробно ответит на ваши вопросы"
                  toChat
               />
               <ChoiceSpecialistForChat
                  condition={isOpenChoiceSpecialistCall}
                  set={setIsOpenChoiceSpecialistCall}
                  specialists={specialistsData}
                  building_id={buildingData.id}
                  title="Выберите менеджера для консультации"
                  descr="По умолчанию ваша камера будет выключена"
                  toCall
               />
               <ShareModal condition={isOpenShareModal} set={setIsOpenShareModal} />
            </BuildingContext.Provider>
         )}
         {buildingDataError && (
            <main className="main">
               <div className="main-wrapper flex flex-col">
                  <div className="white-block !py-16 text-center flex flex-col items-center flex-grow">
                     {buildingDataError === 404 ? (
                        <>
                           <h1 className="title-2">Объявление снято с публикации</h1>

                           <a href={RoutesPath.home} className="mt-6">
                              <Button Selector="div">Перейти на главную страницу</Button>
                           </a>
                        </>
                     ) : (
                        <ErrorLoading />
                     )}
                  </div>
               </div>
            </main>
         )}
      </MainLayout>
   );
};

export default Building;
