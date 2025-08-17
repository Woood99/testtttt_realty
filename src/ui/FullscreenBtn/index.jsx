import React from 'react';
import cn from 'classnames';
import styles from './FullscreenBtn.module.scss';
import { IconFullscreen } from '../Icons';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '@/redux';

const FullscreenBtn = props => {
   const isDesktop = useSelector(getIsDesktop);
   if (!isDesktop) return;
   
   return (
      <div {...props} className={cn(styles.FullscreenBtnRoot, props.variant === 'dark' && styles.FullscreenBtnDark,props.className)}>
         <IconFullscreen className={cn(props.variant === 'dark' && '!fill-white')} />
      </div>
   );
};

export default FullscreenBtn;
