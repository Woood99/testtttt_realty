import { useDispatch, useSelector } from 'react-redux';
import { getToastPrimary } from '@/redux';
import { createPortal } from 'react-dom';
import { NotificationTimer } from '../../ui/Tooltip';
import { deleteToastPrimary } from '../../redux/slices/toastPrimarySlice';

const ToastPrimary = () => {
   const { toast } = useSelector(getToastPrimary);
   const isVisible = toast?.visible;
   const dispatch = useDispatch();

   if (!isVisible) return;

   return createPortal(
      <NotificationTimer show={isVisible} onClose={() => dispatch(deleteToastPrimary(false))} classListRoot="pr-12 z-[999999999]">
         {toast.data.title && <p className="font-medium text-defaultMax">{toast.data.title}</p>}
         {toast.data.descr && <p className="mt-0.5 text-defaultMax">{toast.data.descr}</p>}
      </NotificationTimer>,
      document.getElementById('overlay-wrapper')
   );
};

export default ToastPrimary;
