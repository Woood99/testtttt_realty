import React from 'react';
import { useApartment } from './useApartment';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { defaultApartDataCreate } from './constants';
import ApartmentForm from './ApartmentForm';

const ApartmentCreate = () => {
   const queryParams = useQueryParams();
   const apartmentOptions = useApartment(!queryParams.copy ? defaultApartDataCreate : null, 'create');

   if (queryParams.copy && !apartmentOptions.data) {
      return;
   }

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <h2 className="title-2">Добавить квартиру</h2>
            </div>
            <ApartmentForm options={apartmentOptions} />
         </div>
      </main>
   );
};

export default ApartmentCreate;
