import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import WalletHistory from './WalletHistory';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/helpers/selectors';
import WalletInfoBuyer from './WalletInfo';

const WalletPage = () => {
   const userInfo = useSelector(getUserInfo);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Кошелёк</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <Header />
         <main className="main">
            <div className="main-wrapper--title">
               <div className="container-desktop">
                  <h2 className="title-2 mb-3 md1:px-4">Кошелёк</h2>
                  <WalletInfoBuyer points={0} summ={0} userInfo={userInfo} />
                  <WalletHistory className="white-block-small mt-3" />
               </div>
            </div>
         </main>
      </MainLayout>
   );
};

export default WalletPage;

{
   /* <div className="white-block-small">
   <div className="grid grid-cols-3 gap-3">
      <div className="bg-primary700 rounded-[20px] p-5">
         <h3 className="title-3">1 балл = 0.8 рублей</h3>
      </div>
      <div className="bg-primary700 rounded-[20px] p-5">
         <h3 className="title-3">
            Баллами можно оплатить услуги <br /> (ипотеку, юр. услуги и тд.) или обменять на рубли
         </h3>
      </div>
      <div className="bg-primary700 rounded-[20px] p-5">
         <h3 className="title-3">
            Возвращаем 10% <br />
            от затрат баллами
         </h3>
      </div>
   </div>
</div>; */
}
