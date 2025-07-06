import React, { useContext } from 'react';
import PurchaseListFormRow from './PurchaseListFormRow';
import PurchaseListFormModal from './PurchaseListFormModal';
import { FiltersDataChainContext } from '../../ui/FiltersDataChain';
import { PurchaseListContext } from '../../context';

const PurchaseListForm = () => {
   const { control, cities, setValue, developers, complexes, setComplexes, setDevelopers, watchedValues, initFieldsForm, setInitFieldsForm } =
      useContext(PurchaseListContext);

   return (
      <form>
         <FiltersDataChainContext.Provider
            value={{
               values: watchedValues,
               developers,
               setDevelopers,
               complexes,
               setComplexes,
               control,
               cities,
               setValue,
               initFieldsForm,
               setInitFieldsForm,
            }}>
            <PurchaseListFormRow />
            <PurchaseListFormModal />
         </FiltersDataChainContext.Provider>
      </form>
   );
};

export default PurchaseListForm;
