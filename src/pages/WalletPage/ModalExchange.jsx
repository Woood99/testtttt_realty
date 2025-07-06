import { useState } from 'react';
import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Input from '../../uiForm/Input';
import FieldRow from '../../uiForm/FieldRow';
import { stringToNumber } from '../../helpers/changeString';
import numberReplace from '../../helpers/numberReplace';
import Button from '../../uiForm/Button';

const ModalExchange = ({ condition, set }) => {
   const [valueFrom, setValueFrom] = useState('');
   const [valueTo, setValueTo] = useState('');

   const POINT_TO_RUBLE_RATE = 0.8;
   const RUBLE_TO_POINT_RATE = 1 / POINT_TO_RUBLE_RATE;

   return (
      <ModalWrapper condition={condition}>
         <Modal
            condition={condition}
            set={set}
            options={{
               overlayClassNames: '_center-max-content',
               modalClassNames: '!w-[560px]',
            }}>
            <h2 className="title-2 mb-8 text-center">Обмен</h2>
            <div className="flex flex-col gap-6">
               <FieldRow name="Вы платите" col widthChildren={400} classNameName="font-medium">
                  <Input
                     label="Сумма"
                     size="48"
                     placeholder="0"
                     after="Баллов"
                     value={valueFrom}
                     onChange={value => {
                        setValueFrom(value);
                        setValueTo(numberReplace(stringToNumber(value) * POINT_TO_RUBLE_RATE || ''));
                     }}
                     onlyNumber
                     convertNumber
                     maxLength={8}
                  />
               </FieldRow>
               <FieldRow name="Вы получите" col widthChildren={400} classNameName="font-medium">
                  <Input
                     label="Сумма"
                     size="48"
                     placeholder="0"
                     after="₽"
                     value={valueTo}
                     onChange={value => {
                        setValueTo(value);
                        setValueFrom(numberReplace(stringToNumber(value) * RUBLE_TO_POINT_RATE || ''));
                     }}
                     onlyNumber
                     convertNumber
                     maxLength={8}
                  />
               </FieldRow>
            </div>

            <p className="mt-10 text-primary400 text-center font-medium">1 балл = 0.8 ₽</p>
            <Button className="mt-3 w-full">Обменять</Button>
         </Modal>
      </ModalWrapper>
   );
};

export default ModalExchange;
