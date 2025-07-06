import React, { useState } from 'react';
import { NotificationTimer } from '../../ui/Tooltip';
import { createPortal } from 'react-dom';
import Button from '../../uiForm/Button';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../constants/RoutesPath';

const CookieBlock = () => {
   const [cookieBlockVisible, setCookieBlockVisible] = useState(localStorage.getItem('cookie_accept'));
   if (cookieBlockVisible) {
      return;
   }

   return createPortal(
      <NotificationTimer show={cookieBlockVisible} classListRoot="max-w-[360px]" position="bottom-right" color="white" visibleProgressBar={false}>
         <h3 className="font-medium text-defaultMax">
            Мы используем cookies, чтобы сайт работал лучше. А ещё{' '}
            <Link to={RoutesPath.privacyPolicy} target='_blank' className="blue-link-hover _active inline">
               применяем рекомендательные технологии
            </Link>
         </h3>
         <Button
            className="mt-3"
            size="Small"
            onClick={() => {
               localStorage.setItem('cookie_accept', true);
               setCookieBlockVisible(true);
            }}>
            Принять
         </Button>
      </NotificationTimer>,
      document.getElementById('overlay-wrapper')
   );
};

export default CookieBlock;
