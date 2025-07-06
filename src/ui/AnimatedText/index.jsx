import { useEffect, useState } from 'react';
import styles from './AnimatedText.module.scss';

const AnimatedText = ({ texts = [], intervalTime = 3000 }) => {
   if (!texts?.length) return;

   const [currentIndex, setCurrentIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentIndex(prevIndex => (prevIndex + 1) % texts.length);
      }, intervalTime);

      return () => clearInterval(interval);
   }, [texts.length, intervalTime]);

   return (
      <span className={styles.AnimatedText} style={{ animationDuration: `${intervalTime}ms` }} key={currentIndex}>
         {texts[currentIndex]}
      </span>
   );
};

export default AnimatedText;
