import React from 'react';
import { Helmet } from 'react-helmet';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import SuggestionsProvider from '../../components/Suggestions/SuggestionsProvider';
import { suggestionsTypes } from '../../components/Suggestions/suggestions-types';
import SuggestionsObjects from '../../components/Suggestions/SuggestionsObjects';

const MyViewBuyer = () => {
   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Записи на просмотр</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <SuggestionsProvider suggestions_type={suggestionsTypes.buyerAll}>
            <Header />
            <main className="main">
               <div className="main-wrapper">
                  <div className="container-desktop">
                     <SuggestionsObjects />
                  </div>
               </div>
            </main>
         </SuggestionsProvider>
      </MainLayout>
   );
};

export default MyViewBuyer;
