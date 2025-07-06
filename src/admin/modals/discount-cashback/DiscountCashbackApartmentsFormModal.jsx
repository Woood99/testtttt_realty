import { memo } from 'react';

import ChoiceApartmentsFilter from '../../../components/ChoiceApartmentsFilter';
import Modal from '../../../ui/Modal';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import Button from '../../../uiForm/Button';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { ControllerFieldCheckboxesSingle } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { useDiscountCashbackApartmentsForm } from './useDiscountCashbackApartmentsForm';
import { OPTIONS_SUMM, OPTIONS_TYPE } from './constants';

const DiscountCashbackApartmentsFormModal = ({ condition, set, options, fetchData }) => {
   const {
      setSelectedApartments,
      filterFields,
      setFilterFields,
      defaultApartmentIds,
      isLoading,
      handleSubmit,
      control,
      setValue,
      watch,
      errors,
      onSubmitHandler,
      isCreateDiscountTitle,
      isCreateCashbackTitle,
      isEditDiscountTitle,
      isEditCashbackTitle,
      watch_type,
   } = useDiscountCashbackApartmentsForm({ condition, set, options, fetchData });

   if (!options) return;

   return (
      <Modal
         condition={Boolean(condition)}
         set={set}
         options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
         style={{
            '--modal-space': '40px',
            '--modal-height': 'calc(var(--vh) - 80px)',
            '--modal-width': '1100px',
         }}
         closeBtn={false}
         ModalHeader={() => (
            <ModalHeader set={set} className="px-10 py-6 mb-8">
               <h2 className="title-2">{isCreateDiscountTitle || isCreateCashbackTitle || isEditDiscountTitle || isEditCashbackTitle}</h2>
            </ModalHeader>
         )}
         ModalFooter={() => (
            <>
               {!isLoading && (
                  <div className="px-14 py-6">
                     <Button type="button" onClick={handleSubmit(onSubmitHandler)} className="w-full">
                        Сохранить
                     </Button>
                  </div>
               )}
            </>
         )}>
         {isLoading && <span className="text-primary400">Загрузка...</span>}
         {!isLoading && (
            <>
               {options.type === 'discount' && (
                  <ControllerFieldSelect
                     className="w-[365px] mb-3"
                     control={control}
                     nameLabel="Тип"
                     options={OPTIONS_TYPE}
                     defaultValue={OPTIONS_TYPE[0]}
                     name="type"
                     requiredValue
                     errors={errors}
                  />
               )}
               {watch_type?.value === 'summ' && (
                  <div className="flex items-center gap-4">
                     <div className="w-[365px]">
                        <ControllerFieldInput
                           control={control}
                           beforeText="Скидка в рублях"
                           name="type_summ"
                           errors={errors}
                           afterText="₽"
                           requiredValue
                           convertNumber
                           onlyNumber
                           maxLength={11}
                        />
                     </div>

                     <ControllerFieldCheckboxesSingle
                        control={control}
                        setValue={setValue}
                        checkboxes={OPTIONS_SUMM}
                        defaultValue={options.is_edit ? {} : OPTIONS_SUMM[0]}
                        required
                        watch={watch}
                     />
                  </div>
               )}
               {watch_type?.value === 'prc' && (
                  <div className="w-[365px] mb-3">
                     <ControllerFieldInput
                        control={control}
                        beforeText="Скидка в процентах"
                        name="type_prc"
                        errors={errors}
                        afterText="%"
                        requiredValue
                        onlyNumberSemicolon
                        maxLength={4}
                     />
                  </div>
               )}

               <div className="mt-3 grid grid-cols-2 gap-2">
                  <ControllerFieldInput control={control} datePicker={true} beforeText="Начало" name="start_date" requiredValue errors={errors} />
                  <ControllerFieldInput control={control} datePicker={true} beforeText="Окончание" name="end_date" requiredValue errors={errors} />
               </div>

               <div className="mt-8">
                  <ChoiceApartmentsFilter
                     building_id={options.id}
                     frames={options.frames}
                     setData={setSelectedApartments}
                     filterFields={filterFields}
                     setFilterFields={setFilterFields}
                     defaultValue={defaultApartmentIds}
                     endpoint={options.type === 'discount' ? 'apartments-filter-building-discount' : 'apartments-filter-building-cashback'}
                     customFilter={item => {
                        if (defaultApartmentIds.includes(item.id)) {
                           return true;
                        } else {
                           return item.can_use;
                        }
                     }}
                  />
               </div>
            </>
         )}
      </Modal>
   );
};

export default memo(DiscountCashbackApartmentsFormModal);
