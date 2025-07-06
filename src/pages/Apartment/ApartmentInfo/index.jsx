import React, { useContext, useEffect, useState } from 'react';
import { ApartmentContext } from '../../../context';

import styles from './ApartmentInfo.module.scss';

import { TagCashback, TagDiscount, TagPresent, TagTop } from '../../../ui/Tag';

import { Chars } from '../../../ui/Chars';
import BtnShow from '../../../ui/BtnShow';
import { TagsMoreHeight } from '../../../ui/TagsMore';
import { useSelector } from 'react-redux';
import { getIsDesktop, getWindowSize } from '../../../redux/helpers/selectors';
import ApartmentPrice from '../components/ApartmentPrice';
import dayjs from 'dayjs';

const ApartmentInfo = () => {
   const {
      cashbackValue,
      present,
      apartment_tags = [],
      address,
      title,
      attributes,
      complex,
      deadline,
      priceOld,
      housing,
      rooms,
      area,
      floor,
      building_floors,
      city,
      buildingCashback,
      buildingDiscount,
   } = useContext(ApartmentContext);

   const [attrActive, setAttrActive] = useState(false);
   const [newAttributes, setNewAttributes] = useState([]);
   const isDesktop = useSelector(getIsDesktop);

   useEffect(() => {
      const mainAttr = [
         {
            name: 'Комнат',
            value: rooms === 0 ? 'Студия' : rooms,
         },
         {
            name: 'Площадь',
            value: `${area} м²`,
         },
         {
            name: 'Тип',
            value: 'Квартира',
         },
         {
            name: 'Этаж',
            value: `${floor}/${building_floors}`,
         },
      ];
      setNewAttributes([...mainAttr, ...(attributes || [])]);
   }, []);

   const CharsItem = ({ data }) => {
      return (
         <Chars>
            <span>{data.name}</span>
            <span>{data.value}</span>
         </Chars>
      );
   };
   return (
      <div className="white-block">
         {Boolean(!isDesktop && (buildingDiscount || cashbackValue || present)) && (
            <div className="flex gap-2 flex-wrap items-center">
               <TagDiscount {...buildingDiscount} />
               <TagCashback cashback={cashbackValue} prefix="Кешбэк" increased={buildingCashback} />
               {present && <TagPresent present={present} />}
            </div>
         )}
         {apartment_tags.length > 0 && (
            <div className="mt-2">
               <TagsMoreHeight data={apartment_tags} />
            </div>
         )}
         <h1 className="[&:not(:first-child)]:mt-4 title-2">{title}</h1>
         {!isDesktop && <ApartmentPrice className="mt-2" />}
         <h2 className="title-2 mt-2 md1:mt-4">{complex}</h2>
         <div className="flex items-center gap-2 mt-2 text-primary400">
            {housing && <span>Корпус: {housing}</span>}
            {deadline && <span>Срок сдачи: {deadline}</span>}
         </div>
         <p className="mt-2 mb-4">
            {city},&nbsp; {address || ''}
         </p>

         {newAttributes.length > 0 && (
            <>
               <div className="mt-6">
                  <div className={styles.ApartmentInfoChars}>
                     {attrActive
                        ? newAttributes.map((attribute, index) => <CharsItem data={attribute} key={index} />)
                        : newAttributes.map((attribute, index) => {
                             return index < 4 ? <CharsItem data={attribute} key={index} /> : '';
                          })}
                  </div>
               </div>
               {newAttributes.length > 4 && (
                  <BtnShow className="mt-5 md1:mt-4" onClick={() => setAttrActive(prev => !prev)} active={attrActive}>
                     {attrActive ? 'Скрыть' : 'Показать полностью'}
                  </BtnShow>
               )}
            </>
         )}
      </div>
   );
};

export default ApartmentInfo;
