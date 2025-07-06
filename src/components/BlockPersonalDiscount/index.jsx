import React from 'react';

import styles from './BlockPersonalDiscount.module.scss';
import { Chars } from '../../ui/Chars';
import numberReplace from '../../helpers/numberReplace';

import Button from '../../uiForm/Button';
import dayjs from 'dayjs';
import getSrcImage from '../../helpers/getSrcImage';
import UserInfo from '../../ui/UserInfo';
import { capitalizeWords } from '../../helpers/changeString';
import { sendPostRequest } from '../../api/requestsApi';
import { isObject } from '../../helpers/isEmptyArrObj';
import { Link } from 'react-router-dom';
import CardSmall from '../../ui/CardSmall';

const BlockPersonalDiscount = ({ data, mainData = {}, variant = 'default' }) => {
   const date = dayjs(dayjs.unix(data.valid_till)).format('DD.MM.YYYY');
   const currentDate = dayjs().format('DD.MM.YYYY');
   
   const dataBlock = {
      price: mainData.minPrice || mainData.price,
      title: mainData.title || mainData.name,
      address: mainData.address,
      deadline: mainData.deadline,
      firstImage: mainData.gallery ? mainData.gallery[0].images[0] : mainData.images[0],
      discount: `${data.type === 'price' ? `${numberReplace(data.discount || 0)} ₽` : data.type === 'prc' ? `-${data.discount || 0} %` : ''}`,
   };

   return (
      <div className={`${variant === 'default' ? 'p-2' : 'white-block'}`}>
         <div className={styles.BlockPersonalDiscountWrapper}>
            <div>
               <h2 className={`mb-5 ${variant === 'default' ? 'title-3' : 'title-2'}`}>
                  {data.type === 'special-condition' ? (
                     <>Ваш персональный подарок "{data.special_condition.name}"</>
                  ) : (
                     <>Ваша персональная скидка {`${data.type === 'price' ? `${numberReplace(data.discount)} ₽` : `-${data.discount} %`}`}</>
                  )}
               </h2>
               <CardSmall
                  className="mb-4"
                  data={{
                     ...dataBlock,
                     type:'building',
                     images: [getSrcImage(isObject(dataBlock.firstImage) ? dataBlock.firstImage.image : dataBlock.firstImage)],
                  }}
               />
               {Boolean(data.type === 'price' || data.type === 'prc') && (
                  <>
                     <p className="font-medium mt-4">Застройщик предлагает вам дополнительную скидку</p>
                     <div className="flex flex-col gap-3 my-4">
                        <Chars justifyBetween>
                           <span>Обычная цена</span>
                           <span>{numberReplace(dataBlock.price || 0)} ₽</span>
                        </Chars>
                        <Chars justifyBetween color="blue">
                           <span>{data.type === 'price' ? 'Ваша скидка' : `Ваши -${data.discount} %`}</span>
                           <span>
                              {data.type === 'price' ? numberReplace(data.discount) : numberReplace((dataBlock.price / 100) * data.discount) || 0} ₽
                           </span>
                        </Chars>
                        <Chars justifyBetween>
                           <span>Цена для вас</span>
                           <span>
                              {data.type === 'price'
                                 ? `${numberReplace(dataBlock.price - data.discount || 0)} ₽`
                                 : `${numberReplace(dataBlock.price - (dataBlock.price / 100) * data.discount)} ₽`}
                           </span>
                        </Chars>
                     </div>
                  </>
               )}

               {date === currentDate && <div className="text-red font-medium">Предложение действует последний день</div>}
               {date !== currentDate && <div className="font-medium">Предложение действует до {date}</div>}
               {Boolean(data.type === 'special-condition') && (
                  <a href={data.special_condition.link} className="blue-link mt-2">
                     Подробнее
                  </a>
               )}
               {data.author && (
                  <UserInfo
                     avatar={data.author.avatar_url}
                     name={capitalizeWords(data.author.name, data.author.surname)}
                     pos={
                        <>
                           Отдел продаж &nbsp; <span className="text-dark font-medium">"{mainData.developer.name}"</span>
                        </>
                     }
                     centered
                     className="mt-8"
                  />
               )}
            </div>
         </div>
         {variant === 'default' ? (
            <Link to="#" className="blue-link mt-6">
               Смотреть полностью
            </Link>
         ) : (
            ''
         )}
         <Button
            variant="secondary"
            className="w-full mt-4 relative z-10"
            onClick={() => {
               sendPostRequest('/api/metric', {
                  type: 'replied_to_special_offer',
                  metricable_type: data.property_type === 'complex' ? 'App\\Models\\Building' : 'App\\Models\\Apartment',
                  metricable_id: data.object_id,
                  discount_id: data.id,
               }).then(res => {
                  console.log(res);
               });
            }}>
            Забрать
         </Button>
      </div>
   );
};

export default BlockPersonalDiscount;
