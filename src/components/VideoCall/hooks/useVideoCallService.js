import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';

export const useVideoCallService = options => {
   const { authuserid, currentDialog, reset } = options;

   const getDialog = async id => {
      const {
         data: { result },
      } = await getDataRequest('/api/dialogs');
      return result.find(item => item.id === +id) || null;
   };

   const endCall = async () => {
      await sendPostRequest('/api/video/cancel-call', {
         user_to_cancel: authuserid,
         dialog_id: currentDialog.id,
      });
      reset();
   };

   const cancelCall = async () => {
      await sendPostRequest('/api/video/cancel-call', {
         user_to_cancel: currentDialog.companion.id,
         dialog_id: currentDialog.id,
      });
      reset();
   };

   return { getDialog, endCall, cancelCall };
};
