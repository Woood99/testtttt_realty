import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Tabs from '../../ui/Tabs';

import Button from '../../uiForm/Button';
import { RoutesPath } from '../../constants/RoutesPath';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import getCardsBuildings from '../../api/getCardsBuildings';
import { useCookies } from 'react-cookie';
import { EmptyTextBlock } from '../../components/EmptyBlock';
import CardPrimary from '../../ui/CardPrimary';
import CardSecond from '../../ui/CardSecond';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import { useQueryParams } from '../../hooks/useQueryParams';
import { CardPrimarySkeleton } from '../../ui/CardPrimary/CardPrimarySkeleton';

const Favorites = () => {
   const [cookies] = useCookies();
   const [dataTabs, setDataTabs] = useState([]);

   const [_, setSearchParams] = useSearchParams();

   const [defaultTab, setDefaultTab] = useState(null);

    const params = useQueryParams();

   const [complexLoading, setComplexLoading] = useState(true);
   const [apartmentLoading, setApartmentLoading] = useState(true);

   const [dataComplex, setDataComplex] = useState([]);
   const [dataApartment, setDataApartment] = useState([]);

   const searchParams = [
      {
         id: 0,
         name: 'complexes',
      },
      {
         id: 1,
         name: 'apartments',
      },
   ];

   useEffect(() => {
      setDefaultTab(searchParams.find(item => item.name === params.type)?.id);
      if (!cookies.loggedIn) return;
      const fetch = async () => {
         setComplexLoading(true);
         setApartmentLoading(true);
         const likes = await getDataRequest('/api/likes').then(res => res.data);
         const complexesIds = likes.filter(item => item.type === 'building').map(item => item.id);
         const apartmentsIds = likes.filter(item => item.type === 'apartment').map(item => item.id);

         const complexes = await getCardsBuildings({ visibleObjects: complexesIds }).then(res => res.cards);
         const apartments = apartmentsIds.length
            ? await sendPostRequest('/api/apartments', { ids: apartmentsIds, per_page: 99 }).then(res => res.data)
            : {};

         setDataComplex(complexes);
         setDataApartment(apartments.items || []);

         setComplexLoading(false);
         setApartmentLoading(false);
      };
      fetch();
   }, []);

   useEffect(() => {
      setDataTabs([
         {
            name: 'ЖК',
            body: (
               <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
                  {cookies.loggedIn ? (
                     <>
                        {complexLoading ? (
                           [...new Array(3)].map((_, index) => {
                              return <CardPrimarySkeleton variant="shadow" key={index} />;
                           })
                        ) : dataComplex.length > 0 ? (
                           dataComplex.map((item, index) => <CardPrimary key={index} {...item} variant="shadow" />)
                        ) : (
                           <EmptyTextBlock className="col-span-full">
                              <h3 className="title-3 mt-4">Добавляйте объявления в избранное</h3>
                              <p className="mt-3">Отмечайте интересные объявления чтобы получать персональные скидки от застройщика</p>
                              <Link to={RoutesPath.listing} className="mt-6">
                                 <Button Selector="div">Искать объявления</Button>
                              </Link>
                           </EmptyTextBlock>
                        )}
                     </>
                  ) : (
                     <EmptyTextBlock className="col-span-full">
                        <h3 className="title-3 mt-4">Добавляйте объявления в избранное</h3>
                        <p className="mt-3">Авторизируйтесь что-бы получать персональные скидки от застройщиков</p>
                     </EmptyTextBlock>
                  )}
               </div>
            ),
            count: dataComplex.length,
         },
         {
            name: 'Квартиры ЖК',
            body: (
               <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
                  {cookies.loggedIn ? (
                     <>
                        {apartmentLoading ? (
                           [...new Array(3)].map((_, index) => {
                              return <CardPrimarySkeleton variant="shadow" key={index} />;
                           })
                        ) : dataApartment.length > 0 ? (
                           dataApartment.map((item, index) => <CardSecond key={index} {...item} variant="shadow" />)
                        ) : (
                           <>
                              <EmptyTextBlock className="col-span-full">
                                 <h3 className="title-3 mt-4">Добавляйте объявления в избранное</h3>
                                 <p className="mt-3">Отмечайте интересные объявления чтобы получать персональные скидки от застройщика</p>
                                 <Link to={RoutesPath.listing} className="mt-6">
                                    <Button Selector="div">Искать объявления</Button>
                                 </Link>
                              </EmptyTextBlock>
                           </>
                        )}
                     </>
                  ) : (
                     <EmptyTextBlock className="col-span-full">
                        <h3 className="title-3 mt-4">Добавляйте объявления в избранное</h3>
                        <p className="mt-3">Авторизируйтесь что-бы получать персональные скидки от застройщиков</p>
                     </EmptyTextBlock>
                  )}
               </div>
            ),
            count: dataApartment.length,
         },
      ]);
   }, [dataComplex, dataApartment]);

   return (
      <>
         <MainLayout
            helmet={
               <Helmet>
                  <title>Избранное</title>
                  <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
                  <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
               </Helmet>
            }>
            <Header />
            <main className="main">
               <div className="main-wrapper--title">
                  <div className="container-desktop">
                     <h1 className="title-1-5 mb-6 md1:mx-4 md1:mb-5">Избранное</h1>
                     <Tabs
                        data={dataTabs}
                        defaultValue={defaultTab}
                        navClassName="md1:mx-4"
                        onChange={index => {
                           setSearchParams({ type: searchParams.find(item => item.id === index)?.name });
                        }}
                     />
                  </div>
               </div>
            </main>
         </MainLayout>
      </>
   );
};

export default Favorites;
