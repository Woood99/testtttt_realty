import React, { useContext } from 'react';
import { DetailedStatisticsContext } from '../../context';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { SecondTableContent, SecondTableHeader } from '../../ui/SecondTable';
import { UserCardInfo } from '../../ui/CardsRow';
import { IconComparison, IconEye, IconFavoriteStroke } from '../../ui/Icons';
import CardBasicRowSkeleton from '../../components/CardBasicRowSkeleton';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { combinedArrayLength } from '../../helpers/arrayMethods';

const DetailedStatisticsCardInfo = () => {
   const { data } = useContext(DetailedStatisticsContext);

   return (
      <>
         <SecondTableHeader className="grid-cols-[215px_200px_90px_120px_90px_90px_90px_90px_1fr]">
            <span>Имя</span>
            <span>Последняя активность</span>
            <span>ЖК</span>
            <span>Объектов ЖК</span>
            <span>Избранное</span>
            <span>Сравнение</span>
         </SecondTableHeader>
         <SecondTableContent className="mt-3 flex flex-col gap-3">
            {isEmptyArrObj(data) ? (
               <CardBasicRowSkeleton className="grid-cols-[215px_200px_90px_120px_90px_90px_90px_1fr] h-[96px]">
                  <div className="flex gap-3 items-center">
                     <WebSkeleton className="w-12 h-12 rounded-full" />
                     <WebSkeleton className="w-[120px] h-8 rounded-lg" />
                  </div>
                  <WebSkeleton className="w-[150px] h-8 rounded-lg" />
                  <WebSkeleton className="w-[65px] h-8 rounded-lg" />
                  <WebSkeleton className="w-[90px] h-8 rounded-lg" />
                  <WebSkeleton className="w-[70px] h-8 rounded-lg" />
                  <WebSkeleton className="w-[70px] h-8 rounded-lg" />
               </CardBasicRowSkeleton>
            ) : (
               <UserCardInfo data={data}>
                  <div title="Просмотров ЖК" className="z-10 flex gap-2">
                     <IconEye className="fill-blue" width={16} height={16} />
                     {combinedArrayLength(data.views_complex, data.views_my_complex)}
                  </div>
                  <div title="Просмотр объектов ЖК" className="z-10 flex gap-2">
                     <IconEye className="fill-blue" width={16} height={16} />
                     {combinedArrayLength(data.views_apart, data.views_my_apart)}
                  </div>
                  <div title="Добавили в избранное" className="z-10 flex gap-2">
                     <IconFavoriteStroke className="stroke-red" width={14} height={14} />
                     {combinedArrayLength(data.likes.my_complex, data.likes.my_apart)}
                  </div>
                  <div title="Добавили в сравнение" className="z-10 flex gap-2">
                     <IconComparison className="fill-green" width={16} height={16} />
                     {combinedArrayLength(data.added_to_compare.my_complex, data.added_to_compare.my_apart)}
                  </div>
               </UserCardInfo>
            )}
         </SecondTableContent>
      </>
   );
};

export default DetailedStatisticsCardInfo;
