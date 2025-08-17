import { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ModalHeader from '../../ui/Modal/ModalHeader';
import Button from '../../uiForm/Button';
import { FeedContext } from '../../context';
import FilterButton from '../../uiForm/FilterButton';
import { getIsDesktop } from '@/redux';
import { SpinnerForBtn } from '../../ui/Spinner';

import Select from '../../uiForm/Select';
import MultiSelect from '../../uiForm/MultiSelect';
import { setValueFeed } from '../../redux/slices/feedSlice';
import FieldRow from '../../uiForm/FieldRow';
import { IconFilter } from '../../ui/Icons';

const FeedFilters = () => {
   const { isLoading, dataCards, feedType, values, reset, citiesData, filters, filterCount } = useContext(FeedContext);
   const [isOpenModalFilters, setOpenModalFilters] = useState(false);
   const isDesktop = useSelector(getIsDesktop);
   const dispatch = useDispatch();

   return (
      <div>
         <button type="button" className={'flex items-center gap-1.5'} onClick={() => setOpenModalFilters(true)}>
            <div className="relative flex-center-all">
               <IconFilter width={20} height={20} className="stroke-[1.5px] stroke-primary400 z-20 relative" />
               {filterCount > 0 && <span className="text-white bg-red absolute top-[-2px] right-[-2px] rounded-full w-2 h-2 flex-center-all z-10" />}
            </div>
            <span>Фильтры</span>
         </button>
         <ModalWrapper condition={isOpenModalFilters}>
            <Modal
               options={{ modalClassNames: `HeaderSticky !px-0`, modalContentClassNames: '!py-0 !pl-8 !pr-12 md1:!px-4' }}
               style={
                  isDesktop
                     ? {
                          '--modal-space': '40px',
                          '--modal-height': 'calc(var(--vh) - 80px)',
                          '--modal-width': '75%',
                       }
                     : {
                          '--modal-space': '0',
                          '--modal-height': 'var(--vh)',
                          '--modal-width': '100%',
                       }
               }
               set={setOpenModalFilters}
               condition={isOpenModalFilters}
               closeBtn={false}
               ModalHeader={() => (
                  <ModalHeader set={setOpenModalFilters} className="px-8 py-6 md1:px-4 md1:py-4">
                     <h2 className="title-2">Фильтры</h2>
                  </ModalHeader>
               )}
               ModalFooter={() => (
                  <div className="ModalFooter">
                     {filterCount > 0 ? (
                        <Button
                           variant="secondary"
                           className="!text-red"
                           size="Small"
                           onClick={() => {
                              reset();
                           }}>
                           Очистить {isDesktop && `фильтр ⋅ ${filterCount}`}
                        </Button>
                     ) : (
                        <div />
                     )}

                     <Button size="Small" onClick={() => setOpenModalFilters(false)} className="min-w-[220px]">
                        {isLoading ? (
                           <SpinnerForBtn size={16} variant="second" />
                        ) : (
                           <>
                              Показать {dataCards.total} {feedType === 'promo' ? 'скидок' : 'видео'}
                           </>
                        )}
                     </Button>
                  </div>
               )}>
               <div className="flex flex-col gap-4 mt-6">
                  <FieldRow name="Город" widthChildren={512} classNameName="font-medium">
                     <Select
                        options={citiesData}
                        value={values.city || {}}
                        onChange={value => {
                           dispatch(setValueFeed({ name: 'city', value }));
                        }}
                        search
                     />
                  </FieldRow>
                  <FieldRow name="Застройщик" widthChildren={512} classNameName="font-medium">
                     <MultiSelect
                        options={filters.developers}
                        onChange={selectedOption => {
                           dispatch(setValueFeed({ name: 'developers', value: selectedOption }));
                        }}
                        value={values.developers || []}
                        search
                        btnsActions
                     />
                  </FieldRow>
                  <FieldRow name="Комплекс" widthChildren={512} classNameName="font-medium">
                     <MultiSelect
                        options={filters.complexes}
                        onChange={selectedOption => {
                           dispatch(setValueFeed({ name: 'complexes', value: selectedOption }));
                        }}
                        value={values.complexes || []}
                        search
                        btnsActions
                     />
                  </FieldRow>
                  <FieldRow name="Автор" widthChildren={512} classNameName="font-medium">
                     <MultiSelect
                        options={filters.authors}
                        onChange={selectedOption => {
                           dispatch(setValueFeed({ name: 'authors', value: selectedOption }));
                        }}
                        value={values.authors || []}
                        search
                        btnsActions
                     />
                  </FieldRow>
               </div>
            </Modal>
         </ModalWrapper>
      </div>
   );
};

export default FeedFilters;
