import React from 'react';

import styles from './FieldRow.module.scss';
import cn from 'classnames';
import { Tooltip } from '../../ui/Tooltip';
import { IconInfoTooltip } from '../../ui/Icons';

const FieldRow = ({
   name = '',
   widthName = 180,
   widthChildren = 300,
   children,
   className = '',
   classNameName = '',
   classNameChildren = '',
   col = false,
   fontWeight = 'normal',
   infoTooltip,
}) => {
   const widthStyles = {
      '--width-name': `${widthName}px`,
      '--width-children': `${widthChildren}px`,
   };
   return (
      <div className={cn(styles.FieldRowRoot, className, col && styles.FieldRowRootCol)} style={widthStyles}>
         <div className={cn(styles.FieldRowName, classNameName, fontWeight === 'medium' ? 'font-medium' : '')}>
            {name}
            {infoTooltip && (
               <Tooltip
                  mobile
                  ElementTarget={() => <IconInfoTooltip width={16} height={16} />}
                  classNameTarget="h-4 mt-1"
                  classNameContent="mmd1:!p-6"
                  placement="right"
                  offset={[10, 0]}>
                  <div>{infoTooltip}</div>
               </Tooltip>
            )}
         </div>
         <div className={cn(styles.FieldRowChildren, classNameChildren)}>{children}</div>
      </div>
   );
};

export default FieldRow;
