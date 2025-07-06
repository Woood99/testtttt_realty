import React, { useState } from 'react';
import ObjectAdvantagesAdd from './ObjectAdvantagesAdd';
import Button from '../../../../uiForm/Button';
import ModalWrapper from '../../../../ui/Modal/ModalWrapper';

const ObjectAdvantages = ({ data, frames }) => {
   const [isOpenModal, setIsOpenModal] = useState(false);
   return (
      <>
         <Button type="button" size="Small" onClick={() => setIsOpenModal(true)}>
            Добавить теги/уникальные преимущества
         </Button>
         <ModalWrapper condition={isOpenModal}>
            <ObjectAdvantagesAdd
               conditionModal={isOpenModal}
               setModal={setIsOpenModal}
               mainData={data}
               frames={frames}
               advantages={data.advantages}
               tags={data.tags}
            />
         </ModalWrapper>
      </>
   );
};

export default ObjectAdvantages;
