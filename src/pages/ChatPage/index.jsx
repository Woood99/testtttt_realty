import React from 'react';
import Chat from '../../components/Chat';
import { Helmet } from 'react-helmet';
import MainLayout from '../../layouts/MainLayout';
import { useQueryParams } from '../../hooks/useQueryParams';
import { CHAT_TYPES } from '../../components/Chat/constants';
import { cleanObject } from '../../helpers/cleanObject';

const ChatPage = () => {
   const params = useQueryParams();

   const dialog_fake_params = {
      building_id: params.building_id ? +params.building_id : null,
      organization_id: params.organization_id ? +params.organization_id : null,
      recipients_id: params.recipients_id ? [+params.recipients_id] : null,
      type: CHAT_TYPES.CHAT,
   };

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Чат</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <main className="main !p-0">
            <Chat
               defaultDialogId={+params.dialog || null}
               tag={params.tag || null}
               fake_dialog={Boolean(+params.not_dialog) ? cleanObject(dialog_fake_params) : null}
            />
         </main>
      </MainLayout>
   );
};

export default ChatPage;
