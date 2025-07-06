import React, { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet';

import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../helpers/photosRefact';
import { sendPostRequest } from '../../api/requestsApi';
import ProfileEditForm from './ProfileEditForm';
import { ProfileEditContext } from '../../context';
import getSrcImage from '../../helpers/getSrcImage';
import { BASE_URL } from '../../constants/api';
import { useCookies } from 'react-cookie';
import { RoutesPath } from '../../constants/RoutesPath';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { getUserInfo } from '../../redux/helpers/selectors';
import { useLogout } from '../../api/useLogout';

const ProfileEdit = () => {
   const [cookies, setCookie, removeCookie] = useCookies();
   const [data, setData] = useState(null);
   const userInfo = useSelector(getUserInfo);

   const [photo, setPhoto] = useState(null);
   const { logout } = useLogout();

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;
      setData(userInfo);

      if (userInfo.image) {
         setPhoto({ id: 1, image: getSrcImage(userInfo.image) });
      }
   }, [userInfo]);

   const onSubmitHandler = currentData => {
      const resData = {
         ...currentData,
         photo: photo ? [photo] : null,
         phone: currentData.phone.slice(1),
         email: currentData.email || userInfo.email,
      };

      const formData = new FormData();

      if (resData.photo) {
         resData.photo = refactPhotoStageOne(resData.photo);
         refactPhotoStageAppend(resData.photo, formData);
         resData.photo = refactPhotoStageTwo(resData.photo);
         resData.photo = resData.photo[0];

         if (!resData.photo.new_image) {
            resData.photo.image = resData.photo.image.replace(BASE_URL, '');
         }
      } else {
         resData.photo = null;
      }

      formData.append('data', JSON.stringify(resData));

      sendPostRequest('/api/profile/edit', formData, { 'Content-Type': 'multipart/form-data' }).then(res => {
         window.location.reload();
      });
   };

   const onClickLogout = () => {
      logout().then(() => {
         setTimeout(() => {
            if (window.location.pathname !== RoutesPath.loginPhone) {
               window.location.href = RoutesPath.home;
            }
         }, 100);
      });
   };

   if (!data) return;

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Личный кабинет</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <ProfileEditContext.Provider value={{ data, photo, setPhoto, onSubmitHandler, onClickLogout }}>
            <Header />
            <main className="main">
               <div className="main-wrapper">
                  <div className="container-desktop">{data && <ProfileEditForm />}</div>
               </div>
            </main>
         </ProfileEditContext.Provider>
      </MainLayout>
   );
};

export default ProfileEdit;
