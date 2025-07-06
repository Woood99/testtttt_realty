import { useEffect, useState } from 'react';
import isString from '../helpers/isString';

export const useToggleNotification = (name, maxCount = 5,check = false,) => {
   if (!isString(name)) return;

   const [isVisibleNotification, setIsVisibleNotification] = useState(false);

   useEffect(() => {
      const auth_notif_status = localStorage.getItem(name);
      if (check) {
         localStorage.removeItem(name);
         return;
      }
      if (!auth_notif_status && auth_notif_status !== 0) {
         setIsVisibleNotification(true);
      }
      if (+auth_notif_status > 0) {
         localStorage.setItem(name, +localStorage.getItem(name) - 1);
         setIsVisibleNotification(false);
      } else {
         setIsVisibleNotification(true);
      }
   }, []);

   const onClose = () => {
      localStorage.setItem(name, maxCount);
   };

   return { isVisibleNotification, setIsVisibleNotification, onClose };
};
