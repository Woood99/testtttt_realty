import React, { useContext } from 'react';
import Tag, { TagCashback, TagPresent, TagTop } from '../../../ui/Tag';
import numberReplace from '../../../helpers/numberReplace';
import Button from '../../../uiForm/Button';
import MetroItems from '../../../ui/MetroItems';
import { BuildingContext } from '../../../context';
import { ROLE_BUYER } from '../../../constants/roles';
import AnimatedText from '../../../ui/AnimatedText';

const ModalSidebar = ({ setIsOpenRecordView }) => {
   const { cashback, present, tags, minPrice, minPricePerMeter, title, address, metro, max_price, stickers, goToChat, userRole } =
      useContext(BuildingContext);

   return (
      <div>
         {Boolean(cashback || present || stickers.length) && (
            <div className="flex gap-2 flex-wrap">
               {cashback && max_price ? <TagCashback cashback={(max_price / 100) * cashback} /> : ''}
               {present && <TagPresent present={present} />}
               {Boolean(stickers.length) && stickers.map(item => <TagTop top={item.name} key={item.id} />)}
            </div>
         )}
         {tags.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
               {tags.map((item, index) => (
                  <Tag size="small" color="default" key={index}>
                     {item.name}
                  </Tag>
               ))}
            </div>
         )}
         <h3 className="mt-4 mb-2 title-4">{title}</h3>
         <p>{address}</p>
         <MetroItems data={metro} visibleItems={99} className="mt-2" />
         <div className="flex items-center gap-3 my-4">
            <h3 className="title-2">от {numberReplace(minPrice || 0)} ₽</h3>
            <div className="text-primary500">{numberReplace(minPricePerMeter || 0)} ₽/м²</div>
         </div>
         {userRole === ROLE_BUYER.name && (
            <div className="mt-5 flex flex-col gap-2 w-full">
               <Button onClick={goToChat}>Задать вопрос в чат</Button>
               <Button variant="secondary" onClick={() => setIsOpenRecordView(true)}>
                  <AnimatedText texts={['Записаться на просмотр', 'Записаться на онлайн-показ']} intervalTime={3000} />
               </Button>
            </div>
         )}
      </div>
   );
};

export default ModalSidebar;
