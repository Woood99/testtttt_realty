import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { PurchaseCreateContext } from '../../context';
import { ControllerFieldInput, ControllerFieldInputPhone } from '../../uiForm/ControllerFields/ControllerFieldInput';
import { getUserInfo } from '@/redux';

const PurchaseCreateContacts = () => {
   const { control, errors, isEdit, defaultData, isAdmin } = useContext(PurchaseCreateContext);
   const userInfo = useSelector(getUserInfo);

   return (
      <div data-block="contacts">
         <h2 className="title-2 mb-6">Ваши контакты</h2>
         <div className="grid grid-cols-2 gap-4 md3:grid-cols-1">
            <ControllerFieldInputPhone
               control={control}
               beforeText="Номер телефона"
               name="phone"
               errors={errors}
               defaultValue={isEdit ? `+${defaultData.user_phone}` || '' : !isAdmin ? userInfo?.phone || '' : ''}
               disabled={Boolean(isEdit)}
            />
            <ControllerFieldInput
               control={control}
               beforeText="Имя, фамилия"
               name="name"
               errors={errors}
               requiredValue
               defaultValue={isEdit ? `${defaultData.user.name} ${defaultData.user.surname}` || '' : !isAdmin ? userInfo?.name || '' : ''}
               disabled={Boolean(isEdit)}
            />
         </div>
      </div>
   );
};

export default PurchaseCreateContacts;
