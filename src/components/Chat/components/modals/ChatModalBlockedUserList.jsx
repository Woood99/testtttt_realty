import { useContext, useEffect } from 'react';
import Modal from '../../../../ui/Modal';
import { ChatContext } from '../../../../context';
import Avatar from '../../../../ui/Avatar';
import { capitalizeWords } from '../../../../helpers/changeString';
import RepeatContent from '../../../RepeatContent';
import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import { CHAT_TYPES } from '../../constants';

const ChatModalBlockedUserList = ({ condition, set }) => {
   const { blockUserOptins, setCurrentDialog, setDialogs } = useContext(ChatContext);
   const { isLoading, blockUsersList, blockUsersGetAll, blockUserDelete } = blockUserOptins;

   useEffect(() => {
      const fetchData = async () => {
         try {
            await blockUsersGetAll();
         } catch (error) {}
      };

      fetchData();
   }, []);

   return (
      <Modal
         condition={condition}
         set={set}
         options={{
            overlayClassNames: '_center-max-content-desktop',
            modalClassNames: 'mmd1:!w-[400px] mmd1:!h-[700px] flex-col',
            modalContentClassNames: '!py-8 !pb-4 !px-0',
         }}>
         <div className="px-6">
            <h2 className="title-2-5 mb-4">Заблокированные пользователи</h2>
         </div>
         {isLoading ? (
            <RepeatContent count={8}>
               <div className="px-6 py-2 flex items-center gap-3">
                  <WebSkeleton className="w-10 h-10 rounded-full" />
                  <WebSkeleton className="w-3/4 h-8 rounded-xl" />
               </div>
            </RepeatContent>
         ) : (
            <>
               {blockUsersList.length ? (
                  <div className="flex flex-col">
                     {blockUsersList.map(item => {
                        return (
                           <div type="button" key={item.id} className="relative py-2 px-6 flex gap-3 items-center" onClick={() => {}}>
                              <Avatar size={40} src={item.user.image} title={item.user.name} />
                              <h3 className="title-4 cut-one">{capitalizeWords(item.user.name, item.user.surname)}</h3>
                              <button
                                 type="button"
                                 className="blue-link ml-auto"
                                 onClick={async () => {
                                    await blockUserDelete(item.user.id);
                                    setCurrentDialog(prev => {
                                       if (prev.companions.find(i => i.id === item.user.id)) {
                                          return { ...prev, my_block: false };
                                       }
                                       return prev;
                                    });
                                    setDialogs(prev => {
                                       return prev.map(i => {
                                          if (i.companions.find(i => i.id === item.user.id) && i.dialog_type === CHAT_TYPES.CHAT) {
                                             return { ...i, my_block: false };
                                          }
                                          return i;
                                       });
                                    });
                                    blockUsersGetAll();
                                 }}>
                                 Разблокировать
                              </button>
                           </div>
                        );
                     })}
                  </div>
               ) : (
                  <div className="px-6 text-primary400 text-center mt-8">Нет заблокированных пользователей</div>
               )}
            </>
         )}
      </Modal>
   );
};

export default ChatModalBlockedUserList;
