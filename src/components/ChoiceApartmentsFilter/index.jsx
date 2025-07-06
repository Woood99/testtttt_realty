import React, { useCallback, useEffect, useState } from 'react';
import RoomsContainer from '../../uiForm/CheckboxRoom/RoomsContainer';
import { roomsOptions } from '../../data/selectsField';
import CheckboxRoom from '../../uiForm/CheckboxRoom';
import FieldInput from '../../uiForm/FieldInput';
import MultiSelect from '../../uiForm/MultiSelect';
import { sendPostRequest } from '../../api/requestsApi';
import Input from '../../uiForm/Input';
import debounce from 'lodash.debounce';

const ChoiceApartmentsFilter = ({
   building_id = 0,
   frames = [],
   defaultValue = [],
   setData = () => {},
   className = '',
   title = 'Квартиры',
   areaField = true,
   filterFields = {},
   setFilterFields = () => {},
   endpoint = 'apartments-filter',
   customFilter = () => true,
}) => {
   const [apartments, setApartments] = useState([]);

   const [selectedApartments, setSelectedApartments] = useState([]);
   const [isInit, setIsInit] = useState(false);

   const getApartments = useCallback(
      debounce(({ filterFields, defaultValue, isInit }) => {
         const resData = {
            ...filterFields,
            frames: filterFields.frame.length ? filterFields.frame.map(item => +item.value) : null,
         };

         sendPostRequest(`/api/building/${building_id}/${endpoint}`, resData).then(res => {
            if (!isInit) {
               const dataFilter = res.data
                  .map(item => ({
                     value: item.id,
                     label: item.title,
                     image: item.image,
                  }))
                  .filter(item => defaultValue.includes(item.value));
               setSelectedApartments(dataFilter);
               setData(dataFilter);
               setIsInit(true);
            }
            setApartments(res.data.filter(customFilter));
         });
      }, 300),
      []
   );

   useEffect(() => {
      if (!defaultValue) return;
      getApartments({ filterFields, defaultValue, isInit });
   }, [filterFields, defaultValue]);

   return (
      <div>
         {Boolean(title) && <h3 className="title-3 mb-4">{title}</h3>}
         <div className={`grid grid-cols-[380px_max-content_1fr] gap-2 ${className}`}>
            <MultiSelect
               nameLabel="Корпус"
               options={frames}
               value={filterFields.frame}
               onChange={value => {
                  setFilterFields({ ...filterFields, frame: value });
               }}
               defaultOption
               btnsActions
               search
            />

            <RoomsContainer>
               {roomsOptions.map((option, index) => {
                  return (
                     <CheckboxRoom
                        key={index}
                        checked={filterFields.rooms.includes(option.value)}
                        onChange={e =>
                           setFilterFields(() => {
                              if (e.target.checked) {
                                 return { ...filterFields, rooms: [...filterFields.rooms, option.value] };
                              } else {
                                 return { ...filterFields, rooms: filterFields.rooms.filter(item => item !== option.value) };
                              }
                           })
                        }
                        label={option.label}
                        size={option.value === 0 ? 'Studio' : 'Default'}
                     />
                  );
               })}
            </RoomsContainer>
            {areaField && (
               <FieldInput>
                  <Input
                     value={filterFields.areaFrom}
                     onChange={value => setFilterFields({ ...filterFields, areaFrom: value })}
                     before="Площадь от"
                     convertNumber
                     onlyNumber
                     maxLength={3}
                  />
                  <Input
                     value={filterFields.areaTo}
                     onChange={value => setFilterFields({ ...filterFields, areaTo: value })}
                     before="До"
                     after="м²"
                     convertNumber
                     onlyNumber
                     maxLength={3}
                  />
               </FieldInput>
            )}

            <div className="col-span-full">
               <MultiSelect
                  nameLabel="Выбрать квартиры"
                  options={apartments.map(item => {
                     return {
                        value: item.id,
                        label: item.title,
                        image: item.image,
                     };
                  })}
                  value={selectedApartments}
                  onChange={selectedOption => {
                     setSelectedApartments(selectedOption);
                     setData(selectedOption);
                  }}
                  search
                  btnsActions
                  lazyLoading
               />
            </div>
         </div>
      </div>
   );
};

export default ChoiceApartmentsFilter;
