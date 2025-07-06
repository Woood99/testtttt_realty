import React from 'react';
import cn from 'classnames';
import { IconChat } from '../../ui/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthUser, getUserInfo } from '../../redux/helpers/selectors';
import { getUrlNavigateToChat } from '../../api/getDialogId';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';

const ChatBtnFixed = () => {
   const authUser = useSelector(checkAuthUser);
   const userInfo = useSelector(getUserInfo);
   const dispatch = useDispatch();

   const count = userInfo?.counts?.dialogs || 0;

   const onClickButton = () => {
      if (authUser) {
         getUrlNavigateToChat();
      } else {
         dispatch(setSelectAccLogModalOpen(true));
      }
   };

   return (
      <button type="button" onClick={onClickButton} className={cn('fixed bottom-4 right-4 flex-center-all w-14 h-14 bg-blue rounded-xl z-[9999]')}>
         {Boolean(count) && (
            <div className="bg-dark text-white rounded-full w-5 h-5 text-[12px] leading-none flex-center-all -top-2 -right-2 absolute">{count}</div>
         )}

         <IconChat width={22} height={22} className="fill-white" />
      </button>
   );
};

export default ChatBtnFixed;
