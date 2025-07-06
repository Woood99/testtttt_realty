import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import cn from 'classnames';

import Button from '../../uiForm/Button';

const ToastChatContainer = () => {
   const [count, setCount] = useState(0);

   useEffect(() => {
      const activeToasts = new Set();

      const unsubscribe = toast.onChange(payload => {
         const toastId = String(payload.id);
         const toastContainerId = payload.containerId;

         if (toastContainerId !== 'chat-notifications') {
            return;
         }

         if (payload.status === 'added') {
            activeToasts.add(toastId);
         } else if (payload.status === 'removed') {
            activeToasts.delete(toastId);
         }

         setCount(activeToasts.size);
      });

      return () => unsubscribe();
   }, []);

   return (
      <>
         {count > 2 && (
            <Button
               size="Small"
               variant="secondary"
               className={cn('fixed right-4 w-[320px] z-[10000]')}
               onClick={() => {
                  toast.dismiss({ containerId: 'chat-notifications' });
                  setTimeout(() => {
                     setCount(0);
                  }, 50);
               }}
               style={{
                  bottom: `${count * 91 + 16}px`,
               }}>
               Скрыть все
            </Button>
         )}

         <ToastContainer containerId="chat-notifications" style={{ bottom: 6 }} />
      </>
   );
};

export default ToastChatContainer;
