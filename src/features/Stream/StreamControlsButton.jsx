import cn from 'classnames';

import styles from './Stream.module.scss';

const StreamControlsButton = ({ children, childrenText, onClick = () => {}, className, active = false, variant = 'primary' }) => {
   const activeClassPrimary = variant === 'primary' && active && '!bg-[#a8c7fa]';
   const activeClassRed = variant === 'red' && active && '!bg-[#f9dedc]';

   return (
      <button type="button" onClick={onClick} className="flex flex-col gap-2 items-center">
         <div className={cn(styles.actionBtn, activeClassPrimary, activeClassRed, className)}>{children}</div>
         <span className="text-dark text-small leading-none">{active ? childrenText[1] : childrenText[0]}</span>
      </button>
   );
};

export default StreamControlsButton;
