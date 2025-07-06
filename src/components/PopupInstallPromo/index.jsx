import { useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';

import { getIsDesktop } from '../../redux/helpers/selectors';
import styles from './PopupInstallPromo.module.scss';
import Button from '../../uiForm/Button';

const PopupInstallPromo = () => {
   const [visible, setVisible] = useState(false);
   const [isIOS, setIsIOS] = useState(false);
   const deferredPrompt = useRef(null);
   const [closing, setClosing] = useState(false);
   const isDesktop = useSelector(getIsDesktop);

   useEffect(() => {
      const checkIOS = () => {
         const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
         const isStandalone = 'standalone' in navigator && navigator.standalone;
         setIsIOS(isAppleDevice && !isStandalone);
      };

      const handleBeforeInstallPrompt = e => {
         e.preventDefault();
         deferredPrompt.current = e;

         setTimeout(() => {
            if (!localStorage.getItem('installPromptDismissed')) {
               setVisible(true);
            }
         }, 1000);
      };

      checkIOS();
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
         window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
   }, []);

   const handleInstallClick = async () => {
      if (isIOS) {
         closePopup();
         return;
      }

      if (deferredPrompt.current) {
         try {
            await deferredPrompt.current.prompt();
            const { outcome } = await deferredPrompt.current.userChoice;
            console.log(`User ${outcome} the install prompt`);
         } catch (err) {
            console.error('Error during installation:', err);
         } finally {
            closePopup();
         }
      }
   };

   const closePopup = () => {
      setClosing(true);
      localStorage.setItem('installPromptDismissed', 'true');

      setTimeout(() => {
         setVisible(false);
         setClosing(false);
      }, 300);
   };

   if (!visible) return null;
   if (isDesktop) return;

   return (
      <div className="fixed top-0 left-0 w-full h-full bg-[rgba(70,70,70,0.55)] z-[99999]" onClick={closePopup}>
         <div className={cn(styles.InstallPopup, closing && styles.InstallPopupClosing)}>
            <div className="relative p-4">
               <button className={styles.InstallPopupClose} onClick={closePopup} aria-label="Закрыть">
                  &times;
               </button>

               <div>
                  <h3 className="text-littleBig mb-2 text-[#333]">Установите наше приложение</h3>
                  <p className="mb-4 text-[#666]">Для быстрого доступа и удобного использования</p>

                  <Button size="Small" className="w-full" onClick={handleInstallClick}>
                     {isIOS ? 'Инструкции для iOS' : 'Установить'}
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PopupInstallPromo;
