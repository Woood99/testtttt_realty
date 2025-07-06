import { useState } from 'react';
import { useDebounceEffect } from 'ahooks';
import cn from 'classnames';
import Modal from '../../../../ui/Modal';
import Input from '../../../../uiForm/Input';
import UserInfo from '../../../../ui/UserInfo';
import { IconChecked } from '../../../../ui/Icons';
import { sendPostRequest } from '../../../../api/requestsApi';

const ChatModalSearchDialogs = ({ condition, set, options = {}, selectedType = '', onChange = () => {} }) => {
   const { title = 'Добавить' } = options;

   const [dialogs, setDialogs] = useState([]);
   const [selectedDialogs, setSelectedDialogs] = useState([]);
   const [search, setSearch] = useState('');

   useDebounceEffect(
      () => {
         handleSearchFetchData(search);
      },
      [search],
      { wait: 400 }
   );

   const handleSearchFetchData = async search => {
      try {
         if (selectedType === 'add_to_dialog') {
            const {
               data: { result },
            } = await sendPostRequest(`/api/dialogs/${condition}/user/all`, { search });
            setDialogs(result);
         }
         if (selectedType === 'single') {
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Modal
         condition={condition}
         set={set}
         options={{
            overlayClassNames: '_center-max-content-desktop',
            modalClassNames: 'mmd1:!w-[400px] mmd1:!h-[700px] flex-col',
            modalContentClassNames: '!py-8 !pb-4 !px-0',
         }}
         ModalFooter={() => (
            <div className="ModalFooter !gap-4">
               <button type="button" onClick={() => set(null)} className="blue-link">
                  {selectedType === 'single' ? 'Отменить' : 'Пропустить'}
               </button>
               {selectedType === 'add_to_dialog' && (
                  <button
                     type="button"
                     onClick={() => {
                        onChange(condition, selectedDialogs);
                        set(null);
                     }}
                     className="blue-link">
                     Добавить
                  </button>
               )}
            </div>
         )}>
         <div className="px-8">
            <h2 className="title-2-5 mb-4">{title}</h2>
            <Input placeholder="Поиск" search value={search} onChange={value => setSearch(value)} />
         </div>
         <div className="mt-4">
            {dialogs.length > 0 ? (
               <div className="flex flex-col">
                  {dialogs.map(item => {
                     return (
                        <button
                           key={item.id}
                           type="button"
                           disabled={item.is_member}
                           className={cn('flex justify-between items-center gap-4 hover:bg-hoverPrimary', item.is_member && 'pointer-events-none')}
                           onClick={() => {
                              if (item.is_member) return;
                              if (selectedType === 'single') {
                                 onChange(condition, item.id);
                                 set(null);
                              }
                              if (selectedType === 'add_to_dialog') {
                                 if (selectedDialogs.includes(item.id)) {
                                    setSelectedDialogs(prev => prev.filter(id => id !== item.id));
                                 } else {
                                    setSelectedDialogs(prev => [...prev, item.id]);
                                 }
                              }
                           }}>
                           <UserInfo
                              sizeAvatar={45}
                              avatar={item.image}
                              name={`${item.name || ''} ${item.surname || ''}`}
                              className="text-left w-full py-3 px-8 items-center"
                              centered
                           />
                           {Boolean(item.is_member) && (
                              <div className="bg-primary400 opacity-50 w-5 h-5 rounded-full flex-center-all flex-shrink-0 mr-8" aria-hidden>
                                 <IconChecked className="fill-none stroke-white" width={10} height={10} />
                              </div>
                           )}
                           {selectedDialogs.includes(item.id) && (
                              <div className="bg-blue w-5 h-5 rounded-full flex-center-all flex-shrink-0 mr-8" aria-hidden>
                                 <IconChecked className="fill-none stroke-white" width={10} height={10} />
                              </div>
                           )}
                        </button>
                     );
                  })}
               </div>
            ) : (
               <p className="text-primary400 text-center">Чаты не найдены</p>
            )}
         </div>
      </Modal>
   );
};

export default ChatModalSearchDialogs;
