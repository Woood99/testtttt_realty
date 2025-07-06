import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

const Accordion = ({ data, multiple = false, defaultValue = [],classNameItem='' }) => {
   const [isOpenIds, setIsOpenIds] = useState(defaultValue);
   const popupRef = useRef(null);

   const onClickHandler = id => {
      if (isOpenIds.includes(id)) {
         if (multiple) {
            setIsOpenIds(isOpenIds.filter(item => item !== id));
         } else {
            setIsOpenIds([]);
         }
      } else {
         if (multiple) {
            setIsOpenIds([...isOpenIds, id]);
         } else {
            setIsOpenIds([id]);
         }
      }
   };
   
   return (
      <>
         {data.filter(item => item).map((item, index) => {
            return (
               <div key={index} className={`${isOpenIds.includes(index) ? '_active' : ''} ${classNameItem}`}>
                  {React.cloneElement(item.button, {
                     className: `${item.button.props.className || ''} ${isOpenIds.includes(index) ? '_active' : ''}`,
                     onClick: () => onClickHandler(index),
                  })}
                  <CSSTransition nodeRef={popupRef} in={isOpenIds.includes(index)} classNames="_open-select" timeout={200} unmountOnExit>
                     <div ref={popupRef}>{item.body}</div>
                  </CSSTransition>
               </div>
            );
         })}
      </>
   );
};

export default Accordion;
