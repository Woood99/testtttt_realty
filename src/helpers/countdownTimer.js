import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.locale('ru');

const countdownTimer = date => {
   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

   function calculateTimeLeft() {
      const now = dayjs();
      const difference = dayjs(date).diff(now);
      if (difference <= 0) {
         return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
         };
      }
      return {
         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
         minutes: Math.floor((difference / 1000 / 60) % 60),
         seconds: Math.floor((difference / 1000) % 60),
      };
   }

   useEffect(() => {
      const timer = setTimeout(() => {
         setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearTimeout(timer);
   });

   return timeLeft;
};

export default countdownTimer;
