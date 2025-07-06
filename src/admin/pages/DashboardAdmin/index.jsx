import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { PrivateRoutesPath, RoutesPath } from '../../../constants/RoutesPath';

const dashboardList = [
   {
      label: 'Типы объектов',
      href: PrivateRoutesPath.types.list,
   },
   {
      label: 'Объекты',
      href: RoutesPath.listing,
   },
   {
      label: 'Город',
      href: PrivateRoutesPath.cities.list,
   },
   {
      label: 'Теги/стикеры/Уникальные преимущества объекта',
      href: PrivateRoutesPath.tags.list,
   },
   {
      label: 'Менеджеры',
      href: RoutesPath.specialists.list,
   },
   {
      label: 'Застройщики',
      href: RoutesPath.developers.list,
   },
];

const DashboardAdmin = () => {
   return (
      <>
         <Helmet>
            <title>Админ панель</title>
            <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
            <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
         </Helmet>
         <main className="main">
            <div className="main-wrapper--title">
               <div className="container">
                  <h2 className="title-2">Создание/настройка системы</h2>
               </div>
               <div className="mt-6 container">
                  <div className="white-block grid gap-4 grid-cols-5">
                     {dashboardList.map((item, index) => (
                        <Link
                           key={index}
                           to={item.href}
                           className="border border-solid border-primary100 h-[200px] flex items-center justify-center font-medium hover:shadow-lg text-center">
                           {item.label}
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </main>
      </>
   );
};

export default DashboardAdmin;
