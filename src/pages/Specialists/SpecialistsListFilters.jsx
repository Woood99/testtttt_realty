import React from 'react';
import FormRow from '../../uiForm/FormRow';
import { ControllerFieldSelect } from '../../uiForm/ControllerFields/ControllerFieldSelect';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';

const SpecialistsListFilters = ({ currentCity, control, citiesData, setValue }) => {
   return (
      <form>
         <FormRow className="grid-cols-[350px_minmax(350px,1fr)] container">
            <ControllerFieldSelect
               name="city"
               nameLabel="Город"
               control={control}
               setValue={setValue}
               options={citiesData}
               defaultValue={currentCity.id ? { value: currentCity.id, label: currentCity.name } : {}}
            />
            <ControllerFieldInput control={control} name="search" placeholder="ФИО менеджера" />
         </FormRow>
      </form>
   );
};

export default SpecialistsListFilters;
