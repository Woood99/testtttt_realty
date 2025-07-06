import React from 'react';
import cn from 'classnames';
import { Helmet } from 'react-helmet';
import { useSellerLayout } from './useSellerLayout';
import { Link, useLocation } from 'react-router-dom';
import BodyAndSidebar from '../../components/BodyAndSidebar';
import Sidebar from '../../components/Sidebar';
import { UserCardSkeleton } from '../../ui/CardsRow';
import UserInfo from '../../ui/UserInfo';
import { capitalizeWords } from '../../helpers/changeString';
import { AuthRoutesPath, RoutesPath, SellerRoutesPath } from '../../constants/RoutesPath';
import { ElementNavBtn } from '../../ui/Elements';
import { IconArrow, IconHouseLaptop } from '../../ui/Icons';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';

const SellerLayout = ({ children, pageTitle, className = '', classNameContent }) => {
   const { userInfo, authLoading } = useSellerLayout();
   const location = useLocation();
   const isDesktop = useSelector(getIsDesktop);

   return (
      <>
         <Helmet>
            <title>{`Мой профиль | ${pageTitle}`}</title>
            <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
            <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
         </Helmet>
         <div className={cn('site-container', className)}>
            <Header />
            <main className="main">
               <h1 className="visually-hidden">На inrut.ru вы можете решить любой вопрос с недвижимостью</h1>
               <div className="main-wrapper">
                  <div className="container-desktop">
                     <BodyAndSidebar className="!grid-cols-[280px_1fr]">
                        <Sidebar>
                           <div className="white-block-small !px-0">
                              <div className="px-6">
                                 {authLoading ? (
                                    <UserCardSkeleton />
                                 ) : (
                                    <Link to={AuthRoutesPath.profile.edit} className="flex justify-between items-center">
                                       <UserInfo
                                          className="w-[85%]"
                                          classListName="text-defaultMax"
                                          classListUser="!text-default"
                                          avatar={userInfo.image}
                                          name={capitalizeWords(userInfo.name, userInfo.surname)}
                                          pos={
                                             <>
                                                Отдел продаж &nbsp; <span className="text-dark font-medium">"{userInfo.organization?.name}"</span>
                                             </>
                                          }
                                          centered
                                       />
                                       <IconArrow className="" />
                                    </Link>
                                 )}
                              </div>

                              {isDesktop && (
                                 <div className="mt-6">
                                    <Link to={SellerRoutesPath.home} className="w-full">
                                       <ElementNavBtn className="!rounded-none !h-[52px]" active={location.pathname === SellerRoutesPath.home}>
                                          <IconHouseLaptop />
                                          <span>Основное</span>
                                       </ElementNavBtn>
                                    </Link>
                                    <Link to={AuthRoutesPath.chat} className="w-full">
                                       <ElementNavBtn className="!rounded-none !h-[52px]">
                                          <IconHouseLaptop />
                                          <span>Чат</span>
                                       </ElementNavBtn>
                                    </Link>
                                    <Link to={SellerRoutesPath.wallet} className="w-full">
                                       <ElementNavBtn className="!rounded-none !h-[52px]" active={location.pathname === SellerRoutesPath.wallet}>
                                          <IconHouseLaptop />
                                          <span>Кошелёк</span>
                                       </ElementNavBtn>
                                    </Link>
                                    <Link to={SellerRoutesPath.view} className="w-full">
                                       <ElementNavBtn className="!rounded-none !h-[52px]" active={location.pathname === SellerRoutesPath.view}>
                                          <IconHouseLaptop />
                                          <span>Записи на просмотр</span>
                                       </ElementNavBtn>
                                    </Link>
                                    <a href={SellerRoutesPath.purchase.list_buyers} className="w-full">
                                       <ElementNavBtn
                                          className="!rounded-none !h-[52px]"
                                          active={location.pathname === SellerRoutesPath.purchase.list_buyers}>
                                          <IconHouseLaptop />
                                          <span>Мои покупатели</span>
                                       </ElementNavBtn>
                                    </a>
                                    <a href={SellerRoutesPath.purchase.list_all} className="w-full">
                                       <ElementNavBtn
                                          className="!rounded-none !h-[52px]"
                                          active={location.pathname === SellerRoutesPath.purchase.list_all}>
                                          <IconHouseLaptop />
                                          <span>Все заявки на покупку</span>
                                       </ElementNavBtn>
                                    </a>
                                    <Link to={SellerRoutesPath.calendar_view} className="w-full">
                                       <ElementNavBtn
                                          className="!rounded-none !h-[52px]"
                                          active={location.pathname === SellerRoutesPath.calendar_view}>
                                          <IconHouseLaptop />
                                          <span>Календарь</span>
                                       </ElementNavBtn>
                                    </Link>

                                    <Link to={SellerRoutesPath.object.list} className="w-full">
                                       <ElementNavBtn className="!rounded-none !h-[52px]" active={location.pathname === SellerRoutesPath.object.list}>
                                          <IconHouseLaptop />
                                          <span>Мои объекты</span>
                                       </ElementNavBtn>
                                    </Link>
                                    <Link to={SellerRoutesPath.objects_developer} className="w-full">
                                       <ElementNavBtn
                                          className="!rounded-none !h-[52px]"
                                          active={location.pathname === SellerRoutesPath.objects_developer}>
                                          <IconHouseLaptop />
                                          <span>Объекты застройщика</span>
                                       </ElementNavBtn>
                                    </Link>
                                    <Link to={SellerRoutesPath.specialists} className="w-full">
                                       <ElementNavBtn className="!rounded-none !h-[52px]" active={location.pathname === SellerRoutesPath.specialists}>
                                          <IconHouseLaptop />
                                          <span>Менеджеры отдела продаж</span>
                                       </ElementNavBtn>
                                    </Link>
                                 </div>
                              )}
                           </div>
                        </Sidebar>
                        <div className={cn('white-block', classNameContent)}>{children}</div>
                     </BodyAndSidebar>
                  </div>
               </div>
            </main>
            <footer className="visually-hidden">Недвижимость на inrut.ru</footer>
         </div>
      </>
   );
};

export default SellerLayout;
