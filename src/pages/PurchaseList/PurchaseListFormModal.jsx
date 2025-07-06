import React, { useContext } from 'react';
import { PurchaseListContext } from '../../context';
import ModalHeader from '../../ui/Modal/ModalHeader';
import Modal from '../../ui/Modal';
import { calcPropsOptions, roomsOptions } from '../../data/selectsField';
import FieldRow from '../../uiForm/FieldRow';
import { ControllerFieldMultiSelect } from '../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import PurchaseListFilterDeveloper from './PurchaseListFilterDeveloper';
import PurchaseListFilterComplexes from './PurchaseListFilterComplexes';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ControllerFieldTags from '../../uiForm/ControllerFields/ControllerFieldTags';
import { FiltersDataChainCity } from '../../ui/FiltersDataChain';
import Button from '../../uiForm/Button';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';

const PurchaseListFormModal = () => {
   const { control, filterCount, setIsOpenMoreFilter, isOpenMoreFilter, reset, setValue, cities, currentCity } = useContext(PurchaseListContext);
   const isDesktop = useSelector(getIsDesktop);

   const ModalHeaderLayout = () => {
      return (
         <ModalHeader set={setIsOpenMoreFilter} className="px-8 py-6 mb-8 md1:px-4 md1:py-4 md1:mb-6">
            <h2 className="title-2">Фильтры</h2>
         </ModalHeader>
      );
   };

   const ModalFooterLayout = () => {
      return (
         <div className="ModalFooter">
            {filterCount > 0 ? (
               <Button
                  variant="secondary"
                  size="Small"
                  onClick={e => {
                     e.preventDefault();
                     reset({
                        city: cities.find(item => item.value === currentCity.id),
                     });
                  }}>
                  Очистить {isDesktop && `фильтр ⋅ ${filterCount}`}
               </Button>
            ) : (
               <div />
            )}
            <Button size="Small" onClick={() => setIsOpenMoreFilter(false)}>
               Показать заявки
            </Button>
         </div>
      );
   };

   return (
      <ModalWrapper condition={isOpenMoreFilter}>
         <Modal
            options={{ modalClassNames: `HeaderSticky !px-0 !pb-0`, modalContentClassNames: '!py-0 !pl-8 !pr-12 md1:!px-4' }}
            style={
               window.innerWidth > 1222
                  ? {
                       '--modal-space': '40px',
                       '--modal-height': 'calc(var(--vh) - 80px)',
                       '--modal-width': '800px',
                    }
                  : {
                       '--modal-space': '0',
                       '--modal-height': 'var(--vh)',
                       '--modal-width': '100%',
                    }
            }
            set={setIsOpenMoreFilter}
            condition={isOpenMoreFilter}
            closeBtn={false}
            ModalHeader={ModalHeaderLayout}
            ModalFooter={ModalFooterLayout}>
            <div className="flex flex-col gap-6">
               <FieldRow name="Город" widthChildren={460} fontWeight="medium">
                  <FiltersDataChainCity nameLabel="" defaultValue={cities.find(item => item.value === currentCity.id)} />
               </FieldRow>
               <FieldRow name="Комнатность" widthChildren={460} fontWeight="medium">
                  <ControllerFieldTags control={control} options={roomsOptions} name="rooms" type="multiple" />
               </FieldRow>
               <FieldRow name="Застройщик" widthChildren={460} fontWeight="medium">
                  <PurchaseListFilterDeveloper />
               </FieldRow>
               <FieldRow name="Комплекс" widthChildren={460} fontWeight="medium">
                  <PurchaseListFilterComplexes />
               </FieldRow>
               <FieldRow name="Способ расчёта" widthChildren={460} fontWeight="medium">
                  <ControllerFieldMultiSelect name="calc_props" control={control} calcProp options={calcPropsOptions} setValue={setValue} />
               </FieldRow>
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default PurchaseListFormModal;
