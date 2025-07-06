import { useEffect, useState } from 'react';
import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Input from '../../uiForm/Input';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../uiForm/Button';

const detectCardType = number => {
   const num = number.replace(/\s/g, '');

   // Определяем по BIN (первые 6 цифр)
   const bin = num.substring(0, 6);

   // Сбербанк
   if (/^4276|^5469|^4279|^63900|^67758/.test(num)) return 'Сбербанк';

   // Тинькофф
   if (/^5213|^4377|^5536|^2200/.test(num)) return 'Тинькофф';

   // Альфа-Банк
   if (/^4584|^4154|^4779|^5486/.test(num)) return 'Альфа-Банк';

   // ВТБ
   if (/^4189|^4190|^4191|^4272|^4693|^4790|^4837|^4851/.test(num)) return 'ВТБ';

   // Газпромбанк
   if (/^5209|^5489|^5578|^6777/.test(num)) return 'Газпромбанк';

   // Райффайзенбанк
   if (/^4627|^4678|^4693|^5100/.test(num)) return 'Райффайзенбанк';

   // МИР (национальная платежная система)
   if (/^220[0-4]/.test(num)) return 'МИР';

   // Стандартные международные карты (если нужно оставить)
   if (/^4/.test(num)) return 'Visa';
   if (/^5[1-5]/.test(num)) return 'Mastercard';
   if (/^3[47]/.test(num)) return 'American Express';

   return '';
};

const AddBankCardModal = ({ condition, set }) => {
   const [cardType, setCardType] = useState('');
   const [submitIsLoading, setSubmitIsLoading] = useState(false);

   const {
      handleSubmit,
      control,
      watch,
      formState: { errors },
   } = useForm({
      defaultValues: {
         card_number: '',
         valid_until: '',
         cvv: '',
      },
   });

   const watchCardNumber = watch('card_number');

   useEffect(() => {
      setCardType(detectCardType(watchCardNumber));
   }, [watchCardNumber]);

   const onSubmitHandler = async data => {
      setSubmitIsLoading(true);
      const resultData = {
         ...data,
         cardType,
      };
      console.log(resultData);
   };

   return (
      <ModalWrapper condition={condition}>
         <Modal
            condition={condition}
            set={set}
            options={{
               overlayClassNames: '_center-max-content',
               modalClassNames: '!w-[560px]',
               modalContentClassNames: 'text-left',
            }}>
            <h2 className="title-2 mb-6">Добавить карту</h2>
            <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmitHandler)}>
               <div className="col-span-2">
                  <ControllerFieldInput
                     beforeText="Номер карты"
                     afterText={cardType}
                     name="card_number"
                     control={control}
                     requiredValue
                     errors={errors}
                     mask="bankCardMask"
                     size="48"
                  />
               </div>
               <ControllerFieldInput
                  beforeText="Действует до"
                  name="valid_until"
                  control={control}
                  requiredValue
                  errors={errors}
                  mask="expiryMask"
                  size="48"
               />
               <ControllerFieldInput
                  beforeText="CVV"
                  placeholder="fas"
                  name="cvv"
                  control={control}
                  requiredValue
                  errors={errors}
                  mask="cvvMask"
                  size="48"
               />

               <Button className="w-full col-span-2 mt-6">Сохранить</Button>
            </form>
         </Modal>
      </ModalWrapper>
   );
};

export default AddBankCardModal;
