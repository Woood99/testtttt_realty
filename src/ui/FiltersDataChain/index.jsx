import React, { createContext, useContext, useEffect } from 'react';
import { ControllerFieldMultiSelect } from '../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import { ControllerFieldSelect } from '../../uiForm/ControllerFields/ControllerFieldSelect';
import { useSelector } from 'react-redux';
import { getCitiesValuesSelector } from '../../redux/helpers/selectors';
import { sendPostRequest } from '../../api/requestsApi';
import { getOptionsFromData } from '../../helpers/getOptionsFromData';

export const FiltersDataChainContext = createContext();

export const FiltersDataChainCity = ({ defaultValue = {}, nameLabel = 'Город' }) => {
   const { values, control, setValue, setDevelopers = [], initFieldsForm, setInitFieldsForm } = useContext(FiltersDataChainContext);
   const cities = useSelector(getCitiesValuesSelector);

   useEffect(() => {
      const city = values?.city;
      if (!city) return;

      sendPostRequest('/api/developers/all', { city: city.value }).then(res => {
         const data = getOptionsFromData(res.data);
         setDevelopers(data);

         if (initFieldsForm.developers) {
            setValue('developers', []);
         }
         if (initFieldsForm.complexes) {
            setValue('complexes', []);
         }

         setInitFieldsForm(prev => ({ ...prev, developers: true, complexes: true }));
      });
   }, [values?.city?.value]);

   return (
      <ControllerFieldSelect nameLabel={nameLabel} options={cities} control={control} defaultValue={defaultValue} setValue={setValue} name="city" />
   );
};

export const FiltersDataChainDevelopers = ({ nameLabel = '' }) => {
   const { values, control, setValue, developers = [], setComplexes, initFieldsForm, setInitFieldsForm } = useContext(FiltersDataChainContext);

   useEffect(() => {
      const developers = values?.developers;
      if (!developers) return;
      sendPostRequest('/api/developers/complexes', { developer_ids: developers.map(item => item.value) }).then(res => {
         setComplexes(res.data);

         if (initFieldsForm.complexes) {
            setValue('complexes', []);
         }

         setInitFieldsForm(prev => ({ ...prev, complexes: true }));
      });
   }, [values?.developers?.length]);

   return (
      <ControllerFieldMultiSelect
         nameLabel={nameLabel}
         control={control}
         options={developers}
         name="developers"
         setValue={setValue}
         setValuePermit
         search
         btnsActions
      />
   );
};

export const FiltersDataChainComplexes = ({ nameLabel = '' }) => {
   const { control, setValue, complexes } = useContext(FiltersDataChainContext);

   return (
      <ControllerFieldMultiSelect
         nameLabel={nameLabel}
         control={control}
         search
         btnsActions
         options={complexes}
         name="complexes"
         setValue={setValue}
         setValuePermit
      />
   );
};
