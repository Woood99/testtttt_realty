import cn from 'classnames';
import styles from './ProgressBar.module.scss';

const ProgressBar = ({ data, className }) => {
   if (!data.length) return;

   const activeIndices = data.reduce((acc, item, index) => {
      if (item.active) acc.push(index);
      return acc;
   }, []);
   const lastActiveIndex = activeIndices.length > 0 ? Math.max(...activeIndices) : -1;

   return (
      <div className={cn(className)}>
         <div className={styles.ProgressContainer}>
            <div className={styles.ProgressCircles}>
               {data.map((_, index) => (
                  <div
                     key={index}
                     className={cn(
                        styles.ProgressCircleContainer,
                        index <= lastActiveIndex && styles.ProgressCircleContainerActive,
                        index === lastActiveIndex && styles.ProgressCircleContainerLast
                     )}
                     style={{
                        left: `${index * (100 / (data.length - 1))}%`,
                        transform: 'translateX(-50%)',
                     }}>
                     <div className={styles.ProgressCircle}>{index + 1}</div>
                  </div>
               ))}
            </div>

            <div className={styles.ProgressLineContainer}>
               <div
                  className={styles.ProgressLineActive}
                  style={{
                     width: lastActiveIndex >= 0 ? `${(lastActiveIndex / (data.length - 1)) * 100}%` : '0%',
                  }}
               />
               <div className={styles.ProgressLineInactive} />
            </div>

            <div className={styles.ProgressLabels}>
               {data.map((item, index) => (
                  <span
                     key={index}
                     className={`${styles.ProgressLabel} ${index <= lastActiveIndex ? styles.ProgressLabelActive : ''}`}
                     style={{
                        left: `${index * (100 / (data.length - 1))}%`,
                        transform: 'translateX(-50%)',
                     }}>
                     {item.name}
                  </span>
               ))}
            </div>
         </div>
      </div>
   );
};

export default ProgressBar;
