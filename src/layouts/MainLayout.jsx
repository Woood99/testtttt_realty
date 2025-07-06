import React from 'react';
import cn from 'classnames';

const MainLayout = ({ children, helmet, className = '' }) => {
   return (
      <>
         {helmet}
         <div className={cn('site-container', className)}>
            {children}
            <footer className="visually-hidden">Недвижимость на inrut.ru</footer>
         </div>
      </>
   );
};

export default MainLayout;
