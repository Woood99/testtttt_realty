import React, { useEffect, useState } from 'react';

import { IconEye, IconFavoriteStroke } from '../../../ui/Icons';
import { StatisticsBlock, StatisticsCol, StatisticsCols } from '../../../components/StatisticsBlock';
import { Chars } from '../../../ui/Chars';
import Button from '../../../uiForm/Button';
import SpecialOfferCreate from '../../../ModalsMain/SpecialOfferCreate';
import DetailedStatisticsModal from '../../../ModalsMain/DetailedStatisticsModal';
import { getDataRequest } from '../../../api/requestsApi';
import dayjs from 'dayjs';
import WebSkeleton from '../../../ui/Skeleton/WebSkeleton';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';

function transformDatedData(data) {
   const result = [];
   const dates = new Set();

   for (const key in data.building) {
      dates.add(key);
   }
   for (const key in data.apartments) {
      dates.add(key);
   }

   dates.forEach(date => {
      const buildingData = data.building[date] || {};
      const apartmentData = data.apartments[date] || {};

      const entry = {
         date: date,
         building_compare: buildingData.added_to_compare || 0,
         building_visited: buildingData.building_visited || 0,
         building_application: buildingData.application || 0,
         building_consultation: buildingData.consultation || 0,
         building_likes: buildingData.likes || 0,
         building_replied_to_special_offer: buildingData.replied_to_special_offer || 0,

         apartment_compare: apartmentData.added_to_compare || 0,
         apartment_visited: apartmentData.apartment_visited || 0,
         apartment_application: apartmentData.application || 0,
         apartment_consultation: apartmentData.consultation || 0,
         apartment_likes: apartmentData.likes || 0,
         apartment_replied_to_special_offer: apartmentData.replied_to_special_offer || 0,
      };

      result.push(entry);
   });

   return result.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function transformTotalData(data) {
   const { building, apartments } = data;
   const resultData = {
      building_compare: building.added_to_compare || 0,
      building_visited: building.building_visited || 0,
      building_application: building.application || 0,
      building_consultation: building.consultation || 0,
      building_likes: building.likes || 0,
      building_replied_to_special_offer: building.replied_to_special_offer || 0,

      apartment_compare: apartments.added_to_compare || 0,
      apartment_visited: apartments.apartment_visited || 0,
      apartment_application: apartments.application || 0,
      apartment_consultation: apartments.consultation || 0,
      apartment_likes: apartments.likes || 0,
      apartment_replied_to_special_offer: apartments.replied_to_special_offer || 0,
   };
   return resultData;
}

const StatisticsItem = ({ children, onClick = () => {} }) => {
   return (
      <li className="text-small grid grid-cols-[15px_30px_1fr] gap-3 group cursor-pointer" onClick={onClick}>
         {children}
      </li>
   );
};

const BuildingStatistics = ({ buildingData }) => {
   const [specialOfferModal, setSpecialOfferModal] = useState(false);
   const [detailedStatisticsModalOpen, setDetailedStatisticsModalOpen] = useState(false);

   const [metricsDataTotal, setMetricsDataTotal] = useState(null);
   const [metricsDataDated, setMetricsDataDated] = useState(null);

   useEffect(() => {
      // getDataRequest(`/building/${buildingData.id}/stats`).then(res => {
      // console.log({ ...res.data, object_created_data: getStringDate(new Date(res.data.object_created_data)) });
      // });

      getDataRequest(`/seller-api/expanded-metrics`, { type: 'total_metrics', building_id: buildingData.id }).then(res => {
         setMetricsDataTotal(transformTotalData(res.data));
      });

      getDataRequest(`/seller-api/expanded-metrics`, { type: 'dated_metrics', building_id: buildingData.id }).then(res => {
         setMetricsDataDated(transformDatedData(res.data));
      });
   }, []);

   return (
      <section className="white-block mb-3 grid grid-cols-[1fr_27%] gap-10">
         <div className="overflow-x-auto">
            <h2 className="title-2 mb-4">Статистика просмотров</h2>
            {metricsDataDated ? (
               <>
                  <StatisticsBlock height={250}>
                     <StatisticsCols
                        maxHeight="65"
                        data={metricsDataDated.map((item, index) => {
                           return {
                              value: item.building_visited || 0,
                              tooltipBody: (
                                 <div className="white-block-small min-w-[300px]">
                                    <p className="font-medium text-left mb-3">{dayjs(item.date).format('DD.MM.YYYY')}</p>
                                    <div className="flex flex-col gap-3">
                                       <Chars justifyBetween>
                                          <span className="text-left">Просмотров карточки ЖК</span>
                                          <span className="!font-medium">{item.building_visited}</span>
                                       </Chars>
                                       <Chars justifyBetween>
                                          <span className="text-left">Просмотров объектов ЖК</span>
                                          <span className="!font-medium">{item.apartment_visited}</span>
                                       </Chars>
                                       <Chars justifyBetween>
                                          <span className="text-left">Добавили в избранное</span>
                                          <span className="!font-medium">{item.building_likes + item.apartment_likes}</span>
                                       </Chars>
                                       <Chars justifyBetween>
                                          <span className="text-left">Добавили в сравнение</span>
                                          <span className="!font-medium">{item.building_compare + item.apartment_compare}</span>
                                       </Chars>
                                       <Chars justifyBetween>
                                          <span className="text-left">Записалось на просмотр</span>
                                          <span className="!font-medium">{item.building_application + item.apartment_application}</span>
                                       </Chars>
                                       <Chars justifyBetween>
                                          <span className="text-left">Заказали звонок</span>
                                          <span className="!font-medium">{item.building_consultation + item.apartment_consultation}</span>
                                       </Chars>
                                       <Chars justifyBetween>
                                          <span className="text-left">
                                             Откликнулись на рассылку <br /> спецпредложений
                                          </span>
                                          <span className="!font-medium">
                                             {item.building_replied_to_special_offer + item.apartment_replied_to_special_offer}
                                          </span>
                                       </Chars>
                                    </div>
                                 </div>
                              ),
                              body: <StatisticsCol key={index} value={item.building_visited} date={item.date} />,
                           };
                        })}
                     />
                  </StatisticsBlock>
                  <Button variant="secondary" className="mt-6 w-full" onClick={() => setSpecialOfferModal(true)}>
                     Рассылка спецпредложений
                  </Button>
               </>
            ) : (
               <>
                  <div className="flex items-end gap-4 min-h-[250px]">
                     <WebSkeleton className="w-[36px] min-h-[162.5px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[120px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[150px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[68px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[130px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[130px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[130px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[120px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[68px] rounded-lg" />
                     <WebSkeleton className="w-[36px] min-h-[150px] rounded-lg" />
                  </div>
                  <WebSkeleton className="h-[50px] min-w-[250px] mt-6 rounded-lg" />
               </>
            )}
         </div>
         <div className="flex flex-col">
            {metricsDataTotal ? (
               <>
                  <div className="bg-primary100 p-6 rounded-xl flex-grow mt-8 flex flex-col">
                     <h4 className="title-4 mb-4">Объект размещён {dayjs(buildingData.creation_at || '', 'DD.MM.YYYY').format('D MMMM YYYY г.')}</h4>
                     <ul className="flex flex-col gap-3">
                        <StatisticsItem onClick={() => setDetailedStatisticsModalOpen('building_visited')}>
                           <IconEye className="fill-blue" width={15} height={15} />
                           <span>{metricsDataTotal.building_visited} </span>
                           <span className='group-hover:text-blue'>Просмотров карточки ЖК</span>
                        </StatisticsItem>
                        <StatisticsItem onClick={() => setDetailedStatisticsModalOpen('apartment_visited')}>
                           <IconEye className="fill-blue" width={15} height={15} />
                           <span>{metricsDataTotal.apartment_visited || 0} </span>
                           <span className='group-hover:text-blue'>Просмотров объектов ЖК</span>
                        </StatisticsItem>
                        <StatisticsItem onClick={() => setDetailedStatisticsModalOpen('likes')}>
                           <IconFavoriteStroke className="fill-red" width={15} height={15} />
                           <span>{metricsDataTotal.building_likes + metricsDataTotal.apartment_likes} </span>
                           <span className='group-hover:text-blue'>Добавили в избранное</span>
                        </StatisticsItem>
                        <StatisticsItem onClick={() => setDetailedStatisticsModalOpen('added_to_compare')}>
                           <IconEye className="fill-dark" width={15} height={15} />
                           <span>{metricsDataTotal.building_compare + metricsDataTotal.apartment_compare} </span>
                           <span className='group-hover:text-blue'>Добавили в сравнение</span>
                        </StatisticsItem>
                        <StatisticsItem>
                           <IconEye className="fill-dark" width={15} height={15} />
                           <span>{metricsDataTotal.building_application + metricsDataTotal.apartment_application}</span>
                           <span>Записалось на просмотр</span>
                        </StatisticsItem>
                        <StatisticsItem>
                           <IconEye className="fill-dark" width={15} height={15} />
                           <span>{metricsDataTotal.building_consultation + metricsDataTotal.apartment_consultation}</span>
                           <span>Заказали звонок</span>
                        </StatisticsItem>
                        <StatisticsItem>
                           <IconEye className="fill-dark" width={15} height={15} />
                           <span>{metricsDataTotal.building_replied_to_special_offer + metricsDataTotal.apartment_replied_to_special_offer}</span>
                           <span>Откликнулись на рассылку спецпредложений</span>
                        </StatisticsItem>
                     </ul>
                     <div className="mt-auto flex justify-center">
                        <button className="blue-link" onClick={() => setDetailedStatisticsModalOpen(true)}>
                           Подробная статистика
                        </button>
                     </div>
                  </div>
               </>
            ) : (
               <div className="select-none h-full flex flex-col flex-grow">
                  <WebSkeleton className="w-full h-1/5 rounded-lg flex-grow" />
                  <WebSkeleton className="w-full h-[50px] mt-6 rounded-lg" />
               </div>
            )}
         </div>
         <ModalWrapper condition={specialOfferModal}>
            <SpecialOfferCreate condition={specialOfferModal} set={setSpecialOfferModal} id={buildingData.id} />
         </ModalWrapper>
         <ModalWrapper condition={detailedStatisticsModalOpen}>
            <DetailedStatisticsModal
               condition={detailedStatisticsModalOpen}
               set={setDetailedStatisticsModalOpen}
               id={buildingData.id}
               defaultType={detailedStatisticsModalOpen}
            />
         </ModalWrapper>
      </section>
   );
};

export default BuildingStatistics;
