import React, { useState } from 'react';
import Button from '../../uiForm/Button';
import Modal from '../../ui/Modal';
import { isObject } from '../../helpers/isEmptyArrObj';

const DeleteModal = ({ condition, set, request = null, title = 'Вы действительно хотите удалить?', descr = 'Это действие необратимо' }) => {
   const [isLoading, setIsLoading] = useState(false);

   const deleteHandler = () => {
      setIsLoading(true);
      if (!request) {
         console.error('request empty');
         return;
      }

      if (!Number(condition) && !isObject(condition)) return;
      request(condition);
   };
   return (
      <Modal condition={Boolean(condition)} set={set} options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[700px]' }}>
         <div className="text-center">
            <h2 className="title-2">{title}</h2>
            <p className="mt-2">{descr}</p>
            <div className="mt-8 grid grid-cols-2 gap-2">
               <Button onClick={() => set(false)}>Нет</Button>
               <Button isLoading={isLoading} onClick={deleteHandler}>Да</Button>
            </div>
         </div>
      </Modal>
   );
};

export default DeleteModal;
