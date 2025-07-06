import React from 'react';
import { Helmet } from 'react-helmet';

const HelmetHome = () => {
   return (
      <Helmet>
         <title>Главная</title>
         <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
         <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
      </Helmet>
   );
};

export default HelmetHome;
