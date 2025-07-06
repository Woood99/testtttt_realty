import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import Button from '../../uiForm/Button';
import { PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import PaginationPage from '../../components/Pagination';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import HeaderAdmin from '../../components/Header/HeaderAdmin';
import DevelopersListFilters from './DevelopersListFilters';
import { getCitiesValuesSelector, getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import BodyAndSidebar from '../../components/BodyAndSidebar';
import Sidebar from '../../components/Sidebar';
import { SidebarNavElements } from '../../components/SidebarNav';
import EmptyBlock from '../../components/EmptyBlock';
import { UserCardBasic, UserCardBasicSkeleton } from '../../ui/CardsRow';
import RepeatContent from '../../components/RepeatContent';
import { declensionWordsHouse } from '../../helpers/declensionWords';
import { isAdmin } from '../../helpers/utils';
import { useDevelopersList } from './useDevelopersList';
import { CHAT_TYPES } from '../../components/Chat/constants';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';

const DevelopersList = () => {
   const isDesktop = useSelector(getIsDesktop);
   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);
   const citiesData = useSelector(getCitiesValuesSelector);
   const navigateToChat = useNavigateToChat();

   const { currentCity, control, reset, setValue, isLoading, currentPage, setCurrentPage, watchedValues, dataItems, titleText } = useDevelopersList();

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>{titleText}</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         {userIsAdmin ? (
            <HeaderAdmin>
               {!isDesktop && (
                  <DevelopersListFilters currentCity={currentCity} control={control} reset={reset} citiesData={citiesData} setValue={setValue} />
               )}
            </HeaderAdmin>
         ) : (
            <Header>
               {!isDesktop && (
                  <DevelopersListFilters currentCity={currentCity} control={control} reset={reset} citiesData={citiesData} setValue={setValue} />
               )}
            </Header>
         )}
         <main className="main main-headerForm">
            {isDesktop && (
               <DevelopersListFilters currentCity={currentCity} control={control} reset={reset} citiesData={citiesData} setValue={setValue} />
            )}

            <div className="main-wrapper--title">
               <div className="container-desktop">
                  <div className="flex justify-between gap-4 mb-6 md1:mx-4">
                     <h1 className="title-1">{titleText}</h1>
                     {userIsAdmin && (
                        <div className="flex items-center justify-between">
                           <Link to={PrivateRoutesPath.developers.create} target="_blank" rel="noopener noreferrer">
                              <Button size="Small" Selector="div">
                                 Создать застройщика
                              </Button>
                           </Link>
                        </div>
                     )}
                  </div>
                  <BodyAndSidebar className="!grid-cols-[1fr_345px]">
                     <div className="flex flex-col white-block !px-0 !py-5 mmd1:self-start md1:!py-3">
                        {!Boolean(!isLoading && dataItems.items?.length === 0) ? (
                           <>
                              <div className="flex flex-col">
                                 {isLoading ? (
                                    <RepeatContent count={8}>
                                       <UserCardBasicSkeleton />
                                    </RepeatContent>
                                 ) : (
                                    dataItems.items?.map(item => {
                                       const charsData = [
                                          {
                                             name: 'Строиться',
                                             value: item.building_houses ? `${declensionWordsHouse(item.building_houses)}` : 'Нет строящихся ЖК',
                                             className: 'w-[195px]',
                                          },
                                          {
                                             name: 'Сдано',
                                             value: item.ready_houses ? `${declensionWordsHouse(item.ready_houses)}` : 'Нет сданных ЖК',
                                             className: 'w-[180px]',
                                          },
                                       ];
                                       return (
                                          <UserCardBasic
                                             key={item.id}
                                             data={item}
                                             charsData={charsData}
                                             onClickMessage={async () => {
                                                await navigateToChat({ organization_id: item.id });
                                             }}
                                             href={`${RoutesPath.developers.inner}${item.id}?city=${watchedValues.city?.label || currentCity.name}`}
                                          />
                                       );
                                    })
                                 )}
                              </div>
                              <PaginationPage
                                 className="mt-8 px-8"
                                 currentPage={currentPage}
                                 setCurrentPage={value => setCurrentPage(value)}
                                 total={dataItems.pages}
                              />
                           </>
                        ) : (
                           <EmptyBlock block={false} />
                        )}
                     </div>
                     {isDesktop && (
                        <Sidebar>
                           <SidebarNavElements activeObj={{ name: 'developers', count: dataItems.total }} />
                        </Sidebar>
                     )}
                  </BodyAndSidebar>
               </div>
            </div>
         </main>
      </MainLayout>
   );
};

export default DevelopersList;
