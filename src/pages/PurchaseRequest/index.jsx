import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import ShareModal from '../../ModalsMain/ShareModal';
import BodyAndSidebar from '../../components/BodyAndSidebar';
import Sidebar from '../../components/Sidebar';
import Button from '../../uiForm/Button';
import { PurchasePageContext } from '../../context';
import PurchaseRequestParameters from './PurchaseRequestParameters';
import ComplainModal from './ComplainModal';
import { sendPostRequest } from '../../api/requestsApi';
import { RoutesPath } from '../../constants/RoutesPath';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { getIsDesktop } from '@/redux';
import DeleteModal from '../../ModalsMain/DeleteModal';
import { ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';
import PurchaseRequestHistory from './PurchaseRequestHistory';
import PurchaseRequestUser from './PurchaseRequestUser';
import PurchaseRequestActions from './PurchaseRequestActions';
import FixedBlock from '../../components/FixedBlock';
import { EmptyTextBlock } from '../../components/EmptyBlock';
import Modal from '../../ui/Modal';
import { usePurchaseRequest } from './usePurchaseRequest';
import SuggestionsProvider from '../../components/Suggestions/SuggestionsProvider';
import SuggestionsObjects from '../../components/Suggestions/SuggestionsObjects';
import { suggestionsTypes } from '../../components/Suggestions/suggestions-types';

const PurchaseRequest = () => {
   const params = useParams();
   const isDesktop = useSelector(getIsDesktop);

   const { data, onHandlerComplain, onHandlerDelete, userIsSeller, userIsBuyer, myPurchaseRequest, role_id } = usePurchaseRequest();

   const [isOpenShareModal, setIsOpenShareModal] = useState(false);
   const [isOpenComplainModal, setIsOpenComplainModal] = useState(false);
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);
   const [emptyObjectModal, setEmptyObjectModal] = useState(false);

   // useEffect(() => {
   //    КОД ДЛЯ ПОЛУЧЕНИЯ СУГГЕСТОВ ДЛЯ ИСТОРИИ ДЛЯ ПРОДАВЦА
   //    if (!data) return;
   //    const fetchData = async () => {
   //       const { data: result } = await sendPostRequest(`/seller-api/suggestions-cabinet`, {
   //          per_page: 999,
   //          page: 1,
   //          status: 'created',
   //          from: '2020-06-06 14:15:31',
   //          to: '2025-06-05 14:15:31',
   //          order_id: data.id,
   //          buyer_id: data.user_id,
   //       });
   //       console.log(result);
   //    };

   //    fetchData();
   // }, [data]);

   if (!data) return;

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Заявка на покупку</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <PurchasePageContext.Provider
            value={{
               data,
               role_id,
               setConfirmDeleteModal,
               setIsOpenComplainModal,
               setIsOpenShareModal,
               userIsSeller,
               userIsBuyer,
               myPurchaseRequest,
               emptyObjectModal,
               setEmptyObjectModal,
            }}>
            <SuggestionsProvider
               buyer_id={data.user_id}
               order_id={data.id}
               suggestions_type={role_id === ROLE_SELLER.id ? suggestionsTypes.sellerHistory : suggestionsTypes.buyerOnly}>
               <Header />
               <main className={`main ${!isDesktop && !myPurchaseRequest ? '!pb-[70px]' : ''}`}>
                  <div className="main-wrapper">
                     <div className="container-desktop">
                        <BodyAndSidebar>
                           <div className="flex flex-col gap-3 min-w-0">
                              <PurchaseRequestParameters />
                           </div>
                           <Sidebar>
                              {isDesktop && (
                                 <>
                                    <PurchaseRequestActions />
                                    <PurchaseRequestUser className="mt-3" />
                                    {/* <PurchaseRequestHistory className="mt-3" /> */}
                                 </>
                              )}
                           </Sidebar>
                        </BodyAndSidebar>
                        {Boolean(myPurchaseRequest && role_id === ROLE_BUYER.id) && <SuggestionsObjects className="mt-3" />}
                        {Boolean(role_id === ROLE_SELLER.id) && <SuggestionsObjects className="mt-3" />}

                        {!isDesktop && (
                           <>
                              <PurchaseRequestActions className="mt-3" />
                              <PurchaseRequestUser className="mt-3" />
                              {/* <PurchaseRequestHistory className="mt-3" /> */}
                           </>
                        )}
                     </div>
                  </div>
                  <FixedBlock activeDefault conditionWidth={!isDesktop && userIsSeller}>
                     <div className="py-2.5 px-4 gap-2 grid grid-cols-1">
                        <Link target="_blank" to={`${RoutesPath.listingFlats}?purchase=${params.id}`}>
                           <Button Selector="div">Предложить объект</Button>
                        </Link>
                     </div>
                  </FixedBlock>
                  <FixedBlock activeDefault conditionWidth={!isDesktop && userIsBuyer && !myPurchaseRequest}>
                     <div className="py-2.5 px-4 gap-2 grid grid-cols-1">
                        <Button onClick={() => setEmptyObjectModal(true)}>Предложить объект</Button>
                     </div>
                  </FixedBlock>

                  <ShareModal condition={isOpenShareModal} set={setIsOpenShareModal} title="Поделиться заявкой" />
                  <ModalWrapper condition={isOpenComplainModal}>
                     <ComplainModal condition={isOpenComplainModal} set={setIsOpenComplainModal} onSubmit={onHandlerComplain} />
                  </ModalWrapper>
                  <ModalWrapper condition={confirmDeleteModal}>
                     <DeleteModal
                        title="Вы действительно хотите удалить заявку?"
                        condition={confirmDeleteModal}
                        set={setConfirmDeleteModal}
                        request={onHandlerDelete}
                     />
                  </ModalWrapper>
                  <ModalWrapper condition={emptyObjectModal}>
                     <Modal
                        condition={emptyObjectModal}
                        set={setEmptyObjectModal}
                        options={{ overlayClassNames: '_center-max-content', modalClassNames: 'mmd1:!w-[700px]' }}>
                        <EmptyTextBlock block={false}>
                           <h3 className="title-3 mt-4">У вас нет объекта подходящего под эту заявку</h3>
                        </EmptyTextBlock>
                     </Modal>
                  </ModalWrapper>
               </main>
            </SuggestionsProvider>
         </PurchasePageContext.Provider>
      </MainLayout>
   );
};

export default PurchaseRequest;
