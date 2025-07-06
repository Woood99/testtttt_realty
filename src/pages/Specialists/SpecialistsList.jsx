import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Button from '../../uiForm/Button';
import { PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import PaginationPage from '../../components/Pagination';
import { declensionWordsYear } from '../../helpers/declensionWords';
import MainLayout from '../../layouts/MainLayout';
import HeaderAdmin from '../../components/Header/HeaderAdmin';
import Header from '../../components/Header';
import SpecialistsListFilters from './SpecialistsListFilters';
import EmptyBlock from '../../components/EmptyBlock';
import { checkAuthUser, getCitiesValuesSelector, getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import Sidebar from '../../components/Sidebar';
import { SidebarNavElements } from '../../components/SidebarNav';
import BodyAndSidebar from '../../components/BodyAndSidebar';
import { checkDialogId, getUrlNavigateToChatDialog, getUrlNavigateToChatDialogFake } from '../../api/getDialogId';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';
import { UserCardBasic, UserCardBasicSkeleton } from '../../ui/CardsRow';
import RepeatContent from '../../components/RepeatContent';
import { useSpecialistsList } from './useSpecialistsList';
import { isAdmin } from '../../helpers/utils';
import { CHAT_TYPES } from '../../components/Chat/constants';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';
import { getDataRequest } from '../../api/requestsApi';
import { useCookies } from 'react-cookie';
import { COOKIE_MAX_AGE } from '../../constants/general';
import { useUserAuth } from '../../unifComponents/Provider/useUserAuth';

const SpecialistsList = () => {
   const [cookies, setCookie, removeCookie] = useCookies();

   const isDesktop = useSelector(getIsDesktop);
   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);
   const citiesData = useSelector(getCitiesValuesSelector);
   const dispatch = useDispatch();
   const { control, reset, setValue, currentCity, isLoading, dataItems, currentPage, setCurrentPage, titleText } = useSpecialistsList();
   const { setAuthUser } = useUserAuth();

   const navigateToChat = useNavigateToChat();

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
                  <SpecialistsListFilters currentCity={currentCity} control={control} reset={reset} citiesData={citiesData} setValue={setValue} />
               )}
            </HeaderAdmin>
         ) : (
            <Header>
               {!isDesktop && (
                  <SpecialistsListFilters currentCity={currentCity} control={control} reset={reset} citiesData={citiesData} setValue={setValue} />
               )}
            </Header>
         )}
         <main className="main main-headerForm">
            {isDesktop && (
               <SpecialistsListFilters currentCity={currentCity} control={control} reset={reset} citiesData={citiesData} setValue={setValue} />
            )}

            <div className="main-wrapper--title">
               <div className="container-desktop">
                  <div className="flex justify-between gap-4 mb-6 md1:mx-4">
                     <h1 className="title-1">{titleText}</h1>
                     {userIsAdmin && (
                        <div className="flex items-center justify-between">
                           <Link to={PrivateRoutesPath.specialists.create} target="_blank" rel="noopener noreferrer">
                              <Button size="Small" Selector="div">
                                 Создать менеджера
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
                                             name: 'Стаж',
                                             value: declensionWordsYear(item.experience),
                                             className: 'w-[185px]',
                                          },
                                          {
                                             name: 'В работе',
                                             value: `${item.objects_count} ЖК`,
                                             className: 'w-[185px]',
                                          },
                                       ];

                                       return (
                                          <UserCardBasic
                                             key={item.id}
                                             data={item}
                                             charsData={charsData}
                                             onClickMessage={async () => {
                                                await navigateToChat({ recipients_id: [item.id] });
                                             }}
                                             href={`${RoutesPath.specialists.inner}${item.id}`}
                                             onClickloginAs={
                                                userIsAdmin
                                                   ? async () => {
                                                        const {
                                                           data: { result },
                                                        } = await getDataRequest(`/admin-api/impersonation/start/${item.id}`);

                                                        setCookie('loggedIn', true, { maxAge: COOKIE_MAX_AGE, path: '/' });
                                                        setCookie('access_token', result, { maxAge: COOKIE_MAX_AGE, path: '/' });
                                                        setCookie('login_as_admin', true, { maxAge: COOKIE_MAX_AGE, path: '/' });
                                                        setAuthUser();
                                                     }
                                                   : null
                                             }
                                          />
                                       );
                                    })
                                 )}
                              </div>
                              <PaginationPage
                                 className="mt-8"
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
                           <SidebarNavElements activeObj={{ name: 'specialists', count: dataItems.total }} />
                        </Sidebar>
                     )}
                  </BodyAndSidebar>
               </div>
            </div>
         </main>
      </MainLayout>
   );
};

export default SpecialistsList;
