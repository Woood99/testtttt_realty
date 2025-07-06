import React from 'react';
import MyObjectsItems from './MyObjectsItems';
import { MyObjectsContext } from '../../context';
import SellerLayout from '../../layouts/SellerLayout';
import { useMyObjects } from './useMyObjects';

const MyObjects = () => {
   const { dataCards } = useMyObjects();
   
   return (
      <SellerLayout pageTitle="Мои объекты">
         <MyObjectsContext.Provider
            value={{
               complexes: dataCards.complexes,
            }}>
            <MyObjectsItems />
         </MyObjectsContext.Provider>
      </SellerLayout>
   );
};

export default MyObjects;
