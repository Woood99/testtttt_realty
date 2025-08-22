import React, { useEffect, useState } from 'react';

import Modal from '../../ui/Modal';
import { SecondTableContent, SecondTableHeader } from '../../ui/SecondTable';
import { IconComparison, IconEye, IconFavoriteStroke } from '../../ui/Icons';
import { getDataRequest } from '../../api/requestsApi';
import Select from '../../uiForm/Select';
import { UserCardInfo } from '../../ui/CardsRow';
import CardBasicRowSkeleton from '../../components/CardBasicRowSkeleton';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import PaginationPage from '../../components/Pagination';
import { getSumOfArray } from '../../helpers/arrayMethods';

const filterValues = [
   {
      value: 'building_visited',
      label: 'Просмотры ЖК',
   },
   {
      value: 'apartment_visited',
      label: 'Просмотры объектов',
   },
   {
      value: 'likes',
      label: 'Добавили в избранное',
   },
   {
      value: 'added_to_compare',
      label: 'Добавили в сравнение',
   },
   {
      value: 'promo_visited',
      label: 'Просмотр скидки, рассчёты и подарков',
   },
   // {
   //    value: 'added_to_compare',
   //    label: 'Просмотр видео и клипов',
   // },
];

const DetailedStatisticsModal = ({ condition, set, defaultType = 'building_visited', id }) => {
   const [isLoading, setIsLoading] = useState(true);

   const [data, setData] = useState({
      items: [],
      pages: 1,
      total: 0,
   });

   const [activeType, setActiveType] = useState(filterValues.find(item => item.value === (defaultType === true ? 'building_visited' : defaultType)));
   
   const [currentPage, setCurrentPage] = useState(1);

   const fetchData = async (page = 1) => {
      if (!activeType) return;
      setIsLoading(true);
      getDataRequest(`/seller-api/building/${id}/stats/detailed`, { type: activeType.value, limit: 8, page }).then(res => {
         setData(res.data);
         setIsLoading(false);
      });
   };

   useEffect(() => {
      fetchData();
   }, [activeType]);

   return (
      <Modal options={{ overlayClassNames: '_full', modalContentClassNames: '!p-0 !pt-12 flex flex-col' }} set={set} condition={condition}>
         <div className="container">
            <h2 className="title-2 !text-left px-14 mb-6">Подробная статистика по посетителям</h2>
         </div>
         <form className="bg-pageColor flex-grow rounded-xl px-0 py-4">
            <div className="container">
               <div className="mb-6 max-w-[400px]">
                  <Select nameLabel="Поиск по" options={filterValues} value={activeType} onChange={value => setActiveType(value)} />
               </div>
               <SecondTableHeader className="grid-cols-[215px_200px_90px_120px_90px_90px_90px_90px_1fr]">
                  <span>Имя</span>
                  <span>Последняя активность</span>
                  <span>ЖК</span>
                  <span>Объектов ЖК</span>
                  <span>Избранное</span>
                  <span>Сравнение</span>
                  <span>На просмотр</span>
                  <span>Звонок</span>
               </SecondTableHeader>
               <SecondTableContent className="mt-3 flex flex-col gap-3">
                  {isLoading ? (
                     [...new Array(5)].map((_, index) => {
                        return (
                           <CardBasicRowSkeleton key={index} className="grid-cols-[350px_300px_1fr_max-content] h-[96px]">
                              <div className="flex gap-3 items-center">
                                 <WebSkeleton className="w-12 h-12 rounded-full" />
                                 <WebSkeleton className="w-[150px] h-6 rounded-lg" />
                              </div>
                              <WebSkeleton className="w-3/6 h-10 rounded-lg" />
                              <WebSkeleton className="w-3/6 h-10 rounded-lg" />
                              <WebSkeleton className="w-[100px] h-10 rounded-lg" />
                           </CardBasicRowSkeleton>
                        );
                     })
                  ) : (
                     <>
                        {data.items.map((item, index) => {
                           return (
                              <UserCardInfo data={item} key={index}>
                                 <div title="Просмотров ЖК" className="z-10 flex gap-2">
                                    <IconEye className="fill-blue" width={16} height={16} />
                                    {getSumOfArray(item.building.building_visited)}
                                 </div>
                                 <div title="Просмотр объектов ЖК" className="z-10 flex gap-2">
                                    <IconEye className="fill-blue" width={16} height={16} />
                                    {getSumOfArray(item.apartments.apartment_visited)}
                                 </div>
                                 <div title="Добавили в избранное" className="z-10 flex gap-2">
                                    <IconFavoriteStroke className="stroke-red" width={14} height={14} />
                                    {item.added_to_favorites}
                                    {getSumOfArray(item.building.likes)}
                                 </div>
                                 <div title="Добавили в сравнение" className="z-10 flex gap-2">
                                    <IconComparison className="fill-green" width={16} height={16} />
                                    {getSumOfArray(item.building.added_to_compare)}
                                 </div>
                                 <div title="Записалось на просмотр" className="z-10 flex gap-2">
                                    <IconEye className="fill-dark" width={16} height={16} />
                                    {getSumOfArray(item.building.application, item.apartments.application)}
                                 </div>
                                 <div title="Заказали звонок" className="z-10 flex gap-2">
                                    <IconEye className="fill-dark" width={16} height={16} />
                                    {getSumOfArray(item.building.consultation, item.apartments.consultation)}
                                 </div>
                              </UserCardInfo>
                           );
                        })}
                        <PaginationPage
                           className="mt-8"
                           currentPage={currentPage}
                           setCurrentPage={value => {
                              setCurrentPage(value);
                              fetchData(value);
                           }}
                           total={data.pages}
                        />
                     </>
                  )}
               </SecondTableContent>
            </div>
         </form>
      </Modal>
   );
};

export default DetailedStatisticsModal;
