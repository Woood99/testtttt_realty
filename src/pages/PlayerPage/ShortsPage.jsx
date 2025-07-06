import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDataRequest } from '../../api/requestsApi';
import Spinner from '../../ui/Spinner';
import { Helmet } from 'react-helmet';
import { Shorts } from '../../ModalsMain/VideoModal';
import LOGO from '../../assets/svg/logo.svg';

const ShortsPage = () => {
   const params = useParams();
   const [data, setData] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      getDataRequest(`/api/video/${params.id}`)
         .then(res => {
            setData([res.data]);
         })
         .finally(() => {
            setIsLoading(false);
         });
   }, []);

   return (
      <>
         <Helmet>
            <title>Смотреть Shorts</title>
            <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
            <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
         </Helmet>
         <div className="site-container">
            <main className="main !px-8 !pt-8 flex flex-col">
               <div>
                  <img src={LOGO} width={120} alt="inrut" />
                  {!isLoading ? (
                     <div>{data ? <Shorts data={data} single /> : '404'}</div>
                  ) : (
                     <div className="w-full flex-grow flex items-center justify-center">
                        <Spinner className="!w-[80px] !h-[80px]" />
                     </div>
                  )}
               </div>
            </main>
         </div>
      </>
   );
};

export default ShortsPage;
