import React from 'react';
import styles from '../Listing.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { changeType, setMapInit } from '../../../redux/slices/listingSlice';
import { useSearchParams } from 'react-router-dom';

import { listingDefaultValue } from '../../../redux/slices/listingSlice';
import { RoutesPath } from '../../../constants/RoutesPath';

const ShowType = ({ className = '' }) => {
   const dispatch = useDispatch();
   const listingState = useSelector(state => state.listing);

   const [, setSearchParams] = useSearchParams();

   const onClickHandler = (e, name) => {
      e.preventDefault();

      if (listingState.type === name) return;
      dispatch(changeType(name));
      if (name === 'list') {
         dispatch(setMapInit(false));
      }

      if (window.innerWidth > 1222) {
         const currentParams = {
            type: name,
         };

         if (listingDefaultValue.type === currentParams.type) {
            delete currentParams['type'];
         }

         setSearchParams(currentParams);
      }
   };

   return (
      <div className={`flex items-center`}>
         <span className="mr-2 font-medium">Поиск</span>
         <div className={`flex items-center ${styles.ShowTypeRoot} ${className}`}>
            <div className="h-full">
               <button
                  onClick={() => (window.location.href = `${RoutesPath.listing}?type=list`)}
                  className={`${styles.ShowTypeItem} ${listingState.type === 'list' ? styles.ShowTypeItemActive : ''}`}>
                  Списком
               </button>
            </div>
            <div className="h-full">
               <button
                  onClick={() => (window.location.href = `${RoutesPath.listing}?type=map`)}
                  className={`${styles.ShowTypeItem} ${listingState.type === 'map' ? styles.ShowTypeItemActive : ''}`}>
                  На карте
               </button>
            </div>
         </div>
      </div>
   );
};

export default ShowType;
