import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import debounce from 'lodash.debounce';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


import PaginationPage from '../../components/Pagination';
import CardBasicRowSkeleton from '../../components/CardBasicRowSkeleton';
import { CardRowPurchaseBasic } from '../../ui/CardsRow';
import { BuyerRoutesPath } from '../../constants/RoutesPath';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import DeleteModal from '../../ModalsMain/DeleteModal';
import { TabsBody, TabsNav, TabsTitle } from '../../ui/Tabs';
import { EmptyTextBlock } from '../../components/EmptyBlock';
import BodyAndSidebar from '../../components/BodyAndSidebar';
import Sidebar from '../../components/Sidebar';
import { SidebarNavElements } from '../../components/SidebarNav';
import { Tooltip } from '../../ui/Tooltip';
import { IconComplain, IconEdit, IconEllipsis, IconTrash } from '../../ui/Icons';
import { getIsDesktop } from '@/redux';
import RepeatContent from '../../components/RepeatContent';
import { useQueryParams } from '../../hooks/useQueryParams';

const MyPurchaseList = () => {
   const [searchParams, setSearchParams] = useSearchParams();
    const params = useQueryParams();

   const searchParamsTab = [
      {
         id: 0,
         value: 'open',
         label: 'Открытые',
      },
      {
         id: 1,
         value: 'close',
         label: 'Закрытые',
      },
   ];

   const [types, setTypes] = useState([]);

   const [isLoading, setIsLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [activeType, setActiveType] = useState(null);

   const [confirmDeleteCard, setConfirmDeleteCard] = useState(null);
   const [confirmToggleCard, setConfirmToggleCard] = useState(null);

   const isDesktop = useSelector(getIsDesktop);

   const [data, setData] = useState({
      total: 0,
      pages: 0,
      items: [],
   });

   useEffect(() => {
      getDataRequest('/api/object-types').then(res => {
         if (!res.data) return;
         setTypes(
            res.data.map(item => ({
               value: item.id,
               label: item.name,
            }))
         );
      });
   }, []);

   const fetchData = useCallback(
      debounce(state => {
         setIsLoading(true);
         const fetchParams = {
            page: state.currentPage || 1,
            per_page: 12,
            active: state.status,
         };

         sendPostRequest('/buyer-api/purchase-orders', fetchParams).then(res => {
            setIsLoading(false);
            setData(res.data);
         });
      }, 350),
      []
   );

   useEffect(() => {
      const currentTab = searchParamsTab.find(item => item.value === params.tab) || searchParamsTab[0];
      setActiveType(currentTab?.value);
      setCurrentPage(1);
   }, [activeType]);

   useEffect(() => {
      fetchData({ currentPage, status: activeType === 'open' });
   }, [currentPage, activeType]);

   const onHandlerDelete = async id => {
      await getDataRequest(`/buyer-api/purchase-orders/${id}/delete`);
      setConfirmDeleteCard(null);
      fetchData({ status: activeType === 'open' });
   };

   const onHandlerToggle = async data => {
      await getDataRequest(`/buyer-api/purchase-orders/${data.id}/${data.type}`);
      setConfirmToggleCard(null);
      fetchData({ status: activeType === 'open' });
   };

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Мои заявки на покупку</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <Header />
         <main className="main">
            <div className="main-wrapper">
               <div className="container-desktop">
                  <h1 className="visually-hidden">Мои заявки на покупку</h1>

                  <BodyAndSidebar className="!grid-cols-[1fr_345px]">
                     <div>
                        <div className="white-block mb-3">
                           <TabsNav>
                              {searchParamsTab.map((item, index) => {
                                 return (
                                    <TabsTitle
                                       border
                                       onChange={() => {
                                          setIsLoading(true);
                                          const newParams = new URLSearchParams(searchParams);
                                          const currentTabName = searchParamsTab.find(item => item.id === index)?.value;
                                          newParams.set('tab', currentTabName);
                                          setSearchParams(newParams);
                                          setActiveType(currentTabName);
                                       }}
                                       value={activeType === item.value}
                                       key={index}>
                                       {item.label}
                                    </TabsTitle>
                                 );
                              })}
                           </TabsNav>
                        </div>
                        <TabsBody className="!mt-0">
                           <div className="flex flex-col white-block !px-0 !py-5 md1:!py-3">
                              {isLoading ? (
                                 <RepeatContent count={8}>
                                    <CardBasicRowSkeleton className="grid-cols-[200px_350px] mmd1:justify-between h-[135px] !shadow-none md1:flex md1:flex-col md1:gap-3 md1:items-start">
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
                                                className="py-5 px-8 mmd1:!flex"
                                                data={{ ...item, current_type: types.find(type => type.value === item.type) }}
                                                key={index}
                                                href={`${BuyerRoutesPath.purchase.inner}${item.id}`}
                                                userVisible={false}
                                                actionsChildren={
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
                                                         <button
                                                            className="flex gap-2"
                                                            onClick={() =>
                                                               setConfirmToggleCard({ id: item.id, type: item.active ? 'close' : 'open' })
                                                            }>
                                                            <IconComplain className="fill-red" width={18} height={18} />
                                                            {item.active ? 'Заблокировать' : 'Разблокировать'}
                                                         </button>
                                                         <Link
                                                            className="flex gap-2"
                                                            target="_blank"
                                                            to={`${BuyerRoutesPath.purchase.edit}${item.id}`}>
                                                            <IconEdit className="stroke-blue" width={18} height={18} />
                                                            Редактировать
                                                         </Link>
                                                         <button className="flex gap-2" onClick={() => setConfirmDeleteCard(item.id)}>
                                                            <IconTrash className="stroke-red" width={16} height={16} />
                                                            Удалить заявку
                                                         </button>
                                                      </div>
                                                   </Tooltip>
                                                }
                                             />
                                          ))}
                                       </>
                                    ) : (
                                       <EmptyTextBlock block={false}>
                                          <h4 className="title-3 mt-4">{activeType === 'open' ? 'Открытых заявок нет' : 'Закрытых заявок нет'}</h4>
                                       </EmptyTextBlock>
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
                        </TabsBody>
                     </div>
                     {isDesktop && (
                        <Sidebar>
                           <SidebarNavElements activeObj={{ name: 'my-purchase', count: data.total || 0 }} />
                        </Sidebar>
                     )}
                  </BodyAndSidebar>
               </div>
            </div>
            <ModalWrapper condition={confirmDeleteCard}>
               <DeleteModal
                  condition={confirmDeleteCard}
                  set={setConfirmDeleteCard}
                  request={id => onHandlerDelete(id)}
                  title="Вы действительно хотите удалить заявку?"
               />
            </ModalWrapper>
            <ModalWrapper condition={confirmToggleCard}>
               <DeleteModal
                  condition={confirmToggleCard}
                  set={setConfirmToggleCard}
                  request={data => {
                     onHandlerToggle(data);
                  }}
                  title={`Вы действительно хотите ${confirmToggleCard?.type === 'open' ? 'разблокировать' : 'заблокировать'} заявку?`}
               />
            </ModalWrapper>
         </main>
      </MainLayout>
   );
};

export default MyPurchaseList;
