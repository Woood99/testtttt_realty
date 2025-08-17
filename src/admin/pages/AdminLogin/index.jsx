import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../uiForm/Button';
import { sendPostRequest } from '../../../api/requestsApi';
import { PrivateRoutesPath, RoutesPath, SellerRoutesPath } from '../../../constants/RoutesPath';
import { NotificationTimer } from '../../../ui/Tooltip';
import { COOKIE_MAX_AGE } from '../../../constants/general';
import { ROLE_ADMIN, ROLE_SELLER } from '../../../constants/roles';
import { useAuth } from '@/hooks';
import { toggleNotificationLogout, getHelpSliceSelector, getUserInfo } from '@/redux';

const AdminLogin = () => {
   const [cookies, setCookie] = useCookies();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { handleSubmit, control } = useForm();
   const [isLoadingHandler, setIsLoadingHandler] = useState(false);

   const userInfo = useSelector(getUserInfo);
   const { notificationLogout } = useSelector(getHelpSliceSelector);

   const { setAuthUser, userConnectionEcho, logout } = useAuth();

   const [showNotification, setShowNotification] = useState(false);

   useEffect(() => {
      if (cookies.loggedIn && userInfo.role?.id === ROLE_ADMIN.id) {
         navigate(PrivateRoutesPath.dashboardAdmin);
      }
   }, [userInfo]);

   const onSubmitHandler = async data => {
      setIsLoadingHandler(true);
      if (cookies.loggedIn) {
         await logout();
      }
      console.log(data);

      await sendPostRequest('/api/login', { ...data })
         .then(res => {
            const token = res.data.result;
            setCookie('loggedIn', true, { maxAge: COOKIE_MAX_AGE, path: '/' });
            setCookie('access_token', token, { maxAge: COOKIE_MAX_AGE, path: '/' });
            setAuthUser().then(async user => {
               await new Promise(resolve => setTimeout(resolve, 100));
               userConnectionEcho(user, res.data.result);

               const roleId = user.role.id;
               if (roleId === ROLE_ADMIN.id) {
                  navigate(PrivateRoutesPath.dashboardAdmin);
               } else if (roleId === ROLE_SELLER.id) {
                  navigate(SellerRoutesPath.object.list);
               } else {
                  navigate(RoutesPath.home);
               }
               setIsLoadingHandler(false);
            });
         })
         .catch(error => {
            console.log(error);
            setShowNotification(error.response.data.result);
         });
   };

   return (
      <div className="site-container">
         <Helmet>
            <title>Вход в аккаунт</title>
            <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
            <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
         </Helmet>
         <main className="main">
            <div className="main-wrapper--title">
               <div className="container">
                  <h2 className="title-2 mb-6">Вход в аккаунт</h2>
                  <form onSubmit={handleSubmit(onSubmitHandler)} className="white-block">
                     <div className="max-w-[400px] flex flex-col gap-4 m-auto my-2">
                        <ControllerFieldInput control={control} requiredValue beforeText="Email" name="email" size="48" />
                        <ControllerFieldInput control={control} requiredValue beforeText="Пароль" name="password" size="48" type="password" />
                        <Button className="w-full" isLoading={isLoadingHandler}>
                           Войти
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         </main>

         {notificationLogout &&
            createPortal(
               <NotificationTimer show={notificationLogout} onClose={() => dispatch(toggleNotificationLogout(false))} classListRoot="min-w-[300px]">
                  <h3 className="title-3 !text-white mt-2">Ваша сессия истекла.</h3>
                  <h4 className="mt-1 text-defaultMax font-medium !text-white">Чтобы продолжить, войдите в аккаунт заново</h4>
               </NotificationTimer>,
               document.getElementById('overlay-wrapper')
            )}
         {showNotification &&
            createPortal(
               <NotificationTimer
                  show={showNotification}
                  set={setShowNotification}
                  onClose={() => setShowNotification(false)}
                  classListRoot="min-w-[400px]">
                  <div className="font-medium text-defaultMax">
                     Произошла ошибка.&nbsp;
                     {showNotification.includes('not found') && <>Проверьте Email</>}
                     {showNotification.includes('not valid') && <>Проверьте пароль</>}
                  </div>
               </NotificationTimer>,
               document.getElementById('overlay-wrapper')
            )}
      </div>
   );
};

export default AdminLogin;
