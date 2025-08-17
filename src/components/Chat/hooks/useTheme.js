import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthRoutesPath, RoutesPath } from '../../../constants/RoutesPath';

export const useTheme = () => {
   const [theme, setTheme] = useState(localStorage.getItem('chat-theme') || 'light');
   const location = useLocation();

   useEffect(() => {
      if (location.pathname === RoutesPath.chat) {
         document.documentElement.setAttribute('data-theme', theme);
      }
   }, [theme]);

   const toggleTheme = () => {
      const current = theme === 'light' ? 'dark' : 'light';
      setTheme(current);

      localStorage.setItem('chat-theme', current);
   };

   return { theme, toggleTheme };
};
