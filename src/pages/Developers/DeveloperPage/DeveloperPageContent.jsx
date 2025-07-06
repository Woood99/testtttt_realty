import React, { useContext, useEffect, useState } from 'react';

import { BlockCardsPrimaryContext, DeveloperPageContext } from '../../../context';
import { FeedBlockPrimary, FeedContentPrimary } from '../../../components/Ribbon';
import { getDataRequest } from '../../../api/requestsApi';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../../constants/RoutesPath';
import BlockCardsPrimary from '../../../components/BlockCardsPrimary';
import Button from '../../../uiForm/Button';
import MapPlacemarks from '../../../components/MapPlacemarks/MapPlacemarks';
import Specialist from '../../../ui/Specialist';
import { getDialogId, getUrlNavigateToChatDialog } from '../../../api/getDialogId';
import { CHAT_TYPES } from '../../../components/Chat/constants';
import { useNavigateToChat } from '../../../hooks/useNavigateToChat';

export const DeveloperPageContent = () => {
   const {
      data,
      tabActiveValue,
      setTabActiveValue,
      setObjectsOptions,
      objectsOptions,
      citiesItems,
      paramsString,
      isFullscreenMap,
      setIsFullscreenMap,
      specialistsData,
   } = useContext(DeveloperPageContext);

   const navigateToChat = useNavigateToChat();

   const [newData, setNewData] = useState([]);

   useEffect(() => {
      const videosData = data.tabsData.find(item => item.valueName === 'videos');
      const shortsData = data.tabsData.find(item => item.valueName === 'shorts');

      const fetch = async () => {
         const videosCards = videosData?.data.length ? await getDataRequest(`/api/video-url`, { url: videosData.data }).then(res => res.data) : [];
         const shortsCards = shortsData?.data.length ? await getDataRequest(`/api/video-url`, { url: shortsData.data }).then(res => res.data) : [];

         setNewData(
            data.tabsData.map(item => {
               if (item.valueName === 'objects' || item.valueName === 'specialists') return item;
               const dataFeed = item.valueName === 'videos' ? videosCards : item.valueName === 'shorts' ? shortsCards : item.data;
               return {
                  ...item,
                  body: <FeedContentPrimary data={dataFeed} type={item.valueName} />,
               };
            })
         );
      };
      fetch();
   }, [data.tabsData]);

   const currentDataTab = newData[tabActiveValue];
   if (!currentDataTab) return;

   if (currentDataTab.valueName === 'all') {
      return (
         <FeedBlockPrimary
            data={[
               ...data.objects.map(item => ({ id: item, type: 'object' })),
               ...specialistsData.map(item => ({ ...item, type: 'specialist' })),
               ...currentDataTab.data.videos.map(item => ({ link: item, type: 'video' })),
               ...currentDataTab.data.shorts.map(item => ({ link: item, type: 'short' })),
               ...currentDataTab.data.stocks.map(item => ({ ...item, type: 'stock' })),
               ...currentDataTab.data.calculations.map(item => ({ ...item, type: 'calculation' })),
               ...currentDataTab.data.news.map(item => ({ ...item, type: 'news' })),
            ]}
            onClickShowAll={index => {
               setTabActiveValue(index + 1);
            }}
         />
      );
   }
   if (currentDataTab.valueName === 'objects') {
      return (
         <div>
            {objectsOptions.mapData && (
               <div className="white-block mb-2">
                  <MapPlacemarks
                     coordinates={objectsOptions.mapData.coordinates}
                     zoom={9}
                     currentCityId={citiesItems && paramsString.city ? citiesItems.find(item => item.name === paramsString.city)?.id : data.cities[0]}
                     className="!h-[284px]"
                     sale={objectsOptions.mapData.placemarks.map(item => {
                        return {
                           id: item.id,
                           geo: item.coordinates,
                           minPrice: item.minBdPrice || item.minPrice,
                        };
                     })}
                     isFullscreen={isFullscreenMap}
                     setIsFullscreen={setIsFullscreenMap}
                  />
               </div>
            )}
            <div className="white-block">
               <h2 className="title-2-5 mb-4">Объекты застройщика</h2>

               <BlockCardsPrimaryContext.Provider
                  value={{
                     data,
                     setOptions: setObjectsOptions,
                     options: objectsOptions,
                     title: '',
                     EmptyBlockContent: (
                        <>
                           <h3 className="title-3 mt-4">У этого застройщика пока нету объектов</h3>
                           <Link to={RoutesPath.developers.list}>
                              <Button className="mt-6">К списку застройщиков</Button>
                           </Link>
                        </>
                     ),
                  }}>
                  <div ref={objectsOptions.ref}>
                     <BlockCardsPrimary />
                  </div>
               </BlockCardsPrimaryContext.Provider>
            </div>
         </div>
      );
   }
   if (currentDataTab.valueName === 'specialists') {
      return (
         <div className="white-block">
            <h2 className="title-2-5 mb-4">Менеджеры отдела продаж</h2>
            <div className="grid grid-cols-4 gap-x-3 gap-y-10 md2:grid-cols-3 md3:grid-cols-2">
               {currentDataTab.data.map(item => {
                  return (
                     <Specialist
                        key={item.id}
                        {...item}
                        link
                        visibleChat
                        onClickChat={async () => {
                           await navigateToChat({ recipients_id: [item.id] });
                        }}
                     />
                  );
               })}
            </div>
         </div>
      );
   }

   return <div className="white-block">{currentDataTab.body}</div>;
};
