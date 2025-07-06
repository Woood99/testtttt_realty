import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import cn from 'classnames';

import styles from './BuildingInfo.module.scss';

import Tag, { TagCashback, TagDiscount, TagPresents, TagsDiscounts, TagTop } from '../../../ui/Tag';
import MetroItems from '../../../ui/MetroItems';

import numberReplace from '../../../helpers/numberReplace';
import { Chars } from '../../../ui/Chars';
import BtnShow from '../../../ui/BtnShow';
import { BuildingContext } from '../../../context';
import AdvantageCard from '../../../ui/AdvantageCard';
import { isArray } from '../../../helpers/isEmptyArrObj';
import BlockDescr from '../../../components/BlockDescr/BlockDescr';
import dayjs from 'dayjs';
import { getMaxCashback } from '../../../helpers/cashbackUtils';

const BuildingInfo = () => {
   const {
      title,
      cashback,
      present,
      stickers,
      address,
      metro,
      minPrice,
      minBdPrice,
      max_bd_price,
      max_price,
      attributes,
      tags,
      deadline,
      city,
      advantages,
      main_gifts = [],
      second_gifts = [],
      description,
      buildingDiscounts,
      buildingCashbacks,
      minBdPricePerMeter,
      minPricePerMeter,
   } = useContext(BuildingContext);

   const [attrActive, setAttrActive] = useState(false);
   const [newAttributes, setNewAttributes] = useState([]);

   const max_building_cashback = getMaxCashback(buildingCashbacks);
   const cashbackValue = ((max_bd_price || max_price) / 100) * ((cashback || 0) + (max_building_cashback.value || 0));

   useEffect(() => {
      const newAttr = attributes || [];
      const mainAttr = [
         {
            name: 'Срок сдачи',
            value: deadline,
         },
      ];

      const findMainAttr = newAttr.find(item => item.tabName === 'Общая');
      if (findMainAttr) {
         findMainAttr.items = [...findMainAttr.items, ...mainAttr];
      } else {
         newAttr.unshift({
            tabName: 'Общая',
            items: [...mainAttr],
         });
      }

      setNewAttributes(
         newAttr
            .map(item => {
               return { ...item, items: item.items.filter(item => item.value.trim() !== 'Нет') };
            })
            .filter(item => item.items.length)
      );
   }, []);

   const attributesLength = newAttributes.reduce((acc, item) => {
      if (item) {
         return acc + item.items.length;
      }
   }, 0);

   const CharsTitle = ({ data }) => {
      return data.tabName ? <h3 className="title-3 mb-5">{data.tabName}</h3> : '';
   };

   const CharsItem = ({ data, classNameContent }) => {
      return (
         <Chars>
            <span>{data.name}</span>
            <div className={cn('flex items-start gap-2 ', classNameContent)}>
               <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {data.value.split(', ').map((item, index, array) => (
                     <span key={index}>
                        {item}
                        {Boolean(index < array.length - 1) && <>,</>}
                     </span>
                  ))}
               </div>
            </div>
         </Chars>
      );
   };

   return (
      <section>
         <div className="white-block">
            {Boolean(cashback || present || stickers?.length) && (
               <div className="flex gap-2 flex-wrap mb-4">
                  <TagsDiscounts
                     discounts={buildingDiscounts}
                     is_building
                     by_price={minBdPrice}
                     by_area={(minBdPrice || minPrice) / (minBdPricePerMeter || minPricePerMeter)}
                  />
                  {cashback && <TagCashback cashback={cashbackValue} increased={max_building_cashback} />}
                  {Boolean(main_gifts.length || present || second_gifts.length) && (
                     <TagPresents
                        dataMainGifts={isArray(main_gifts) ? main_gifts.filter(item => item) : []}
                        dataSecondGifts={isArray(second_gifts) ? second_gifts.filter(item => item) : []}
                        title="Есть подарок"
                     />
                  )}
                  {Boolean(stickers.length) && stickers.map(item => <TagTop top={item.name} key={item.id} />)}
               </div>
            )}
            {tags.length > 0 && (
               <div className="mt-2 mb-4 flex gap-2 flex-wrap">
                  {tags.map((item, index) => (
                     <Tag size="small" color="default" key={index}>
                        {item.name}
                     </Tag>
                  ))}
               </div>
            )}
            <h1 className="title-1">{title}</h1>
            <div className="mt-1 mb-4 md1:my-1">
               {city},&nbsp; {address || ''}
            </div>
            <MetroItems data={metro} visibleItems={99} className="mb-4" />
            <div className="flex items-center gap-3 mb-4 md1:my-3">
               <h3 className="title-2">от {numberReplace(minBdPrice || minPrice || 0)} ₽</h3>
            </div>
            {newAttributes.length && (
               <>
                  <div className="mt-6">
                     {newAttributes.map((attribute, index) => {
                        if (index !== 0 && !attrActive) return;
                        return (
                           <div key={index} className={styles.BuildingInfoChars}>
                              {index !== 0 && <CharsTitle data={attribute} />}

                              <div className={cn(styles.BuildingInfoCharsItems, index > 0 && '!grid-cols-1')}>
                                 {attribute.items.map((item, currentIndex) => {
                                    if (index === 0 && currentIndex >= 4 && !attrActive) return;
                                    return (
                                       <CharsItem data={item} key={currentIndex} classNameContent={index > 0 ? '!min-w-[68%] !max-w-[68%]' : ''} />
                                    );
                                 })}
                              </div>
                           </div>
                        );
                     })}
                  </div>
                  {attributesLength > 4 && (
                     <BtnShow className="mt-5 md1:mt-4" onClick={() => setAttrActive(prev => !prev)} active={attrActive}>
                        {attrActive ? 'Скрыть' : 'Показать полностью'}
                     </BtnShow>
                  )}
               </>
            )}
            {Boolean(description) && <BlockDescr title="О проекте" descr={description} />}
            {Boolean(advantages.length) && (
               <div className="mt-8">
                  <h3 className="title-2 mb-4">Уникальные квартиры</h3>
                  <div className="grid grid-cols-5 gap-4 md1:grid-cols-3 md2:grid-cols-2">
                     {advantages.map(item => (
                        <Link to="section-apartments-id" smooth={true} offset={-52 - 12} duration={500} key={item.id}>
                           <AdvantageCard data={item} textVisible={false} />
                        </Link>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </section>
   );
};

export default BuildingInfo;
