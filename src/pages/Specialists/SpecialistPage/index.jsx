import React from 'react';
import { BlockCardsPrimaryContext, SpecialistPageContext } from '../../../context';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { deleteRequest } from '../../../api/requestsApi';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import DeleteModal from '../../../ModalsMain/DeleteModal';
import { PrivateRoutesPath, RoutesPath } from '../../../constants/RoutesPath';
import { BtnActionBg } from '../../../ui/ActionBtns';
import { IconEdit, IconTrash } from '../../../ui/Icons';
import BodyAndSidebar from '../../../components/BodyAndSidebar';
import { FeedBlock } from '../../../components/Ribbon';
import MapPlacemarks from '../../../components/MapPlacemarks/MapPlacemarks';
import Sidebar from '../../../components/Sidebar';
import Button from '../../../uiForm/Button';
import SpecialistPageInfo from './SpecialistPageInfo';
import SpecialistPageSidebar from './SpecialistPageSidebar';
import BlockCardsPrimary from '../../../components/BlockCardsPrimary';
import MainLayout from '../../../layouts/MainLayout';
import Header from '../../../components/Header';
import HeaderAdmin from '../../../components/Header/HeaderAdmin';
import { getIsDesktop } from '../../../redux/helpers/selectors';

import { useSpecialistPage } from './useSpecialistPage';
import FixedBlock from '../../../components/FixedBlock';

const SpecialistPage = () => {
   const isDesktop = useSelector(getIsDesktop);
   const {
      params,
      data,
      dataMap,
      confirmDeleteModal,
      setConfirmDeleteModal,
      isFullscreenMap,
      setIsFullscreenMap,
      tabActiveValue,
      setTabActiveValue,
      userIsAdmin,
      objectsOptions,
      setObjectsOptions,
      goToChat,
      tabsItems,
   } = useSpecialistPage();

   if (isEmptyArrObj(data)) return;

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Менеджер</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <SpecialistPageContext.Provider value={{ data, tabActiveValue, setTabActiveValue, goToChat, tabsItems }}>
            {userIsAdmin ? <HeaderAdmin maxWidth={972} /> : <Header maxWidth={972} />}
            <main className={cn('main', !isDesktop ? '!pb-[60px]' : '')}>
               <div className="main-wrapper md1:!pt-0">
                  <div className="container-desktop mmd1:!max-w-[972px]">
                     <BodyAndSidebar className="!grid-cols-[615px_1fr] md1:!flex-col-reverse">
                        <div className="flex flex-col gap-3 md1:gap-2 min-w-0">
                           <SpecialistPageInfo />
                           <div>
                              {tabActiveValue === 'objects' && (
                                 <BlockCardsPrimaryContext.Provider
                                    value={{
                                       data,
                                       setOptions: setObjectsOptions,
                                       options: objectsOptions,
                                       title: '',
                                       EmptyBlockContent: (
                                          <>
                                             <h3 className="title-3 mt-4">У этого менеджера пока нету объектов</h3>
                                             <Link to={RoutesPath.specialists.list}>
                                                <Button className="mt-6">К списку менеджеров</Button>
                                             </Link>
                                          </>
                                       ),
                                    }}>
                                    <div ref={objectsOptions.ref}>
                                       <div className="white-block !p-5 mb-3">
                                          <h2 className="title-2-5 mb-4">Объекты менеджера на карте</h2>
                                          {dataMap && !isEmptyArrObj(dataMap) && (
                                             <div>
                                                <MapPlacemarks
                                                   coordinates={dataMap?.coordinates}
                                                   currentCityId={data.cities[0]}
                                                   zoom={10}
                                                   className="mt-4 !h-[300px]"
                                                   sale={dataMap.placemarks?.map(item => {
                                                      return {
                                                         id: item.id,
                                                         geo: item.coordinates,
                                                         minPrice: item.minBdPrice || item.minPrice,
                                                      };
                                                   })}
                                                   isFullscreen={isFullscreenMap}
                                                   setIsFullscreen={setIsFullscreenMap}
                                                />
                                             </div>
                                          )}
                                       </div>
                                       <div className="white-block !p-5">
                                          <h2 className="title-2-5 mb-4">Объекты менеджера</h2>
                                          <BlockCardsPrimary />
                                       </div>
                                    </div>
                                 </BlockCardsPrimaryContext.Provider>
                              )}
                              {tabActiveValue === 'feed' && (
                                 <div className="white-block !p-5">
                                    <FeedBlock data={data.feed} emptyText="Специалист ещё не добавил новости" />
                                 </div>
                              )}
                           </div>
                        </div>
                        {isDesktop && (
                           <Sidebar>
                              {userIsAdmin && (
                                 <div className="white-block-small !py-2 mb-3 grid grid-cols-2 gap-3">
                                    <Link to={`${PrivateRoutesPath.specialists.edit}${params.id}`} className="w-full h-full block">
                                       <BtnActionBg title="Редактировать">
                                          <IconEdit className="!stroke-[currentColor] !stroke-[1.5px] !fill-none" width={18} height={18} />
                                       </BtnActionBg>
                                    </Link>
                                    <BtnActionBg title="Удалить" onClick={() => setConfirmDeleteModal(params.id)}>
                                       <IconTrash className="fill-red" width={16} height={16} />
                                    </BtnActionBg>
                                 </div>
                              )}
                              <div className="white-block-small p-6">
                                 <SpecialistPageSidebar />
                              </div>
                           </Sidebar>
                        )}
                     </BodyAndSidebar>
                  </div>
               </div>
               <FixedBlock activeDefault conditionWidth={!isDesktop}>
                  <div className="py-2.5 px-4 w-full">
                     <Button size="Small" className="w-full" onClick={goToChat}>
                        Задать вопрос в чат
                     </Button>
                  </div>
               </FixedBlock>
               <ModalWrapper condition={confirmDeleteModal}>
                  <DeleteModal
                     condition={confirmDeleteModal}
                     set={setConfirmDeleteModal}
                     request={id => {
                        deleteRequest(`/admin-api/specialists/${id}`).then(() => {
                           window.location.href = RoutesPath.specialists.list;
                        });
                     }}
                  />
               </ModalWrapper>
            </main>
         </SpecialistPageContext.Provider>
      </MainLayout>
   );
};

export default SpecialistPage;
