import { useCookies } from 'react-cookie';
import { sendPostRequest } from './requestsApi';
import { setLikes, setUserInfo } from '../redux/slices/mainInfoSlice';
import { useDispatch } from 'react-redux';

export const useLogout = () => {
   const [, , removeCookie] = useCookies();
   const dispatch = useDispatch();

   const logout = async () => {
      try {
         await sendPostRequest(`/api/logout`);
         removeCookie('loggedIn', { path: '/' });
         removeCookie('access_token', { path: '/' });
         removeCookie('login_as_admin', { path: '/' });
         dispatch(setUserInfo({}));
         dispatch(setLikes([]));
      } catch (error) {
         console.log(error);
      }
   };

   return { logout };
};

export default useLogout;
