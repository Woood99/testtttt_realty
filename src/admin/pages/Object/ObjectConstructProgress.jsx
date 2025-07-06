import React, { useState } from 'react';
import Button from '../../../uiForm/Button';
import CreateConstructProgress from './CreateConstructProgress';
import ConstructProgress from '../../../components/ConstructProgress';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';

const ObjectConstructProgress = ({
   data,
   frames,
   id,
   dataObject,
   specialists,
   authorDefault,
   tags = [],
   sending = () => {},
   sendingForm = () => {},
}) => {
   const [isOpenModal, setIsOpenModal] = useState(false);
   
   return (
      <div className="white-block mt-4">
         <h2 className="title-2 mb-6">Ход строительства</h2>
         <ConstructProgress
            data={data}
            isAdmin
            desktopLength={4}
            options={{
               frames,
               tags,
               dataObject,
               specialists,
               authorDefault,
               onUpdate: async data => {
                  await sendingForm(data || {});
               },
            }}
            sending={sending}
         />
         <Button type="button" className={`w-full ${data.length > 0 ? 'mt-6' : ''}`} onClick={() => setIsOpenModal(true)}>
            Создать
         </Button>
         <ModalWrapper condition={isOpenModal}>
            <CreateConstructProgress
               conditionModal={isOpenModal}
               setModal={setIsOpenModal}
               options={{
                  frames,
                  tags,
                  dataObject,
                  specialists,
                  authorDefault,
                  onUpdate: async data => {
                     await sendingForm(data || {});
                  },
               }}
               sending={sending}
            />
         </ModalWrapper>
      </div>
   );
};

export default ObjectConstructProgress;
