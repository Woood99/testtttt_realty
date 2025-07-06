import React from 'react';
import Button from '../../uiForm/Button';

const ErrorLoading = () => {
   return (
      <div className='flex flex-col items-center'>
         <h1 className="title-2">Не удалось загрузить данные</h1>
         <p className="mt-2 text-primary400">Попробуйте ещё раз</p>
         <Button
            className="mt-6"
            onClick={() => {
               window.location.reload();
            }}>
            Обновить
         </Button>
      </div>
   );
};

export default ErrorLoading;
