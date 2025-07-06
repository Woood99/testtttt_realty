import styles from './MultiSelect.module.scss';

import Input from '../Input';
import Button from '../Button';
import Checkbox from '../Checkbox';
import { IconClose } from '../../ui/Icons';
import numberReplace from '../../helpers/numberReplace';
import { useEffect, useRef } from 'react';

const LayoutBody = ({
   options,
   searchText,
   setSearchText,
   setSelectedOptions,
   handlerToggle,
   search,
   btnsActions,
   selectedOptions,
   onChange,
   searchLabel,
   calcProp,
   lazyLoading = false,
}) => {
   const BtnsActionsLayout = () => {
      return (
         <div className={`${styles.MultiSelectActions} mb-6`}>
            <Button type="button" onClick={selectedOptionsAll} variant="secondary" size="26">
               Выбрать всё
            </Button>
            <Button type="button" onClick={selectedOptionsClear} variant="secondary" size="26">
               Очистить всё
            </Button>
         </div>
      );
   };

   const filteredOptions = options.filter(option => {
      return option.label?.toLowerCase().includes(searchText.toLowerCase());
   });

   const searchHandler = value => {
      setSearchText(value);
   };

   const selectedOptionsAll = () => {
      setSelectedOptions([...options]);
      onChange([...options]);
      setSearchText('');
   };

   const selectedOptionsClear = () => {
      setSelectedOptions([]);
      onChange([]);
      setSearchText('');
   };

   const handleCheckboxChange = (event, option) => {
      const isChecked = event.target.checked;

      let newSelectedOptions;
      if (isChecked) {
         newSelectedOptions = [...selectedOptions, option];
      } else {
         newSelectedOptions = selectedOptions.filter(currentOption => currentOption.value !== option.value);
      }

      setSelectedOptions(newSelectedOptions);
      onChange(newSelectedOptions);
   };

   const searchRef = useRef(null);
   
   useEffect(() => {
      const target = searchRef?.current;
      if (search && target) {
         target.focus();
      }
   }, []);

   return (
      <div>
         <button type="button" onClick={handlerToggle} className={styles.MultiSelectClose}>
            <IconClose />
         </button>
         {search && (
            <Input
               size="48"
               className={styles.MultiSelectSearch}
               placeholder={searchLabel}
               value={searchText}
               onChange={searchHandler}
               search
               refInput={searchRef}
            />
         )}
         {btnsActions && <BtnsActionsLayout />}
         <div className={`${styles.MultiSelectList} scrollbarPrimary`}>
            {filteredOptions.length > 0 ? (
               <>
                  {calcProp ? (
                     filteredOptions.map((option, index) => {
                        const values = selectedOptions.map(item => item.value);

                        const disabledConditionMap = {
                           default: option.id !== 1 && option.id !== 2 && option.id !== 3 && option.id !== 6,
                           cash: option.id !== 5 && option.id !== 1,
                           installment_plan: option.id !== 5 && option.id !== 6,
                           mortgage_approval_bank: option.id === 1 || option.id === 3 || option.id === 6,
                           mortgage_no_approval_bank: option.id === 1 || option.id === 2 || option.id === 6,
                        };

                        const disabledCondition = values.includes('cash')
                           ? disabledConditionMap.cash
                           : values.includes('installment_plan')
                           ? disabledConditionMap['installment_plan']
                           : values.includes('mortgage_approval_bank')
                           ? disabledConditionMap['mortgage_approval_bank']
                           : values.includes('mortgage_no_approval_bank')
                           ? disabledConditionMap['mortgage_no_approval_bank']
                           : disabledConditionMap.default;

                        return (
                           <Checkbox
                              className={`${styles.MultiSelectItem} ${disabledCondition ? `order-1` : ''}`}
                              key={index}
                              option={option}
                              checked={selectedOptions.find(currentOption => currentOption.value === option.value)}
                              disabled={disabledCondition}
                              onChange={event => handleCheckboxChange(event, option)}
                           />
                        );
                     })
                  ) : (
                     <>
                        {Boolean(lazyLoading && filteredOptions.length > 1000) ? (
                           <span className={styles.MultiSelectSearchEmpty}>
                              Поиск выдал более 1 000 предложений ({numberReplace(filteredOptions.length)}), измените критерии поиска или нажмите
                              кнопку "Выбрать всё"
                           </span>
                        ) : (
                           filteredOptions.map((option, index) => (
                              <Checkbox
                                 className={styles.MultiSelectItem}
                                 key={index}
                                 option={option}
                                 checked={selectedOptions.find(currentOption => currentOption.value === option.value)}
                                 onChange={event => handleCheckboxChange(event, option)}
                              />
                           ))
                        )}
                     </>
                  )}
               </>
            ) : (
               <span className={styles.MultiSelectSearchEmpty}>{searchText ? 'Поиск не дал результатов' : 'Пусто'}</span>
            )}
         </div>
      </div>
   );
};

export default LayoutBody;
