import React, { useEffect, useState } from 'react';
import Tabs from '../../ui/Tabs';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

import ComparisonBody from './ComparisonBody';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import { dataNamesComplex, dataNamesApartment } from './dataComparison';
import { sendPostRequest } from '../../api/requestsApi';
import getCardsBuildings from '../../api/getCardsBuildings';
import { useQueryParams } from '../../hooks/useQueryParams';

const Comparison = () => {
    const params = useQueryParams();

   const [dataComplex, setDataComplex] = useState([]);
   const [dataApartment, setDataApartment] = useState([]);
   const [dataTabs, setDataTabs] = useState([]);

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

   const [_, setSearchParams] = useSearchParams();
   const [defaultTab, setDefaultTab] = useState(null);
   const [isLoadingComplexes, setIsLoadingComplexes] = useState(true);
   const [isLoadingApartment, setIsLoadingApartment] = useState(true);

   useEffect(() => {
      setDefaultTab(searchParams.find(item => item.name === params.type)?.id);
      const comparisonDataComplex = JSON.parse(localStorage.getItem('comparison_complex'));
      const comparisonDataApartment = JSON.parse(localStorage.getItem('comparison_apartment'));

      if (comparisonDataComplex) {
         getCardsBuildings({ visibleObjects: comparisonDataComplex, page: 1 }).then(res => {
            setIsLoadingComplexes(false);
            setDataComplex(res.cards);
         });
      }

      if (comparisonDataApartment) {
         sendPostRequest('/api/apartments', {
            ids: comparisonDataApartment,
            per_page: 99,
            building_id: null,
            page: 1,
         }).then(res => {
            setIsLoadingApartment(false);
            setDataApartment(res.data.items);
         });
      }
   }, []);

   const deleteAll = type => {
      localStorage.removeItem(`comparison_${type}`);
      if (type === 'complex') {
         setDataComplex([]);
      }
      if (type === 'apartment') {
         setDataApartment([]);
      }
   };

   const handlerDeleteCard = (type, id) => {
      const comparisonData = JSON.parse(localStorage.getItem(`comparison_${type}`));
      const newData = comparisonData.filter(item => item !== id);
      localStorage.setItem(`comparison_${type}`, JSON.stringify(newData));

      if (type === 'complex') {
         setDataComplex(prev => prev.filter(item => item.id !== id));
      }
      if (type === 'apartment') {
         setDataApartment(prev => prev.filter(item => item.id !== id));
      }
   };

   useEffect(() => {
      setDataTabs([
         {
            name: 'ЖК',
            body: (
               <ComparisonBody
                  dataNames={dataNamesComplex}
                  data={dataComplex}
                  type="complex"
                  deleteAll={deleteAll}
                  deleteCard={handlerDeleteCard}
                  isLoading={isLoadingComplexes}
               />
            ),
         },
         {
            name: 'Квартиры ЖК',
            body: (
               <ComparisonBody
                  dataNames={dataNamesApartment}
                  data={dataApartment}
                  type="apartment"
                  deleteAll={deleteAll}
                  deleteCard={handlerDeleteCard}
                  isLoading={isLoadingApartment}
               />
            ),
         },
      ]);
   }, [dataComplex, dataApartment]);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Сравнение новостроек</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <Header />
         <main className="main">
            <div className="main-wrapper--title">
               <div className="container-desktop">
                  <h1 className="title-1-5 mb-6 md1:mx-4 md1:mb-5">Сравнение новостроек</h1>
                  <Tabs
                     data={dataTabs}
                     defaultValue={defaultTab}
                     navClassName="md1:px-0 md1:!mx-4"
                     onChange={index => {
                        setSearchParams({ type: searchParams.find(item => item.id === index)?.name });
                     }}
                  />
               </div>
            </div>
         </main>
      </MainLayout>
   );
};

export default Comparison;
