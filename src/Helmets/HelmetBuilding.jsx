import React from 'react';
import { Helmet } from 'react-helmet';

const HelmetBuilding = ({ data }) => {
   return (
      <Helmet>
         <title>{data.title||''}</title>
         <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
         <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
      </Helmet>
   );
};

export default HelmetBuilding;
