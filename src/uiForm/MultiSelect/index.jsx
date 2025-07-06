import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './MultiSelect.module.scss';

import { IconArrowY } from '../../ui/Icons';

import Modal from '../../ui/Modal';

import LayoutBody from './LayoutBody';
import getSrcImage from '../../helpers/getSrcImage';
import Avatar from '../../ui/Avatar';

const MultiSelect = ({
   options,
   onChange,
   placeholderText = 'Не выбрано',
   search = false,
   btnsActions = false,
   value = [],
   nameLabel = '',
   isValid,
   searchLabel = 'Поиск по названию',
   calcProp = false,
   lazyLoading = false,
   onClose = () => {},
   disabled = false,
}) => {
   const [isOpen, setIsOpen] = useState(false);
   const [searchText, setSearchText] = useState('');

   const popupRef = useRef(null);
   const dropdownRef = useRef(null);

   useEffect(() => {
      const handleDocumentClick = event => {
         if (window.innerWidth <= 1222) return;
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
            if (isOpen) {
               onClose();
            }
         }
      };

      document.addEventListener('click', handleDocumentClick, {
         capture: true,
      });

      return () => {
         document.removeEventListener('click', handleDocumentClick, {
            capture: true,
         });
      };
   }, [isOpen]);

   const [selectedOptions, setSelectedOptions] = useState(value);

   useEffect(() => {
      setSelectedOptions(value);
   }, [value]);

   const handlerToggle = () => {
      if (isOpen === false) {
         setSearchText('');
      } else {
         onClose();
      }

      setIsOpen(!isOpen);
   };

   return (
      <div
         ref={dropdownRef}
         className={`${styles.MultiSelectRoot} ${isOpen ? styles.MultiSelectRootActive : ''}`}
         data-error={isValid ? isValid.ref.name : undefined}>
         <button
            type="button"
            onClick={handlerToggle}
            className={`${styles.MultiSelectButton} ${isValid ? styles.MultiSelectButtonError : ''} ${
               disabled ? styles.MultiSelectButtonDisabled : ''
            }`}>
            <div className={`${nameLabel ? styles.MultiSelectButtonWrapper : ''} overflow-hidden`}>
               {nameLabel && (
                  <div className={`${styles.MultiSelectNameLabel} ${selectedOptions.length > 0 ? styles.MultiSelectNameLabelActive : ''}`}>
                     {nameLabel}
                  </div>
               )}
               <div
                  className={`${styles.MultiSelectPlaceholder} ${selectedOptions.length === 0 ? styles.MultiSelectPlaceholderNone : ''} ${
                     nameLabel ? 'ml-4' : ''
                  }`}>
                  {selectedOptions.length > 0
                     ? selectedOptions.map((item, index) => (
                          <span className={styles.MultiSelectPlaceholderItem} key={index}>
                             {item.image && (
                                <>
                                   {item.image === 'default' ? (
                                      <Avatar src={''} title={item.label} size={20} className="max-h-5 inline-block mr-2 -mb-1" />
                                   ) : (
                                      <Avatar src={item.image} title={item.label} size={20} className="max-h-5 inline-block mr-2 -mb-1" />
                                   )}
                                </>
                             )}
                             {item.label}
                          </span>
                       ))
                     : placeholderText}
               </div>
            </div>
            <IconArrowY className={styles.MultiSelectCheck} />
         </button>
         {!disabled && (
            <>
               {window.innerWidth > 1222 ? (
                  <CSSTransition nodeRef={popupRef} in={isOpen} classNames="_open-select" timeout={200} unmountOnExit>
                     <div ref={popupRef} className={styles.MultiSelectDropdown}>
                        <LayoutBody
                           options={options}
                           searchText={searchText}
                           setSearchText={setSearchText}
                           selectedOptions={selectedOptions}
                           onChange={onChange}
                           setSelectedOptions={setSelectedOptions}
                           handlerToggle={handlerToggle}
                           search={search}
                           btnsActions={btnsActions}
                           searchLabel={searchLabel}
                           calcProp={calcProp}
                           lazyLoading={lazyLoading}
                        />
                     </div>
                  </CSSTransition>
               ) : (
                  <Modal
                     options={{ overlayClassNames: '_full _bottom', modalContentClassNames: styles.MultiSelectModal }}
                     set={setIsOpen}
                     condition={isOpen}
                     closeBtn={false}>
                     <LayoutBody
                        options={options}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        selectedOptions={selectedOptions}
                        onChange={onChange}
                        setSelectedOptions={setSelectedOptions}
                        handlerToggle={handlerToggle}
                        search={search}
                        btnsActions={btnsActions}
                        calcProp={calcProp}
                        lazyLoading={lazyLoading}
                     />
                  </Modal>
               )}
            </>
         )}
      </div>
   );
};

export default MultiSelect;
