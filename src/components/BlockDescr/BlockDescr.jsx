import React, { useEffect, useRef, useState } from 'react';
import styles from './BlockDescr.module.scss';
import BtnShow from '../../ui/BtnShow';
import cn from 'classnames';

const BlockDescr = ({ descr, className = '', title = 'Описание' }) => {
   return (
      <div className={cn('mt-6', className)}>
         <h2 className="title-2">{title}</h2>
         <BlockDescrMore descr={descr} className={`${className} mt-4 text-defaultMax leading-6`} lines={6} />
      </div>
   );
};

export const BlockDescrMore = ({
   descr,
   className = '',
   classNameContainer = '',
   classNameBtn = '',
   btnIcon = true,
   lines = 1,
   btnText = 'Показать полностью',
}) => {
   const [isActive, setIsActive] = useState(false);
   const descrRef = useRef(null);

   const [showMore, setShowMore] = useState(false);

   useEffect(() => {
      descrRef.current.style.webkitLineClamp = 'unset';
      const fullHeight = descrRef.current.scrollHeight;

      descrRef.current.style.webkitLineClamp = lines;
      const clampedHeight = descrRef.current.clientHeight;

      setShowMore(fullHeight > clampedHeight);
   }, [descr, lines, descrRef.current]);

   return (
      <div className={classNameContainer}>
         <div ref={descrRef} className={cn(styles.BlockDescrWrapper, isActive && styles.BlockDescrWrapperActive, className)}>
            {!descr?.length ? 'Описание отсутствует...' : <GetDescrHTML data={descr} />}
         </div>
         {showMore && (
            <BtnShow className={`mt-1 relative z-10 ${classNameBtn}`} onClick={() => setIsActive(prev => !prev)} btnIcon={btnIcon} active={isActive}>
               {isActive ? 'Скрыть' : btnText}
            </BtnShow>
         )}
      </div>
   );
};

export const BlockDescrBorder = ({ descr, className = '' }) => {
   return (
      <div className={cn(styles.BlockDescrBorder, className)}>
         <GetDescrHTML data={descr} />
      </div>
   );
};

export const GetDescrHTML = ({ data, className = '', onClick = () => {} }) => {
   return <div style={{ whiteSpace: 'pre-wrap' }} className={className} dangerouslySetInnerHTML={{ __html: data }} onClick={onClick} />;
};

export default BlockDescr;
