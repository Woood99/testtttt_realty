import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { PurchaseListContext } from '../../context';
import CardBasicRowSkeleton from '../../components/CardBasicRowSkeleton';
import PaginationPage from '../../components/Pagination';
import { CardRowPurchaseBasic } from '../../ui/CardsRow';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { PrivateRoutesPath, RoutesPath, SellerRoutesPath } from '../../constants/RoutesPath';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import PurchaseListForm from './PurchaseListForm';
import { getCitiesValuesSelector } from '@/redux';
import { ROLE_BUYER } from '../../constants/roles';
import RepeatContent from '../../components/RepeatContent';
import EmptyBlock from '../../components/EmptyBlock';
import { usePurchaseList } from './usePurchaseList';
import { Tooltip } from '../../ui/Tooltip';
import { IconEdit, IconEllipsis, IconTrash } from '../../ui/Icons';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import DeleteModal from '../../ModalsMain/DeleteModal';
import { getDataRequest } from '../../api/requestsApi';

const PurchaseList = ({ role_id = ROLE_BUYER.id }) => {
   const cities = useSelector(getCitiesValuesSelector);

   const {
      data,
      filterCount,
      isOpenMoreFilter,
      setIsOpenMoreFilter,
      currentCity,
      control,
      reset,
      types,
      setDevelopers,
      developers,
      complexes,
      setComplexes,
      setValue,
      watchedValues,
      initFieldsForm,
      setInitFieldsForm,
      userIsSeller,
      userIsAdmin,
      isLoading,
      currentPage,
      setCurrentPage,
      fetchData,
   } = usePurchaseList(role_id);
   const [confirmDeleteCard, setConfirmDeleteCard] = useState(null);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Заявки на покупку</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <PurchaseListContext.Provider
            value={{
               filterCount,
               isOpenMoreFilter,
               setIsOpenMoreFilter,
               currentCity,
               cities,
               control,
               reset,
               types,
               setDevelopers,
               developers,
               complexes,
               setComplexes,
               setValue,
               watchedValues,
               initFieldsForm,
               setInitFieldsForm,
            }}>
            <Header />
            <main className="main">
               <div className="main-wrapper">
                  <div className="container-desktop">
                     <div className="white-block">
                        <h2 className="title-2">Заявки на покупку</h2>
                        {/* <PurchaseListForm /> */}
                     </div>

                     <div className="mt-3">
                        <div className="flex flex-col white-block !px-0 !py-5 md1:!py-3 ">
                           {isLoading ? (
                              <RepeatContent count={8}>
                                 <CardBasicRowSkeleton className="grid-cols-[700px_160px] h-[135px] !shadow-none mmd1:justify-between  md1:flex md1:flex-col md1:gap-3 md1:items-start">
                                    <WebSkeleton className="h-10 md1:w-3/4 rounded-lg" />
                                    <WebSkeleton className="h-10 md1:w-3/4 rounded-lg" />
                                 </CardBasicRowSkeleton>
                              </RepeatContent>
                           ) : (
                              <>
                                 {data.items?.length ? (
                                    <>
                                       {data.items.map((item, index) => (
                                          <CardRowPurchaseBasic
                                             classNameContent={
                                                userIsAdmin
                                                   ? 'mmd1:grid mmd1:grid-cols-[1fr_200px_max-content]'
                                                   : 'mmd1:grid mmd1:grid-cols-[940px_max-content]'
                                             }
                                             className={cn('py-5 px-8', userIsAdmin && 'justify-normal')}
                                             data={{ ...item, current_type: types.find(type => type.value === item.type) }}
                                             key={index}
                                             href={`${userIsSeller ? `${SellerRoutesPath.purchase.inner}` : `${RoutesPath.purchase.inner}`}${
                                                item.id
                                             }`}
                                             actionsChildren={
                                                userIsAdmin ? (
                                                   <Tooltip
                                                      mobile
                                                      color="white"
                                                      ElementTarget={() => (
                                                         <div className="h-7 w-7 bg-primary800 flex-center-all rounded-lg cursor-pointer">
                                                            <IconEllipsis
                                                               className="fill-dark pointer-events-none rotate-90"
                                                               width={18}
                                                               height={18}
                                                            />
                                                         </div>
                                                      )}
                                                      event="click">
                                                      <div className="flex flex-col gap-4 items-start">
                                                         <Link
                                                            className="flex gap-2"
                                                            target="_blank"
                                                            to={`${PrivateRoutesPath.purchase.edit}${item.id}`}>
                                                            <IconEdit className="stroke-blue" width={18} height={18} />
                                                            Редактировать
                                                         </Link>
                                                         <button className="flex gap-2" onClick={() => setConfirmDeleteCard(item.id)}>
                                                            <IconTrash className="stroke-red" width={16} height={16} />
                                                            Удалить заявку
                                                         </button>
                                                      </div>
                                                   </Tooltip>
                                                ) : null
                                             }
                                          />
                                       ))}
                                    </>
                                 ) : (
                                    <EmptyBlock block={false} />
                                 )}
                              </>
                           )}
                        </div>
                        <PaginationPage
                           className="mt-8"
                           currentPage={currentPage}
                           setCurrentPage={value => setCurrentPage(value)}
                           total={data.pages}
                        />
                     </div>
                  </div>
               </div>
            </main>
         </PurchaseListContext.Provider>

         <ModalWrapper condition={confirmDeleteCard}>
            <DeleteModal
               condition={confirmDeleteCard}
               set={setConfirmDeleteCard}
               request={async id => {
                  await getDataRequest(`/admin-api/purchase-orders/${id}/delete`);
                  setConfirmDeleteCard(null);
                  fetchData();
               }}
               title="Вы действительно хотите удалить заявку?"
            />
         </ModalWrapper>
      </MainLayout>
   );
};

export default PurchaseList;
