import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import { PurchasePageContext } from '../../context';
import { Chars } from '../../ui/Chars';
import numberReplace from '../../helpers/numberReplace';
import { Badges } from '../../ui/Badges';
import { BlockDescrBorder, GetDescrHTML } from '../../components/BlockDescr/BlockDescr';
import { view_start_data } from '../../data/selectsField';
import PurchaseRequestMap from './PurchaseRequestMap';
import { getIsDesktop } from '@/redux';
import Tag from '../../ui/Tag';

const PurchaseRequestParameters = () => {
   const { data } = useContext(PurchasePageContext);
   const {
      created_at,
      city,
      developers,
      complexes,
      view_start,
      price,
      pricing_attributes,
      attributes,
      rooms,
      area_total_from,
      area_total_to,
      area_kitchen_from,
      area_kitchen_to,
      floor_from,
      floor_to,
      description,
      details,
      buildings,
      price_type,
      tags,
      advantages,
      certificate_amount,
      initial_payment,
      approved_amount,
   } = data;

   const isDesktop = useSelector(getIsDesktop);

   const classNameChars = 'md1:flex-col';
   const classNameCharsRight = '!min-w-[65%] max-w-[65%] md1:!min-w-full md1:!max-w-full !font-medium md1:mt-1.5';

   const roomsArr = rooms
      ? rooms
           .sort((a, b) => a - b)
           .map(item => {
              if (item === 0) {
                 return 'Студия';
              } else {
                 return item;
              }
           })
      : [];

   return (
      <section>
         <div className="white-block">
            <h2 className="title-2 mb-4">Параметры заявки на покупку</h2>
            <div className="flex flex-col gap-4">
               {!!city && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Город</span>
                     <span className={classNameCharsRight}>{city.name}</span>
                  </Chars>
               )}
               {!!view_start && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Планирую смотреть</span>
                     <span className={classNameCharsRight}>{view_start_data.find(item => item.value === view_start)?.label}</span>
                  </Chars>
               )}
               {Boolean(developers && developers.length) && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Застройщик</span>
                     <span className={classNameCharsRight}>{developers.map(item => item.name)?.join(', ')}</span>
                  </Chars>
               )}
               {Boolean(buildings && buildings.length) && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Жилой комплекс</span>
                     <span className={classNameCharsRight}>{buildings.map(item => `ЖК ${item.name}`)?.join(', ')}</span>
                  </Chars>
               )}
               {!!complexes && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Комплекс</span>
                     <span className={classNameCharsRight}>{complexes.map(item => item.label)?.join(', ')}</span>
                  </Chars>
               )}
               <div>
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>{price_type === 'object_price_from' ? 'Бюджет' : price_type === 'month_payment' ? 'Ежемесячный платёж до' : ''}</span>
                     <div className={`flex flex-wrap gap-1.5 ${classNameCharsRight}`}>
                        <span className="whitespace-nowrap mr-2">{numberReplace(price || 0)} ₽</span>
                     </div>
                  </Chars>
                  <Badges data={pricing_attributes} className="flex flex-wrap gap-3 mt-3" />
               </div>

               {!!approved_amount && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Одобренная сумма</span>
                     <span className={classNameCharsRight}>{numberReplace(approved_amount)} ₽</span>
                  </Chars>
               )}
               {!!initial_payment && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Первоначальный взнос</span>
                     <span className={classNameCharsRight}>{numberReplace(initial_payment)} ₽</span>
                  </Chars>
               )}
               {!!certificate_amount && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Сумма сертификата</span>
                     <span className={classNameCharsRight}>{numberReplace(certificate_amount)} ₽</span>
                  </Chars>
               )}
               {!!rooms && rooms.length > 0 && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Кол-во комнат</span>
                     <span className={classNameCharsRight}>{roomsArr.join(', ')}</span>
                  </Chars>
               )}

               {!!area_total_from && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Площадь общая от</span>
                     <span className={classNameCharsRight}>{area_total_from} м²</span>
                  </Chars>
               )}
               {!!area_total_to && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Площадь общая до</span>
                     <span className={classNameCharsRight}>{area_total_to} м²</span>
                  </Chars>
               )}

               {(area_kitchen_from || area_kitchen_to) && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Площадь кухни</span>
                     <div className={classNameCharsRight}>
                        {area_kitchen_from ? <span>от {area_kitchen_from} м² &nbsp;</span> : ''}
                        {area_kitchen_to ? <span>до {area_kitchen_to} м²</span> : ''}
                     </div>
                  </Chars>
               )}
               {(floor_from || floor_to) && (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                     <span>Этаж</span>
                     <div className={classNameCharsRight}>
                        {floor_from ? <span>от {floor_from} &nbsp;</span> : ''}
                        {floor_to ? <span>до {floor_to}</span> : ''}
                     </div>
                  </Chars>
               )}
               {attributes.map((item, index) => (
                  <Chars className={classNameChars} hiddenAfter={!isDesktop} key={index}>
                     <span>{item.name}</span>
                     <span className={classNameCharsRight}>{item.value.join(', ')}</span>
                  </Chars>
               ))}
               <Chars className={classNameChars} hiddenAfter={!isDesktop}>
                  <span>Дата подачи заявки</span>
                  <span className={classNameCharsRight}>{dayjs(created_at).format('DD.MM.YYYY')}</span>
               </Chars>

               {Boolean(tags.length > 0) && (
                  <div className="mt-2 mb-2">
                     <h2 className="title-3 mb-3">Теги к заявке</h2>
                     <div className="flex flex-wrap gap-1.5">
                        {tags.map((item, index) => (
                           <Tag size="medium" color="default" key={index}>
                              {item.name}
                           </Tag>
                        ))}
                     </div>
                  </div>
               )}
               {Boolean(advantages.length > 0) && (
                  <div>
                     <h2 className="title-3 mb-3">Преимущества квартиры</h2>
                     <div className="flex flex-wrap gap-1.5">
                        {advantages.map((item, index) => (
                           <Tag size="medium" color="default" key={index}>
                              {item.name}
                           </Tag>
                        ))}
                     </div>
                  </div>
               )}
            </div>
            {description && (
               <div>
                  <h2 className="title-2 mb-4 mt-8">Описание</h2>
                  <GetDescrHTML data={description} />
               </div>
            )}
            {details && (
               <div>
                  <h2 className="title-2 mb-4 mt-8">Важные детали в поиске объекта</h2>
                  <BlockDescrBorder descr={details} />
               </div>
            )}
            {data.search_area && data.search_area.length ? <PurchaseRequestMap /> : ''}
         </div>
      </section>
   );
};

export default PurchaseRequestParameters;
