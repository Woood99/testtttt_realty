import React, { useState, useRef, useEffect, forwardRef } from 'react';

import styles from './Tabs.module.scss';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import HorizontalScrollMouse from '../HorizontalScrollMouse';

const Tabs = ({
   data = [],
   defaultValue = 0,
   children,
   bodyContentBefore,
   bodyContentAfter,
   navClassName = '',
   containerClassName = '',
   contentClassName = '',
   titleClassName = '',
   onChange = () => {},
   onInit = () => {},
   type = 'default',
}) => {
   const [activeTab, setActiveTab] = useState(defaultValue);
   const navItems = useRef([]);

   const [position, setPosition] = useState({ left: 0, width: 0 });
   useEffect(() => {
      const activeElement = navItems.current[activeTab];
      onInit(activeTab);

      if (activeElement) {
         setPosition({
            left: activeElement.offsetLeft,
            width: activeElement.offsetWidth,
         });
      }
   }, [activeTab, data]);

   useEffect(() => {
      setActiveTab(defaultValue);
   }, [defaultValue]);

   const onClickButton = (index, item) => {
      setActiveTab(index);
      onChange(index, item);
   };

   if (isEmptyArrObj(data)) return;

   return (
      <div className={containerClassName}>
         <TabsNav type={type} className={navClassName}>
            {data.map((item, index) => {
               return (
                  <div className="h-full" key={index}>
                     <TabsTitle
                        className={titleClassName}
                        type={type}
                        onChange={() => onClickButton(index, item)}
                        ref={el => (navItems.current[index] = el)}
                        value={activeTab === index}
                        count={item.count}>
                        {item.name}
                     </TabsTitle>
                  </div>
               );
            })}
            {type === 'default' && (
               <div
                  className={styles.magicLine}
                  style={{
                     left: `${position.left}px`,
                     width: `${position.width}px`,
                  }}
               />
            )}
         </TabsNav>
         <TabsBody className={contentClassName}>
            {bodyContentBefore}
            {data.map((item, index) => {
               return activeTab === index && <div key={index}>{item.body}</div>;
            })}
            {bodyContentAfter}
         </TabsBody>

         {children}
      </div>
   );
};

export const TabsNav = ({ children, type = 'default', className = '' }) => {
   return (
      <HorizontalScrollMouse
         Selector="nav"
         widthScreen={3222}
         className={`${type === 'default' ? styles.tabsNav : type === 'second' ? styles.tabsNavSecond : ''} ${className}`}>
         {children}
      </HorizontalScrollMouse>
   );
};

export const TabsTitle = forwardRef(
   ({ onChange = () => {}, value = false, type = 'default', children, border = false, count = null, className = '' }, ref) => {
      return (
         <button
            type="button"
            ref={ref}
            className={`${type === 'default' ? styles.tabsBtn : type === 'second' ? styles.tabsBtnSecond : ''} ${
               value ? (type === 'default' ? styles.tabsBtnActive : type === 'second' ? styles.tabsBtnSecondActive : '') : ''
            } ${type === 'default' && border && value ? styles.tabsBtnActiveBorder : ''} ${className}`}
            onClick={onChange}>
            {children}
            {typeof count === 'number' ? <span className="bg-count ml-2">{count}</span> : ''}
         </button>
      );
   }
);

export const TabsBody = ({ children, className = '' }) => {
   return <div className={`mt-6 ${className}`}>{children}</div>;
};

export default Tabs;
