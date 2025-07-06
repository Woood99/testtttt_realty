import React, { memo, useCallback, useContext, useEffect, useState } from 'react';

import RoomInfoCard from '../RoomInfoCard';

import { getApartments } from '../../../api/Building/getApartments';
import PaginationPage from '../../../components/Pagination';
import LayoutBtn from './LayoutBtn';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { useSelector } from 'react-redux';
import { BuildingApartsContext, BuildingContext } from '../../../context';

import styles from './RoomInfo.module.scss';
import Button from '../../../uiForm/Button';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../../constants/RoutesPath';
import { appendParams } from '../../../helpers/appendParams';

const RoomInfoApartments = memo(({ data, onClick, activeRoomId }) => {
   const { id } = useContext(BuildingContext);
   const apartContext = useContext(BuildingApartsContext);
   const sortBy = useSelector(state => state.buildingApartFilter.sortBy);

   const [apartments, setApartments] = useState({
      cards: [],
      totalPages: null,
   });

   const [apartmentsLoading, setApartmentsLoading] = useState(false);

   const [currentPageApartments, setCurrentPageApartments] = useState(1);

   useEffect(() => {
      if (data.room === activeRoomId) {
         setApartmentsLoading(true);
         const params = {
            sort: sortBy || '',
            tags: [...apartContext.filtersResult.tags, ...apartContext.filtersResult.advantages],
            is_gift: apartContext.filtersResult.is_gift,
            is_video: apartContext.filtersResult.is_video,
            filters: {
               primary: {
                  ...apartContext.filtersResult.filters.primary,
                  rooms: [activeRoomId],
               },
            },
            page: currentPageApartments,
         };

         getApartments(id, params).then(res => {
            setApartmentsLoading(false);
            setApartments(res);
         });
      }
   }, [activeRoomId, currentPageApartments]);

   const LayoutApartments = useCallback(() => {
      const searchParams = new URLSearchParams();

      appendParams(searchParams, 'sort', sortBy, 'string');
      appendParams(searchParams, 'rooms', [activeRoomId], 'array');
      appendParams(searchParams, 'price_from', apartContext.filtersResult.filters.primary.price_from, 'number');
      appendParams(searchParams, 'price_to', apartContext.filtersResult.filters.primary.price_to, 'number');
      appendParams(searchParams, 'area_from', apartContext.filtersResult.filters.primary.area_from, 'number');
      appendParams(searchParams, 'area_to', apartContext.filtersResult.filters.primary.area_to, 'number');
      appendParams(searchParams, 'frames', apartContext.filtersResult.filters.primary.frames?.value, 'string');
      appendParams(searchParams, 'tags', apartContext.filtersResult.tags, 'array');
      appendParams(searchParams, 'advantages', apartContext.filtersResult.advantages, 'array');
      appendParams(searchParams, 'is_gift', apartContext.filtersResult.is_gift, 'bool');
      appendParams(searchParams, 'is_video', apartContext.filtersResult.is_video, 'bool');

      return (
         <>
            {apartments &&
               apartments.cards.map((item, index) => {
                  return <RoomInfoCard key={index} data={item} room={activeRoomId} userRole={apartContext.userRole} />;
               })}
            {Boolean(apartments?.totalPages > 1) && (
               <>
                  <PaginationPage
                     currentPage={currentPageApartments}
                     setCurrentPage={value => setCurrentPageApartments(value)}
                     total={apartments ? apartments.totalPages : 0}
                     className="my-6"
                     showBtn={false}
                  />
                  <Link to={`${RoutesPath.listingFlats}?complex=${id}&${searchParams.toString()}`} target="_blank" className="w-full md1:px-4">
                     <Button variant="secondary" Selector="div">
                        Смотреть списком
                     </Button>
                  </Link>
               </>
            )}
         </>
      );
   }, [apartments]);

   const onClickLayout = e => {
      onClick();
      const target = e.currentTarget && e.currentTarget.closest('[data-layout-btn]');
      if (!target) return;

      setTimeout(() => {
         const rect = target.getBoundingClientRect();
         const distanceFromTop = rect.top + window.pageYOffset;
         window.scrollTo({
            top: distanceFromTop - 52 - 16,
            behavior: 'smooth',
         });
      }, 100);
   };

   return (
      <div className={styles.RoomInfoRootMain}>
         <LayoutBtn data={data} planning={false} onClick={onClickLayout} active={data.room === activeRoomId} />
         {Boolean(data.room === activeRoomId) && (
            <div className="mt-4">
               <LayoutApartments />
            </div>
         )}
      </div>
   );
});

export default RoomInfoApartments;
