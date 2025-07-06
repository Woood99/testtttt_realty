import React, { useContext, useEffect, useState } from 'react';
import { PurchaseCreateContext } from '../../context';
import fetchScript from '../../helpers/fetchScript';
import { YMAPS_API } from '../../constants/api';
import SetCityCoordinates from '../../unifComponents/ymap/SetCityCoordinates';
import PurchaseCreateMap from './PurchaseCreateMap';
import { ControllerFieldCheckbox } from '../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { useSelector } from 'react-redux';
import { getCurrentCitySelector } from '../../redux/helpers/selectors';
import FieldRow from '../../uiForm/FieldRow';
import Tag from '../../ui/Tag';
import CityModal from '../../ModalsMain/CityModal';

const PurchaseCreateLocation = () => {
   const { control, coordinates, setCoordinates, isEdit, defaultData, cityWatch, anyRegionWatch, locationRef, setValue, cities } =
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
         <h2 className="title-2 mb-3">Укажите расположение поиска</h2>
         <p className="mb-8 md1:mb-6">Выберите город и нарисуйте желаемый район вашей заявки на карте</p>
         <FieldRow name="Радиус поиска" widthChildren={460}>
            <div className="flex flex-wrap gap-2 w-full">
               <Tag color="select" value={true}>
                  {cityWatch?.label}
               </Tag>
               <Tag
                  color="select"
                  onClick={value => {
                     console.log(value);
                  }}
                  value={''}>
                  {cityWatch?.label} + 20км
               </Tag>
               <button type="button" className="blue-link _active self-center" onClick={() => setPopupCityOpen(true)}>
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
         </FieldRow>
         <ControllerFieldCheckbox
            className="mt-4"
            control={control}
            name="any_region"
            option={{
               value: true,
               label: 'Любой район',
            }}
            defaultValue={isEdit ? Boolean(defaultData.is_any_area) : false}
         />
         {isLoaded && !anyRegionWatch && (
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
