import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import Sidebar from '../../components/Sidebar';
import FormSidebarNav from '../../components/FormSidebarNav';
import { PURCHASE_CREATE_NAV_ITEMS } from './purchaseCreateConstants';

const PurchaseCreateSidebar = () => {
   const { errors, formValues, init } = useContext(PurchaseCreateContext);

   return (
      <Sidebar>
         <div className="flex flex-col white-block">
            <h3 className="title-3 mb-6">Поля для заполнения</h3>
            <FormSidebarNav items={PURCHASE_CREATE_NAV_ITEMS} errors={errors} watched={formValues} init={init} />
         </div>
      </Sidebar>
   );
};

export default PurchaseCreateSidebar;
