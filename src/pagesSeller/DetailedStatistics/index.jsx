import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Tabs from '../../ui/Tabs';
import { getDataRequest } from '../../api/requestsApi';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import { DetailedStatisticsContext } from '../../context';
import DetailedStatisticsCardInfo from './DetailedStatisticsCardInfo';
import DetailedStatisticsTabsLayout from './DetailedStatisticsTabsLayout';

const DetailedStatistics = () => {
   const params = useParams();
   const names = [
      'views_my_complex',
      'views_complex',
      'views_my_apart',
      'views_apart',
      'views_apart',
      'likes.my_complex',
      'likes.my_apart',
      'added_to_compare.my_complex',
      'added_to_compare.my_apart',
      'my_promo',
      'promo',
      'my_calculations',
      'calculations',
      'my_news',
      'news',
   ];
   const [data, setData] = useState({});

   const [cards, setCards] = useState(
      names.map(item => ({
         name: item,
         data: {},
         page: 1,
         isLoading: true,
      }))
   );

   const dataTabs = [
      {
         name: 'Просмотров карточки ЖК',
         body: (
            <DetailedStatisticsTabsLayout
               tabData={[
                  {
                     title: 'Мои ЖК',
                     type: 'complex',
                     name: 'views_my_complex',
                     cardIds: data.views_my_complex,
                  },
                  {
                     title: 'Все ЖК',
                     type: 'complex',
                     name: 'views_complex',
                     cardIds: data.views_complex,
                  },
               ]}
            />
         ),
      },
      {
         name: 'Просмотров объектов ЖК',
         body: (
            <DetailedStatisticsTabsLayout
               tabData={[
                  {
                     title: 'Мои объекты ЖК',
                     type: 'apart',
                     name: 'views_my_apart',
                     cardIds: data.views_my_apart,
                  },
                  {
                     title: 'Все объекты ЖК',
                     type: 'apart',
                     name: 'views_apart',
                     cardIds: data.views_apart,
                  },
               ]}
            />
         ),
      },
      {
         name: 'Добавил в избранное',
         body: (
            <DetailedStatisticsTabsLayout
               tabData={[
                  {
                     title: 'Мои ЖК',
                     type: 'complex',
                     name: 'likes.my_complex',
                     cardIds: data.likes?.my_complex,
                  },
                  {
                     title: 'Мои объекты ЖК',
                     type: 'apart',
                     name: 'likes.my_apart',
                     cardIds: data.likes?.my_apart,
                  },
               ]}
            />
         ),
      },
      {
         name: 'Добавил в сравнение',
         body: (
            <DetailedStatisticsTabsLayout
               tabData={[
                  {
                     title: 'Мои ЖК',
                     type: 'complex',
                     name: 'added_to_compare.my_complex',
                     cardIds: data.added_to_compare?.my_complex,
                  },
                  {
                     title: 'Мои объекты ЖК',
                     type: 'apart',
                     name: 'added_to_compare.my_apart',
                     cardIds: data.added_to_compare?.my_apart,
                  },
               ]}
            />
         ),
      },

      {
         name: 'Скидки и расчёты',
         body: (
            <DetailedStatisticsTabsLayout
               tabData={[
                  {
                     title: 'Мои скидки',
                     type: 'promo',
                     subtype: 'stocks',
                     name: 'my_promo',
                     cardIds: data.my_promo,
                  },
                  {
                     title: 'Все скидки',
                     type: 'promo',
                     subtype: 'stocks',
                     name: 'promo',
                     cardIds: data.promo,
                  },
                  {
                     title: 'Мои расчёты',
                     type: 'promo',
                     subtype: 'calculations',
                     name: 'my_calculations',
                     cardIds: data.my_calculations,
                  },
                  {
                     title: 'Все расчеты',
                     type: 'promo',
                     subtype: 'calculations',
                     name: 'calculations',
                     cardIds: data.calculations,
                  },
                  {
                     title: 'Мои подарки',
                     type: 'promo',
                     subtype: 'news',
                     name: 'my_news',
                     cardIds: data.my_news,
                  },
                  {
                     title: 'Все подарки',
                     type: 'promo',
                     subtype: 'news',
                     name: 'news',
                     cardIds: data.news,
                  },
               ]}
            />
         ),
      },
      {
         name: 'Видео и Клипы',
         body: (
            <>
               <div className="white-block">
                  <Tabs
                     data={[
                        {
                           name: 'Мои видео',
                           body: <>2</>,
                        },
                        {
                           name: 'Все видео',
                           body: <>1</>,
                        },
                        {
                           name: 'Мои клипы',
                           body: <>4</>,
                        },
                        {
                           name: 'Все клипы',
                           body: <>3</>,
                        },
                     ]}
                  />
               </div>
            </>
         ),
      },
      {
         name: 'Заказ звонка',
         body: <></>,
      },
      {
         name: 'Запись на просмотр',
         body: <></>,
      },
      {
         name: 'Сообщения',
         body: <>?</>,
      },
   ];

   useEffect(() => {
      getDataRequest(`/seller-api/stats/detailed/user/${params.id}`)
         .then(res => {
            console.log(res.data);

            setData(res.data);
         })
         .catch(err => {
            console.log(err);
         });
   }, []);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Подробная статистика покупателя</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <Header />
         <DetailedStatisticsContext.Provider value={{ data, cards, setCards }}>
            <main className="main">
               <div className="main-wrapper--title">
                  <h1 className="title-2 container">Подробная статистика покупателя</h1>
                  <div className="mt-6 container">
                     <div className="mb-8">
                        <DetailedStatisticsCardInfo />
                     </div>
                     <Tabs data={dataTabs} type="second" navClassName="sticky top-0 left-0 z-[999]" />
                  </div>
               </div>
            </main>
         </DetailedStatisticsContext.Provider>
      </MainLayout>
   );
};

export default DetailedStatistics;
