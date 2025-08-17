import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { DeveloperPageContext } from '../../../context';
import { RoutesPath } from '../../../constants/RoutesPath';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import DeleteModal from '../../../ModalsMain/DeleteModal';
import { deleteRequest } from '../../../api/requestsApi';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import DeveloperPageInfo from './DeveloperPageInfo';
import MainLayout from '../../../layouts/MainLayout';
import Header from '../../../components/Header';
import HeaderAdmin from '../../../components/Header/HeaderAdmin';
import { DeveloperPageContent } from './DeveloperPageContent';
import { useDeveloperPage } from './useDeveloperPage';
import FixedBlock from '../../../components/FixedBlock';
import { getIsDesktop } from '@/redux';
import DeveloperPageChat from './DeveloperPageChat';

const DeveloperPage = () => {
   const {
      params,
      paramsString,
      citiesItems,
      tabActiveValue,
      setTabActiveValue,
      data,
      userIsAdmin,
      specialistsData,
      confirmDeleteModal,
      setConfirmDeleteModal,
      isFullscreenMap,
      setIsFullscreenMap,
      objectsOptions,
      setObjectsOptions,
   } = useDeveloperPage();

   const isDesktop = useSelector(getIsDesktop);
   if (isEmptyArrObj(data)) return;

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Застройщик</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <DeveloperPageContext.Provider
            value={{
               developerId: params.id,
               data,
               specialistsData,
               citiesItems,
               currentCity: paramsString.city || '',
               tabActiveValue,
               setTabActiveValue,
               objectsOptions,
               setObjectsOptions,
               userIsAdmin,
               paramsString,
               isFullscreenMap,
               setIsFullscreenMap,
               setConfirmDeleteModal,
            }}>
            {userIsAdmin ? <HeaderAdmin maxWidth={972} /> : <Header maxWidth={972} />}
            <main className={cn('main', !isDesktop ? '!pb-[60px]' : '')}>
               <div className="main-wrapper md1:!pt-0">
                  <div className="container-desktop mmd1:!max-w-[972px]">
                     <DeveloperPageInfo />
                     <div className="mmd1:mt-3 md1:pt-2">
                        <DeveloperPageContent />
                     </div>
                  </div>
               </div>
               <FixedBlock activeDefault conditionWidth={!isDesktop}>
                  <div className="py-2.5 px-4 w-full">
                     <DeveloperPageChat size='Small' className="w-full" />
                  </div>
               </FixedBlock>
               <ModalWrapper condition={confirmDeleteModal}>
                  <DeleteModal
                     condition={confirmDeleteModal}
                     set={setConfirmDeleteModal}
                     request={id => {
                        deleteRequest(`/admin-api/developers/${id}`).then(() => {
                           window.location.href = RoutesPath.developers.list;
                        });
                     }}
                  />
               </ModalWrapper>
            </main>
         </DeveloperPageContext.Provider>
      </MainLayout>
   );
};

export default DeveloperPage;
