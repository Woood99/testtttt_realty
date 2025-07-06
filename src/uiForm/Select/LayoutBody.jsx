import styles from './Select.module.scss';

import Input from '../Input';
import { IconClose } from '../../ui/Icons';
import Avatar from '../../ui/Avatar';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import Checkbox from '../Checkbox';
import { useEffect, useRef } from 'react';

export const LayoutBody = ({
   options,
   value,
   onChange,
   handlerToggle = () => {},
   searchText,
   setSearchText,
   search = false,
   defaultOption,
   searchLabel,
   placeholderName,
}) => {
   const filteredOptions = options.filter(option => {
      if (!option.label) return;
      return option.label.toLowerCase().includes(searchText.toLowerCase());
   });

   const searchHandler = value => {
      setSearchText(value);
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
         <button type="button" onClick={handlerToggle} className={styles.SelectClose}>
            <IconClose />
         </button>
         {search && (
            <div className={styles.SelectSearch}>
               <Input size="48" placeholder={searchLabel} value={searchText} onChange={searchHandler} search refInput={searchRef} />
            </div>
         )}
         <div className={`${styles.SelectDropdownList} scrollbarPrimary`}>
            {defaultOption && (
               <button
                  type="button"
                  onClick={() => onChange({})}
                  className={`${styles.SelectDropdownItem} ${isEmptyArrObj(value) ? styles.SelectDropdownItemActive : ''}`}>
                  {placeholderName}
               </button>
            )}
            {filteredOptions.length > 0 ? (
               filteredOptions.map((option, index) => {
                  return (
                     <button
                        type="button"
                        key={index}
                        onClick={() => onChange(option)}
                        className={`${styles.SelectDropdownItem} ${value.value === option.value ? styles.SelectDropdownItemActive : ''} ${
                           option.avatar ? '!min-h-14' : ''
                        }`}>
                        {Boolean(option.avatar) && <Avatar src={option.avatar} size="32" className="mr-4" />}
                        {option.label}
                     </button>
                  );
               })
            ) : (
               <>
                  {Boolean(!defaultOption || search) && (
                     <span className={styles.SelectSearchEmpty}>{searchText ? 'Поиск не дал результатов' : 'Пусто'}</span>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

export const DropdownInputsLayoutBody = ({ handlerToggle, options, value, onChange }) => {
   return (
      <div>
         <button type="button" onClick={handlerToggle} className={styles.SelectClose}>
            <IconClose />
         </button>
         <div className={`${styles.SelectDropdownList} scrollbarPrimary px-8 pb-6 flex flex-col gap-8 !max-h-none`}>
            {options.map((item, index) => {
               return (
                  <label key={index}>
                     <span className="text-primary400 mb-2 block">{item.title}</span>
                     <div className="flex items-center">
                        <Checkbox onChange={e => onChange(e.target.checked, item.id, 'checkbox')} checked={value.id === item.id} />
                        <div className="flex-grow ml-2">
                           <Input
                              before={item.before}
                              after={item.after}
                              convertNumber
                              onlyNumber
                              maxLength={item.maxLength}
                              onChange={value => onChange(value, item.id, 'value')}
                              disabled={`${value.id !== item.id ? 'pointer-events-none' : ''}`}
                              value={value.id === item.id ? value.value : ''}
                           />
                        </div>
                     </div>
                  </label>
               );
            })}
         </div>
      </div>
   );
};
