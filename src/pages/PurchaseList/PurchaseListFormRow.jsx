import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import FormRow from '../../uiForm/FormRow';
import FilterButton from '../../uiForm/FilterButton';
import { PurchaseListContext } from '../../context';
import { ControllerFieldMultiSelect } from '../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import ControllerFieldTags from '../../uiForm/ControllerFields/ControllerFieldTags';
import { calcPropsOptions, roomsOptions } from '../../data/selectsField';
import Button from '../../uiForm/Button';
import { BuyerRoutesPath, PrivateRoutesPath } from '../../constants/RoutesPath';
import { checkAuthUser, getIsDesktop, getUserInfo } from '@/redux';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';
import InputSearch from '../../uiForm/InputSearch';
import { isAdmin } from '../../helpers/utils';
import { openUrl } from '../../helpers/openUrl';

const PurchaseListFormRow = () => {
   const { filterCount, setIsOpenMoreFilter, variant, control, setValue, complexes } = useContext(PurchaseListContext);

   const isDesktop = useSelector(getIsDesktop);
   const authUser = useSelector(checkAuthUser);
   const dispatch = useDispatch();

   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   return (
      <FormRow
         className={cn(
            'scrollbarPrimary',
            variant !== 'seller' && `${isDesktop ? 'grid-cols-[145px_1fr_max-content]' : 'grid-cols-[50px_40px_minmax(max-content,300px)]'}`,
            variant === 'seller' && '!px-0 grid-cols-[270px_max-content_270px]'
         )}
         shadow={false}>
         {variant !== 'seller' && (
            <>
               <FilterButton count={filterCount} onClick={() => setIsOpenMoreFilter(prev => !prev)} mini={!isDesktop} />
               <InputSearch
                  control={control}
                  placeholder="Поиск по параметрам и имени"
                  name="search"
                  options={{ title: 'Поиск заявок', text_show: 'Показать заявки' }}
               />
               <Button
                  type="button"
                  size="Small"
                  onClick={() => {
                     if (authUser) {
                        if (userIsAdmin) {
                           openUrl(PrivateRoutesPath.purchase.create);
                        } else {
                           openUrl(BuyerRoutesPath.purchase.create);
                        }
                     } else {
                        dispatch(setSelectAccLogModalOpen(true));
                     }
                  }}>
                  Разместить заявку на покупку
               </Button>
            </>
         )}
         {variant === 'seller' && (
            <>
               <ControllerFieldMultiSelect nameLabel="Комплекс" control={control} search btnsActions options={complexes} name="complexes" />
               <ControllerFieldTags control={control} options={roomsOptions} name="rooms" type="multiple" />
               <ControllerFieldMultiSelect
                  nameLabel="Способ покупки"
                  name="calc_props"
                  control={control}
                  calcProp
                  options={calcPropsOptions}
                  setValue={setValue}
               />
            </>
         )}
      </FormRow>
   );
};

export default PurchaseListFormRow;
