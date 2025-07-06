import React, { useContext } from 'react';
import { SpecialistPageContext } from '../../../context';
import { capitalizeWords } from '../../../helpers/changeString';
import Button from '../../../uiForm/Button';

const SpecialistPageSidebar = () => {
   const { data, goToChat } = useContext(SpecialistPageContext);

   return (
      <div className="flex flex-col text-center items-center">
         <span className="text-primary400 mb-3">Менеджер отдела продаж</span>
         <span className="font-medium mb-1.5">{capitalizeWords(data.name, data.surname)}</span>
         <span className="text-primary400">{data.lastSeenOnline}</span>
         <div className="mt-5 flex flex-col gap-2 w-full">
            <Button onClick={goToChat}>Задать вопрос в чат</Button>
         </div>
      </div>
   );
};

export default SpecialistPageSidebar;
