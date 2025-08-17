import React, { useEffect, useRef } from 'react';
import styles from './Textarea.module.scss';
import { isNumber } from '@/helpers';
import { ChatSmile } from '@/components/Chat/components';

const Textarea = props => {
   const {
      className = '',
      classNameTextarea = '',
      placeholder,
      name,
      onChange = () => {},
      value = '',
      maxLength = null,
      isValid,
      children,
      minHeight = 140,
      smile = false,
   } = props;
   const textareaRef = useRef(null);
   const rootClassName = `${styles.TextareaRoot} ${className}`;

   const onChangeHandler = () => {
      onChange(textareaRef.current.value);
      textareaRef.current.style.height = '0';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
   };

   useEffect(() => {
      if (textareaRef.current) {
         textareaRef.current.style.height = '0';
         textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
   }, [textareaRef.current]);

   return (
      <div className={`${rootClassName}`} data-error={isValid ? isValid.ref.name : undefined}>
         <textarea
            ref={textareaRef}
            name={name}
            maxLength={maxLength}
            className={`${styles.TextareaWrapper} ${isValid ? styles.TextareaError : ''} ${classNameTextarea}`}
            value={value || ''}
            onChange={onChangeHandler}
            placeholder={placeholder}
            style={{ minHeight: `${isNumber(minHeight) ? `${minHeight}px` : minHeight}` }}
         />
         {smile && (
            <div className="absolute top-3 right-0">
               <ChatSmile
                  setMessageText={
                     maxLength
                        ? value.length < maxLength
                           ? value => {
                                onChange(`${textareaRef.current.value}${value}`);
                                textareaRef.current.style.height = '0';
                                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                             }
                           : () => {}
                        : value => {
                             onChange(`${textareaRef.current.value}${value}`);
                             textareaRef.current.style.height = '0';
                             textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                          }
                  }
               />
            </div>
         )}
         {children}
      </div>
   );
};

export default Textarea;
