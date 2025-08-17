import { useSelector } from 'react-redux';
import cn from 'classnames';

import styles from './TitleIcon.module.scss';
import { getIsDesktop } from '@/redux';

const TitleIcon = ({ icon, text = '', link, className = '' }) => {
   const isDesktop = useSelector(getIsDesktop);
   return (
      <div className={cn(styles.titleIconRoot, className)}>
         <div className={styles.icon}>{icon}</div>
         <h2 className={`title-2 ${!isDesktop ? 'title-3' : ''}`}>{text}</h2>
         {isDesktop && link && (
            <a href={link.href} target="_blank" className={styles.link}>
               {link.name}
            </a>
         )}
      </div>
   );
};

export default TitleIcon;
