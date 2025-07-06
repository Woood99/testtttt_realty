import React, { useEffect, useRef, useState } from 'react';

import styles from './LoginPhone.module.scss';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput, ControllerFieldInputPhone } from '../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../uiForm/Button';
import { useCookies } from 'react-cookie';
import { sendPostRequest } from '../../api/requestsApi';
import { AuthRoutesPath, PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import { COOKIE_MAX_AGE } from '../../constants/general';
import { CountdownTimerDefault } from '../../components/CountdownTimer';
import Modal from '../../ui/Modal';
import MainLayout from '../../layouts/MainLayout';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import { useLogout } from '../../api/useLogout';
import { useUserAuth } from '../../unifComponents/Provider/useUserAuth';
import { IconCall } from '../../ui/Icons';
import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';

const LoginPhoneLayout = ({ onSubmitLoginPhone = () => {} }) => {
   const [cookies, setCookie, removeCookie] = useCookies();

   const {
      handleSubmit,
      control,
      formState: { errors },
      setError,
      setValue,
      watch,
   } = useForm();

   const [codeContinue, setCodeContinue] = useState(false);
   const [currentPhone, setCurrentPhone] = useState('');
   const [visibleAdditional, setVisibleAdditional] = useState(false);

   const watchCode = watch('code');

   const { setAuthUser } = useUserAuth();
   const { logout } = useLogout();

   const refInputCode = useRef(null);
   const refInputPhone = useRef(null);

   const setTextError = code => {
      if (code === 401) {
         setError('code', {
            type: 'manual',
            message: 'Неверный код. Попробуйте ещё раз',
         });
      }
      if (code === 429) {
         setError('code', {
            type: 'manual',
            message: 'Превышено количество попыток ввода, повторите позже',
         });
      }
   };

   const onSubmitPhone = async data => {
      if (cookies.loggedIn) {
         await logout();
      }

      sendPostRequest('/api/login/phone', { phone: data.phone })
         .then(res => {
            if (!res.data.continue) return;
            setCodeContinue(true);
            setCurrentPhone(data.phone);

            setTimeout(() => {
               if (refInputCode.current?.inputElement) {
                  refInputCode.current.inputElement.focus();
                  refInputCode.current.inputElement.setSelectionRange(0, 0);
               }
            }, 100);
         })
         .catch(error => {
            const errorMesage = JSON.parse(error.request.response).message;

            if (errorMesage === 'direction not allowed') {
               setError('phone', {
                  type: 'manual',
                  message: 'Произошла ошибка, проверьте номер телефона или попробуйте позже',
               });
            }
            if (errorMesage === 'Too many requests for one phone in hour') {
               setError('phone', {
                  type: 'manual',
                  message: 'Вы превысили попытки ввода за час, попробуйте позже',
               });
            }
            if (errorMesage === 'Too many requests for one phone in 24 hours') {
               setError('phone', {
                  type: 'manual',
                  message: 'Вы превысили попытки ввода за 24 часа.',
               });
            }
         });
   };

   const onSubmitCode = data => {
      if (data.code.length !== 4) return;

      const resData = {
         phone: currentPhone,
         code: data.code,
      };

      sendPostRequest('/api/login/phone', { ...resData })
         .then(res => {
            if (res.data.continue) return;
            setCodeContinue(false);

            setCookie('loggedIn', true, { maxAge: COOKIE_MAX_AGE, path: '/' });
            setCookie('access_token', res.data.result, { maxAge: COOKIE_MAX_AGE, path: '/' });
            setAuthUser().then(user => {
               onSubmitLoginPhone(user);
            });
         })
         .catch(error => {
            const statusCode = error.message.split(' ').pop();
            setTextError(+statusCode);
         });
   };

   const onChangePhone = () => {
      setValue('code', '');
      setCodeContinue(false);
      setVisibleAdditional(false);
      setCurrentPhone('');
   };

   useEffect(() => {
      if (watchCode && watchCode.length >= 4) {
         handleSubmit(onSubmitCode)();
      }
   }, [watchCode]);

   useEffect(() => {
      setTimeout(() => {
         if (refInputPhone.current?.inputElement) {
            refInputPhone.current.inputElement.focus();
            refInputPhone.current.inputElement.setSelectionRange(4, 4);
         }
      }, 100);
   }, []);

   return (
      <>
         {!codeContinue && !currentPhone ? (
            <form onSubmit={handleSubmit(onSubmitPhone)}>
               <div className="mb-6">
                  <h2 className="title-2 mb-3">Введите номер телефона</h2>
                  <p className="text-defaultMax">Вам поступит бесплатный звонок.</p>
                  <p className="mt-0.5 text-defaultMax">Отвечать на звонок не нужно.</p>
               </div>
               <ControllerFieldInputPhone control={control} errors={errors} size="60" refInput={refInputPhone} />
               <Button size="Big" className="w-full mt-4">
                  Получить код
               </Button>
            </form>
         ) : (
            <form onSubmit={handleSubmit(onSubmitCode)}>
               <div className="mb-6">
                  <div className="mb-4 bg-pageColor rounded-xl p-5 flex gap-6">
                     <div className="bg-white flex-center-all relative w-10 h-10 rounded-xl flex-shrink-0">
                        <IconCall width={24} height={24} className="fill-blue" />
                        <div className="voicecall-animation">
                           <span className="voicecall-animation-item" />
                           <span className="voicecall-animation-item" />
                           <span className="voicecall-animation-item" />
                           <span className="voicecall-animation-item" />
                        </div>
                     </div>
                     <h2 className="title-3-5">
                        Вам звонит робот. <br /> Введите последние 4 цифры входящего номера.
                     </h2>
                  </div>
                  <p>
                     <span className="mr-2">Например +7 XXX XXX</span>
                     <span className={styles.LoginPhoneDecorNumber}>12 34</span>
                  </p>
                  <p className="mt-2">Отвечать на звонок не нужно</p>
                  <div className="mt-6 flex items-center gap-4">
                     <p>
                        Уже звоним на <span className="text-dark font-medium">{formatPhoneNumber(currentPhone)}</span>
                     </p>
                     {visibleAdditional && (
                        <button type="button" className="blue-link" onClick={onChangePhone}>
                           Изменить
                        </button>
                     )}
                  </div>
               </div>
               <ControllerFieldInput
                  name="code"
                  control={control}
                  errors={errors}
                  size="60"
                  mask="numbers4"
                  variant="Code"
                  maxLength={5}
                  refInput={refInputCode}
               />
               <Button
                  className="mt-2 w-full"
                  disabled={!visibleAdditional}
                  type="button"
                  variant="secondary"
                  onClick={() => {
                     if (visibleAdditional) {
                        handleSubmit(onSubmitPhone)();
                        setVisibleAdditional(false);
                     }
                  }}>
                  {!visibleAdditional ? (
                     <>
                        Отправить повторно через&nbsp;
                        <CountdownTimerDefault initialTime={25} onComplete={() => setVisibleAdditional(true)} />
                        &nbsp;сек.
                     </>
                  ) : (
                     'Получить новый код'
                  )}
               </Button>

               {/* {!visibleAdditional ? (
                  <div className="mt-2">
                     Отправить повторно через&nbsp;
                     <CountdownTimerDefault initialTime={25} onComplete={() => setVisibleAdditional(true)} />
                     &nbsp;сек.
                  </div>
               ) : (
                  <Button
                     type="button"
                     className="blue-link mt-2"
                     onClick={() => {
                        handleSubmit(onSubmitPhone)();
                        setVisibleAdditional(false);
                     }}>
                     Получить новый код
                  </Button>
               )} */}
            </form>
         )}
      </>
   );
};

export const LoginPhone = () => {
   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Вход по номеру телефона</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <Header />
         <main className="main">
            <div className="main-wrapper flex flex-col">
               <div className="white-block !py-16 flex-grow">
                  <div className="max-w-[505px] m-auto">
                     <LoginPhoneLayout
                        onSubmitLoginPhone={user => {
                           const role = user.role.id;
                           if (role === ROLE_BUYER.id) window.location.href = RoutesPath.home;
                           if (role === ROLE_SELLER.id) window.location.href = AuthRoutesPath.profile.edit;
                           if (role === ROLE_ADMIN.id) window.location.href = PrivateRoutesPath.dashboardAdmin;
                        }}
                     />
                  </div>
               </div>
            </div>
         </main>
      </MainLayout>
   );
};

export const LoginPhoneModal = ({ condition, set }) => {
   return (
      <Modal
         options={{
            overlayClassNames: '_right',
            modalClassNames: '!w-[440px]',
            modalContentClassNames: '!px-10 !pt-[115px]',
         }}
         condition={condition}
         set={set}>
         <LoginPhoneLayout
            onSubmitLoginPhone={user => {
               set(false);
               const role = user.role.id;
               if (role === ROLE_BUYER.id) return;
               if (role === ROLE_SELLER.id) window.location.href = AuthRoutesPath.profile.edit;
               if (role === ROLE_ADMIN.id) window.location.href = PrivateRoutesPath.dashboardAdmin;
            }}
         />
      </Modal>
   );
};
