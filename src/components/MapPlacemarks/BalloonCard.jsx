import cn from 'classnames';

import styles from './MapPlacemarks.module.scss';

import convertSum from '../../helpers/convertSum';
import { CharsFlat } from '../../ui/Chars';
import getSrcImage from '../../helpers/getSrcImage';
import { useEffect, useState } from 'react';

export const BalloonCard = ({ data }) => {
   return (
      <div className={styles.TooltipCardRoot}>
         <div className="ibg pb-[64%]">
            <img src={getSrcImage(data.images?.[0] || '')} className="w-full rounded-md" width="150" height="145" alt={data.title} />
         </div>
         <h3 className={`${styles.TooltipCardTitle} title-4`}>{data.title}</h3>
         <div className="flex flex-col gap-2">
            {data.apartments.map((item, index) => (
               <CharsFlat key={index}>
                  <div className="flex gap-2">
                     <span>{item.rooms === 0 ? 'Студии' : `${item.rooms}-комн`}</span>
                     <span className="!font-normal">от {item.min_area} м²</span>
                  </div>
                  <span>от {convertSum(item.bd_price || item.price)} ₽</span>
               </CharsFlat>
            ))}
         </div>
      </div>
   );
};

export const BalloonCardSmall = ({ data, complexGeo = [], currentBuilding = null }) => {
   const [info, setInfo] = useState(null);

   useEffect(() => {
      const multiRouteModel = new ymaps.multiRouter.MultiRouteModel([data.geo, complexGeo], {
         routingMode: 'pedestrian',
      });

      const multiRoute = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
         boundsAutoApply: true,
      });

      multiRouteModel.events.add('requestsuccess', function () {
         const route = multiRoute.getActiveRoute();
         if (route) {
            setInfo({
               distance: route.properties.get('distance').text,
               time: route.properties.get('duration').text,
            });
         }
      });
   }, []);

   return (
      <div className={`${styles.TooltipCardSmallRoot} !block`}>
         <div className="flex gap-4">
            <div className={styles.TooltipCardImage}>
               <img src={getSrcImage(data.images?.[0] || '')} className="w-full rounded-md" width="150" height="145" alt={data.title} />
            </div>
            <div className="flex-grow">
               <h3 className={`${styles.TooltipCardTitle} title-4 !mb-1`}>{data.title}</h3>
               <div className="flex flex-col gap-2 mt-2">
                  {data.apartments.map((item, index) => (
                     <CharsFlat key={index}>
                        <div className="flex gap-2">
                           <span>{item.rooms === 0 ? 'Студии' : `${item.rooms}-комн`}</span>
                           <span className="!font-normal">от {item.min_area} м²</span>
                        </div>
                        <span>от {convertSum(item.bd_price || item.price)} ₽</span>
                     </CharsFlat>
                  ))}
               </div>
            </div>
         </div>
         <div className="mt-2">
            <div className="text-small">
               {Boolean(info && currentBuilding) && (
                  <p>
                     от {currentBuilding.title} до {data.title} <span className="font-medium">пешком {info.distance}</span>
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};

export const BalloonTooltipInfo = ({ data, complexGeo = [] }) => {
   const [info, setInfo] = useState(null);

   useEffect(() => {
      const multiRouteModel = new ymaps.multiRouter.MultiRouteModel([data.geo, complexGeo], {
         routingMode: 'pedestrian',
      });

      const multiRoute = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
         boundsAutoApply: true,
      });

      multiRouteModel.events.add('requestsuccess', function () {
         const route = multiRoute.getActiveRoute();
         if (route) {
            setInfo({
               distance: route.properties.get('distance').text,
               time: route.properties.get('duration').text,
            });
         }
      });
   }, []);

   return (
      <div className={styles.TooltipCardInfoRoot}>
         <div className="flex-grow overflow-hidden">
            <h3 className="cut-one title-3-5 mb-0.5">{data.name}</h3>
            <h3 className="cut-one text-primary400 text-small mb-2">{data.address}</h3>
            <div className="cut-one text-small">
               {Boolean(info) && (
                  <p>
                     {info.time} пешком {info.distance}
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};
