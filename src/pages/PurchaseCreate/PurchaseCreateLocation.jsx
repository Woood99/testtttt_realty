import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PurchaseCreateContext } from '../../context';
import fetchScript from '../../helpers/fetchScript';
import { YMAPS_API } from '../../constants/api';
import PurchaseCreateMap from './PurchaseCreateMap';
import { ControllerFieldCheckbox } from '../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { getCurrentCitySelector } from '@/redux';
import Tag from '../../ui/Tag';
import CityModal from '../../ModalsMain/CityModal';

const PurchaseCreateLocation = () => {
   const { control, coordinates, setCoordinates, isEdit, defaultData, cityWatch, anyRegionWatch, locationRef, setValue } =
      useContext(PurchaseCreateContext);

   const defaultCity = useSelector(getCurrentCitySelector);

   const [currentCity, setCurrentCity] = useState(defaultCity);

   const [isLoaded, setIsLoaded] = useState(false);

   const [popupCityOpen, setPopupCityOpen] = useState(false);

   useEffect(() => {
      const city = isEdit ? defaultData.city : defaultCity;
      setCurrentCity(city);

      setValue('city', {
         value: city.id,
         label: city.name,
         geo: city.geo,
      });
   }, [defaultCity]);

   useEffect(() => {
      fetchScript(YMAPS_API).then(() => setIsLoaded(true));
   }, []);

   return (
      <div data-block="location" ref={locationRef}>
         <h2 className="title-2 mb-2">Расположение поиска</h2>
         <p className="mb-8 md1:mb-6">Выберите город и при необходимости нарисуйте желаемый район вашей заявки на карте</p>
         <div className="flex flex-wrap gap-2 w-full">
            <Tag color="select" value={true}>
               {cityWatch?.label}
            </Tag>
            <button type="button" className="blue-link _active self-center ml-4" onClick={() => setPopupCityOpen(true)}>
               Сменить город
            </button>
            <CityModal
               onSubmit={city => {
                  setValue('city', {
                     value: city.id,
                     label: city.name,
                     geo: [city.latitude, city.longitude],
                  });
                  setPopupCityOpen(false);
               }}
               currentCity={currentCity}
               condition={popupCityOpen}
               set={setPopupCityOpen}
            />
         </div>
         <div className="mt-6">
            <ControllerFieldCheckbox
               classNameText="!ml-5"
               variant="toggle"
               control={control}
               name="any_region"
               option={{
                  value: true,
                  label: 'Нарисовать желаемый район',
               }}
               defaultValue={isEdit ? Boolean(defaultData.is_any_area) : false}
            />
         </div>

         {isLoaded && anyRegionWatch && (
            <>
               <PurchaseCreateMap center={cityWatch?.geo} coordinates={coordinates} setCoordinates={setCoordinates} />
               <ControllerFieldCheckbox
                  className="mt-4"
                  control={control}
                  name="neighboring_areas"
                  option={{
                     value: true,
                     label: 'Можно предлагать соседние районы',
                  }}
                  defaultValue={isEdit ? Boolean(defaultData.suggest_neighbour) : false}
               />
            </>
         )}
      </div>
   );
};

export default PurchaseCreateLocation;
