import React from 'react';
import Button from '../../uiForm/Button';

const PurchaseRequestHistory = ({ className = '' }) => {
   return (
      <div className={`flex flex-col text-center items-center white-block-small p-6 ${className}`}>
         <h3 className="title-3 mb-4">История изменения заявки</h3>
         <div className="flex flex-col gap-3 w-full">
            <Button>Смотреть</Button>
         </div>
      </div>
   );
};

export default PurchaseRequestHistory;
