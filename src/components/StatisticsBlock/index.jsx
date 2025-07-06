import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import stylesComponent from './StatisticsBlock.module.scss';

import { usePopper } from 'react-popper';

import dayjs from 'dayjs';

export const StatisticsBlock = ({ children, height = 200 }) => {
   return (
      <div className={stylesComponent.StatisticsBlockRoot}>
         <div className={stylesComponent.StatisticsBlockWrapper} style={{ height: `${height}px` }}>
            <div className={stylesComponent.StatisticsBlockItems}>{children}</div>
         </div>
      </div>
   );
};

export const StatisticsCols = ({ data = [], maxHeight = '50' }) => {
   if (data.length === 0) return;

   const maxValue = data.reduce((max, obj) => (obj.value > max ? obj.value : max), data[0].value);
   
   return data.map((item, index) => {
      const currentPrc = `${item.value === maxValue ? maxHeight : `${((item.value / maxValue) * 100) / (100 / maxHeight)}`}`;
      
      const [referenceEl, setReferenceEl] = useState(null);
      const [popperEl, setPopperEl] = useState(null);
      const [showPopper, setShowPopper] = useState(false);
      const { styles, attributes } = usePopper(referenceEl, popperEl, {
         placement: 'auto-start',
         modifiers: [
            {
               name: 'offset',
               options: {
                  offset: [0, 5],
               },
            },
         ],
      });

      return (
         <div
            ref={setReferenceEl}
            onMouseEnter={() => setShowPopper(true)}
            onMouseLeave={() => setShowPopper(false)}
            key={index}
            className={`${stylesComponent.StatisticsColRoot} ${showPopper ? stylesComponent.StatisticsColRootActive : ''}`}
            style={{
               '--height-body': currentPrc <= 10 ? '10%' : `${currentPrc}%`,
            }}>
            {showPopper &&
               createPortal(
                  <div className="z-10" ref={setPopperEl} style={styles.popper} {...attributes.popper}>
                     {item.tooltipBody}
                  </div>,
                  document.getElementById('overlay-wrapper')
               )}
            {item.body}
         </div>
      );
   });
};

export const StatisticsCol = ({ value = 0, date }) => {
   return (
      <>
         <div className={stylesComponent.StatisticsColBody} data-value={value} />
         <div className={stylesComponent.StatisticsColDate}>{dayjs(date).format('DD MMM')}</div>
      </>
   );
};
