import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';

const ModalPointsHelp = ({ condition, set }) => {
   return (
      <ModalWrapper condition={condition}>
         <Modal
            condition={condition}
            set={set}
            options={{
               overlayClassNames: '_right',
               modalClassNames: 'mmd1:!max-w-[560px]',
            }}>
            <h2 className="title-2 mb-6">Как получать и использовать баллы</h2>
            <div className="flex flex-col gap-4">
               <div className="bg-primary700 rounded-[20px] p-5">
                  <h3 className="title-3 mb-2">1. Получение баллов:</h3>
                  <ul className="list-disc ml-5 mb-3">
                     <li>При покупке недвижимости начисляется кешбэк в виде баллов.</li>
                     <li>1 балл эквивалентен 0.8 рублям.</li>
                  </ul>
               </div>
               <div className="bg-primary700 rounded-[20px] p-5">
                  <h3 className="title-3 mb-2">2. Использование баллов:</h3>

                  <ul className="list-disc ml-5 mb-3">
                     <li>Баллы можно обменять на рубли в кошельке и получить их на карту.</li>
                     <li>Баллы можно использовать для покрытия стоимости покупки квартиры, парковки или кладовки.</li>
                     <li>Баллы можно использовать как первоначальный взнос при покупке недвижимости.</li>
                     <li>Баллы можно использовать для доната менеджеру отдела продаж.</li>
                  </ul>
               </div>
               <div className="bg-primary700 rounded-[20px] p-5">
                  <h3 className="title-3 mb-2">3. Срок действия баллов:</h3>
                  <ul className="list-disc ml-5 mb-3">
                     <li>Баллы хранятся в течение одного года.</li>
                     <li>По истечении года неиспользованные баллы сгорают.</li>
                  </ul>
               </div>

               <div className="bg-primary700 rounded-[20px] p-5">
                  <h3 className="title-3 mb-2">4. Минимальное и максимальное использование:</h3>
                  <ul className="list-disc ml-5 mb-3">
                     <li>Можно использовать как один балл, так и все накопленные баллы сразу.</li>
                  </ul>
               </div>
               <div className="bg-primary700 rounded-[20px] p-5">
                  <h3 className="title-3 mb-2">5. Обмен баллов на рубли:</h3>

                  <ul className="list-disc ml-5 mb-3">
                     <li>Обмен баллов на рубли осуществляется в кошельке.</li>
                     <li>После обмена баллы переводятся на банковскую карту.</li>
                  </ul>
               </div>
               <div className="bg-primary700 rounded-[20px] p-5">
                  <h3 className="title-3 mb-2">6. Сгорание баллов:</h3>

                  <ul className="list-disc ml-5 mb-3">
                     <li>Если баллы не были использованы в течение года, они автоматически сгорают.</li>
                  </ul>
               </div>
               <div className="bg-primary700 rounded-[20px] p-5">
                  <h3 className="title-3 mb-2">7. Информация о балансе:</h3>

                  <ul className="list-disc ml-5 mb-3">
                     <li>Информация о количестве накопленных баллов доступна в личном кабинете на сайте inrut.ru</li>
                  </ul>
               </div>
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default ModalPointsHelp;
