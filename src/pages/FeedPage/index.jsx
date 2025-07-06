import React, { useEffect, useState } from 'react';
import { FeedBlock } from '../../components/Ribbon';
import Header from '../../components/Header';
import MainLayout from '../../layouts/MainLayout';
import { Helmet } from 'react-helmet';
import { useQueryParams } from '../../hooks/useQueryParams';
import { getBuilding } from '../../api/getBuilding';
import { combinedArray } from '../../helpers/arrayMethods';
import BodyAndSidebar from '../../components/BodyAndSidebar';
import Sidebar from '../../components/Sidebar';
import { getSpecialists } from '../../api/Building/getSpecialists';
import { ExternalLink } from '../../ui/ExternalLink';
import Avatar from '../../ui/Avatar';
import { getShortNameSurname } from '../../helpers/changeString';
import { RoutesPath } from '../../constants/RoutesPath';
import ComplexCardInfo from '../../ui/ComplexCardInfo';

const FeedPage = () => {
   const params = useQueryParams();

   const [data, setData] = useState({});
   const [isLoadingData, setIsLoadingData] = useState(true);
   const [specialistsData, setSpecialistsData] = useState([]);

   useEffect(() => {
      if (params.complex) {
         getBuilding(params.complex).then(res => {
            setData({
               ...res,
               feed: combinedArray(
                  res.stock.map(item => ({
                     ...item,
                     type: 'stock',
                  })),
                  res.calculations.map(item => ({
                     ...item,
                     type: 'calculation',
                  })),
                  res.news.map(item => ({
                     ...item,
                     type: 'news',
                  })),
                  res.videos.map(item => ({
                     link: item,
                     type: 'video',
                  })),
                  res.shorts.map(item => ({
                     link: item,
                     type: 'short',
                  }))
               ),
            });
            setIsLoadingData(false);
         });
         getSpecialists(params.complex).then(res => setSpecialistsData(res));
      }
   }, []);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Лента</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <Header maxWidth={972} />
         <main className="main">
            <div className="main-wrapper">
               <div className="container-desktop mmd1:!max-w-[972px]">
                  {Boolean(params.complex) && (
                     <div className="mb-3">{data && <ComplexCardInfo data={data} specialists={specialistsData} loading={isLoadingData} />}</div>
                  )}
                  <BodyAndSidebar className="!grid-cols-[615px_1fr]">
                     <div className="flex flex-col gap-3 min-w-0">
                        <div className="white-block !p-5">
                           <FeedBlock data={data.feed} emptyText="" isLoadingData={isLoadingData} />
                        </div>
                     </div>
                     <Sidebar>
                        <div className="white-block-small !p-5">
                           <h3 className="title-4">
                              Менеджеры отдела продаж
                              <span className="ml-2 text-primary400 font-medium">{specialistsData.length}</span>
                           </h3>
                           {Boolean(specialistsData.length) && (
                              <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
                                 {specialistsData.map(item => {
                                    return (
                                       <ExternalLink
                                          to={`${RoutesPath.specialists.inner}${item.id}`}
                                          className="flex flex-col items-stretch"
                                          key={item.id}>
                                          <Avatar src={item.avatar} className="mx-auto" size={64} title={item.name} />
                                          <p className="mt-1 cut-one text-small">{getShortNameSurname(item.name, item.surname)}</p>
                                       </ExternalLink>
                                    );
                                 })}
                              </div>
                           )}
                        </div>
                     </Sidebar>
                  </BodyAndSidebar>
               </div>
            </div>
         </main>
      </MainLayout>
   );
};

export default FeedPage;
