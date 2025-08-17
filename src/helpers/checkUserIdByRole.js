import { getUserInfo } from '@/redux';
import { store } from '@/redux/store';

export const checkUserIdByRole = id => {
   const userInfo = getUserInfo(store.getState());

   return id === userInfo?.role?.id;
};
