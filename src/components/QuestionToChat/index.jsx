import { useState } from 'react';
import cn from 'classnames';
import Tag from '../../ui/Tag';
import { IconAdd, IconSend } from '../../ui/Icons';
import { checkAuthUser } from '../../redux/helpers/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { checkDialogId, getDialogId, getUrlNavigateToChatDialog, getUrlNavigateToChatDialogFake } from '../../api/getDialogId';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';
import { sendPostRequest } from '../../api/requestsApi';
import { CHAT_TAGS } from '../../constants/chat-tags';
import Textarea from '../../uiForm/Textarea';
import { CHAT_TYPES } from '../Chat/constants';

const QuestionToChat = ({ classNames, building_id, organization_id, isSpecialist, specialist_id }) => {
   const authUser = useSelector(checkAuthUser);
   const dispatch = useDispatch();

   const [value, setValue] = useState(CHAT_TAGS[2].text);

   const goToChat = async (tag = false) => {
      if (authUser) {
         try {
            const params = {
               ...(specialist_id
                  ? { building_id, recipients_id: [specialist_id] }
                  : isSpecialist
                  ? { building_id }
                  : { building_id, organization_id }),
               type: CHAT_TYPES.CHAT,
            };

            let dialog_id = await checkDialogId(params);

            if (tag) {
               if (dialog_id) {
                  getUrlNavigateToChatDialog(dialog_id, tag);
               } else {
                  getUrlNavigateToChatDialogFake({...params,tag});
               }
            } else {
               if (!dialog_id) {
                  dialog_id = await getDialogId(params);
               }
               const formData = new FormData();
               formData.append('dialog_id', dialog_id);
               formData.append('text', value || '');

               await sendPostRequest('/api/messages/new-message', formData, {
                  'Content-Type': 'multipart/form-data',
                  'Accept-Encodin': 'gzip, deflate, br, zstd',
                  Accept: 'application/json',
               });
               getUrlNavigateToChatDialog(dialog_id);
            }

            setValue(CHAT_TAGS[2].text);
         } catch (error) {
            console.log(error);
         }
      } else {
         dispatch(setSelectAccLogModalOpen(true));
      }
   };

   return (
      <div className={cn(classNames)}>
         <h2 className="title-2 mb-5">Задайте вопрос застройщику</h2>

         <div className="flex gap-2 flex-wrap">
            {CHAT_TAGS.map((item, index) => (
               <Tag key={index} size="medium" onClick={() => goToChat(item.id)} hoverEnable>
                  <div className="flex items-center gap-2">
                     {item.title}
                     {item.icon === 'iconAdd' && <IconAdd width={15} height={15} />}
                  </div>
               </Tag>
            ))}
         </div>
         <div className="mt-4 relative">
            <Textarea placeholder="Напечатайте сообщеие" onChange={value => setValue(value)} value={value} minHeight={80} maxLength={200} />
            <button
               type="button"
               className="absolute bottom-2 right-0 px-2.5 flex-center-all self-end"
               onClick={() => {
                  if (value !== '') {
                     goToChat();
                  }
               }}>
               <IconSend width={22} height={22} />
            </button>
         </div>
      </div>
   );
};

export default QuestionToChat;
