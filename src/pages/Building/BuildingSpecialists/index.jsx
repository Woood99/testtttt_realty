import React from 'react';
import Specialist from '../../../ui/Specialist';
import { useNavigateToChat } from '../../../hooks/useNavigateToChat';
import { getDialogId, getUrlNavigateToChatDialog } from '../../../api/getDialogId';
import { CHAT_TYPES } from '../../../components/Chat/constants';

const BuildingSpecialists = ({
   specialists,
   title = 'Менеджеры застройщика',
   descr = 'Напишите застройщику в чат, он подробно ответит на ваши вопросы',
   building_id = null,
   block = true,
   toChat = false,
   toCall = false,
}) => {
   if (specialists.length === 0) return;

   const navigateToChat = useNavigateToChat();

   return (
      <div className={`${block ? 'white-block' : ''}`}>
         <h2 className="title-2 mb-4">{title}</h2>
         {descr && <p className="bg-primary700 px-4 py-3 rounded-lg mmd1:w-max">{descr}</p>}
         <div className="mt-4 grid grid-cols-3 gap-4 md2:grid-cols-2">
            {specialists.map((item, index) => {
               return (
                  <Specialist
                     key={index}
                     {...item}
                     link
                     visibleChat
                     onClickChat={async () => {
                        if (toChat) {
                           await navigateToChat({ building_id, recipients_id: [item.id] });
                        }
                        if (toCall) {
                           const dialog_id = await getDialogId({
                              type: CHAT_TYPES.CHAT,
                              building_id,
                              recipients_id: [item.id],
                           });
                           getUrlNavigateToChatDialog(dialog_id, null, true);
                        }
                     }}
                  />
               );
            })}
         </div>
      </div>
   );
};

export default BuildingSpecialists;
