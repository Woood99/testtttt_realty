import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { getDataRequest } from '../../../api/requestsApi';
import CardPrimary from '../../../ui/CardPrimary';
import EmptyBlock from '../../../components/EmptyBlock';
import { ControllerFieldInputRangeSlider } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { BuildingContext } from '../../../context';
import { getCitiesSelector } from '@/redux';
import { CardPrimarySkeleton } from '../../../ui/CardPrimary/CardPrimarySkeleton';

const BuildingSimilarCity = ({ id, currentCity, defaultPrice }) => {
   const { minPriceAllObjects, maxPriceAllObjects } = useContext(BuildingContext);

   const cities = useSelector(getCitiesSelector);
   const { handleSubmit, control, setValue } = useForm();

   const [dataCards, setDataCards] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const watchedValues = useWatch({
      control,
   });

   useEffect(() => {
      setValue(
         'city',
         cities
            .filter(item => item.name !== currentCity)
            .map(item => {
               return {
                  value: item.id,
                  label: item.name,
               };
            })[0]
      );
   }, [cities]);

   const handleSubmitFn = data => {
      setIsLoading(true);

      getDataRequest(`/api/building/${id}/similar-in-city/${data.city}`, {
         price: data.price,
         percentage_offset: 0.05,
         limit: 3,
         building_type_id: 1,
      }).then(res => {
         setIsLoading(false);
         setDataCards(res.data);
      });
   };

   const debounceFn = useCallback(
      debounce(state => {
         handleSubmitFn(state);
      }, 400),
      []
   );

   useEffect(() => {
      debounceFn({
         city: watchedValues.city?.value,
         price: watchedValues.price,
      });
   }, [watchedValues]);
   
   if (!maxPriceAllObjects) return;
   if (!minPriceAllObjects) return;

   return (
      <>
         <section className="mt-3">
            <div className="white-block">
               <h2 className="title-2 mb-6">Новостройки за этот бюджет в других городах</h2>
               <form className="grid grid-cols-3 md1:grid-cols-[repeat(2,minmax(300px,1fr))] gap-3 scrollbarPrimary md1:overflow-x-auto md1:overflow-y-hidden min-h-[50px]">
                  <ControllerFieldSelect
                     control={control}
                     nameLabel="Город"
                     options={cities
                        ?.filter(item => item.name !== currentCity)
                        .map(item => {
                           return {
                              value: item.id,
                              label: item.name,
                           };
                        })}
                     name="city"
                  />
                  {Boolean(maxPriceAllObjects && minPriceAllObjects) && (
                     <ControllerFieldInputRangeSlider
                        name="price"
                        start={defaultPrice}
                        range={{
                           min: minPriceAllObjects,
                           '1%': [500000, 100000],
                           '50%': [Math.round(((maxPriceAllObjects / 100) * 2) / 100000) * 100000, 500000],
                           max: maxPriceAllObjects,
                        }}
                        step={1}
                        control={control}
                        beforeText="Стоимость объекта"
                     />
                  )}
               </form>
               <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mt-4">
                  {isLoading ? (
                     [...new Array(3)].map((_, index) => {
                        return <CardPrimarySkeleton key={index} />;
                     })
                  ) : (
                     <>
                        {dataCards.length > 0 ? (
                           dataCards.map((card, index) => {
                              return <CardPrimary {...card} key={index} />;
                           })
                        ) : (
                           <div className="col-span-full">
                              <EmptyBlock block={false} />
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>
         </section>
      </>
   );
};

export default BuildingSimilarCity;
