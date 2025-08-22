import React, { useEffect, useRef, useState } from 'react';

import Avatar from '../../ui/Avatar';
import MetroItems from '../../ui/MetroItems';
import Accordion from '../../ui/Accordion';
import getArrayFromNumber from '../../helpers/getArrayFromNumber';
import numberReplace from '../../helpers/numberReplace';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import Checkbox from '../../uiForm/Checkbox';
import { BtnActionText } from '../../ui/ActionBtns';
import { IconArrowY, IconShare, IconTrash } from '../../ui/Icons';

import Button from '../../uiForm/Button';

import styles from './Comparison.module.scss';
import stylesDragDropItems from '../../components/DragDrop/DragDropItems.module.scss';

import { Link } from 'react-router-dom';
import { RoutesPath } from '../../constants/RoutesPath';
import getSrcImage from '../../helpers/getSrcImage';
import { EmptyTextBlock } from '../../components/EmptyBlock';
import findObjectWithMinValue from '../../helpers/findObjectWithMinValue';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { getMaxCashback } from '../../helpers/cashbackUtils';

const Card = ({ totalCount, index, dataCard, type, deleteCard }) => {
   const title =
      dataCard.title ||
      `${dataCard.rooms === 0 ? 'Студия' : `${dataCard.rooms}-комн.`} ${dataCard.area} м², 
   ${dataCard.floor}/${dataCard.building_floors} эт.`;

   return (
      <article className="relative">
         <span className="block mb-2 text-center text-primary400 text-small">
            {index + 1}/{totalCount}
         </span>
         <button
            type="button"
            className={`${stylesDragDropItems.DragDropImageIcon} top-8 right-2 !opacity-100 !visible ${styles.ComparisonCardDeleteBtn}`}
            onClick={() => deleteCard(type, dataCard.id)}>
            <IconTrash width={15} height={15} className="stroke-red" />
         </button>
         <Link
            to={type === 'complex' ? `${RoutesPath.building}${dataCard.id}` : `${RoutesPath.apartment}${dataCard.id}`}
            className="ibg overflow-hidden pb-[68%] rounded-xl block">
            <img src={getSrcImage(dataCard.images ? dataCard.images[0] : '')} alt="" className={type === 'apartment' ? '!object-contain' : ''} />
         </Link>
         <h4 className="title-4 line-clamp-1 mt-3 mb-1">{title}</h4>
         <p className="text-small text-primary400 mb-1">Срок сдачи: {dataCard.deadline}</p>
         <p className="line-clamp-1 text-small">{dataCard.address}</p>
         {type === 'complex' && (
            <Link to={`${RoutesPath.building}${dataCard.id}#section-apartments-id`} target="_blank" rel="noopener noreferrer" className="block mt-4">
               <Button Selector="div" variant="secondary" size="Small">
                  Выбрать квартиру
               </Button>
            </Link>
         )}
      </article>
   );
};

const IconYes = () => {
   return (
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 17C11.866 17 15 13.866 15 10C15 6.13401 11.866 3 8 3C4.13401 3 1 6.13401 1 10C1 13.866 4.13401 17 8 17ZM11.7929 8.70712C12.1834 8.31659 12.1834 7.68343 11.7929 7.2929C11.4024 6.90238 10.7692 6.90238 10.3787 7.2929L7.2 10.4716C7.08954 10.582 6.91046 10.582 6.8 10.4716L5.70711 9.37868C5.31658 8.98816 4.68342 8.98816 4.29289 9.37869C3.90237 9.76921 3.90237 10.4024 4.29289 10.7929L6.37923 12.8792C6.72207 13.2221 7.27792 13.2221 7.62076 12.8792L11.7929 8.70712Z"
            fill="#53B374"></path>
      </svg>
   );
};

const IconNo = () => {
   return (
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 10C15 13.866 11.866 17 8 17C4.13401 17 1 13.866 1 10C1 6.13401 4.13401 3 8 3C11.866 3 15 6.13401 15 10ZM11 7C10.6095 6.60948 9.97633 6.60948 9.5858 7L8.00002 8.58578L6.41424 7C6.02372 6.60948 5.39055 6.60948 5.00003 7C4.60951 7.39052 4.60951 8.02369 5.00003 8.41421L6.58581 9.99999L5.00002 11.5858C4.60949 11.9763 4.60949 12.6095 5.00002 13C5.39054 13.3905 6.02371 13.3905 6.41423 13L8.00002 11.4142L9.58582 13C9.97634 13.3905 10.6095 13.3905 11 13C11.3906 12.6095 11.3906 11.9763 11 11.5858L9.41424 9.99999L11 8.41421C11.3905 8.02369 11.3905 7.39052 11 7Z"
            fill="#F6A623"></path>
      </svg>
   );
};

const ComparisonBody = ({ dataNames, data, type, deleteAll, deleteCard, isLoading }) => {
   const [comparisonDiff, setComparisonDiff] = useState(false);
   const comparisonBodyRef = useRef(null);

   const [navPrevDisabled, setNavPrevDisabled] = useState(true);
   const [navNextDisabled, setNavNextDisabled] = useState(true);

   const RenderValue = ({ field, typeField, postfix }) => {
      if (typeField === 'boolean') {
         if (typeof field === 'string') {
            return (
               <div className="flex items-center gap-2">
                  <IconYes />
                  {field}
               </div>
            );
         } else {
            return field ? (
               <div className="flex items-center gap-2">
                  <IconYes />
                  Да
               </div>
            ) : (
               <div className="flex items-center gap-2">
                  <IconNo />
                  Нет
               </div>
            );
         }
      }
      if (typeField === 'developer' || typeField === 'user') {
         return (
            <div>
               <Avatar src={field.avatarUrl} title={field.name} size={46} />
               <p className="title-4 mt-2.5">{field.name}</p>
               {field.handedOver && (
                  <p className="mt-2">
                     Сдано
                     <span className="text-blue ml-1.5">{field.handedOver} дома</span>
                  </p>
               )}
               {field.underСonstruction && (
                  <p className="mt-2">
                     Строиться
                     <span className="text-blue ml-1.5">{field.underСonstruction} дома</span>
                  </p>
               )}
            </div>
         );
      }
      if (typeField === 'text') {
         if (field && postfix) {
            return (
               <div>
                  {field} {postfix}
               </div>
            );
         }
         return <div>{field || '—'}</div>;
      }
      if (typeField === 'metro') {
         if (field && field.length > 0) {
            return <MetroItems data={field} visibleItems={99} />;
         } else {
            return <div>—</div>;
         }
      }
   };

   const toggleNavDisabled = () => {
      if (!comparisonBodyRef.current) return;

      if (comparisonBodyRef.current.scrollLeft < 50) {
         setNavPrevDisabled(true);
      }
      const currentScrollWidth = comparisonBodyRef.current.scrollWidth + 50;
      const currentScrollLeft = comparisonBodyRef.current.scrollLeft + 263.65 * 3 + 335;
      if (currentScrollWidth > currentScrollLeft && currentScrollWidth - currentScrollLeft <= 100) {
         setNavNextDisabled(true);
      } else {
         setNavNextDisabled(false);
      }
   };

   const onClickNav = (type, e) => {
      setNavPrevDisabled(false);
      setNavNextDisabled(false);

      const scrollLeft = comparisonBodyRef.current.scrollLeft;
      const width = 263.65;
      comparisonBodyRef.current.scrollTo({
         left: type === 'next' ? scrollLeft + width : scrollLeft - width,
         behavior: 'smooth',
      });

      setTimeout(() => {
         toggleNavDisabled();
      }, 400);
   };

   const RenderAccordion = () => {
      const dataItems = dataNames.map(obj => {
         return {
            button: (
               <button className={styles.ComparisonMore}>
                  <p className="title-3">{obj.title}</p>
                  <IconArrowY className="fill-dark" width={30} height={25} />
               </button>
            ),
            body: (
               <div className="pb-4">
                  {obj.items.map((item, index) => {
                     return (
                        <div key={index} className={styles.ComparisonOption}>
                           <p className={`${styles.ComparisonName} ${styles.ComparisonOptionName}`}>{item.label}</p>
                           <div className="flex">
                              {data.map((object, index) => {
                                 let currentField = object[item.value];

                                 if (item.value === 'type') {
                                    currentField = 'Вторичка';
                                 }
                                 if (item.value === 'floor') {
                                    currentField = `${object.floor} из ${object.building_floors}`;
                                 }
                                 if (item.value === 'address') {
                                    currentField = `${object.city}, ${object.address}`;
                                 }
                                 if (item.value === 'min_price_complex') {
                                    const minPrice = findObjectWithMinValue(object.apartments, 'bd_price')?.bd_price.toString() || 0;
                                    currentField = minPrice;
                                 }
                                 if (item.value === 'cashback') {
                                    const max_building_cashback = object.buildingCashback || getMaxCashback(object.buildingCashbacks);

                                    currentField = numberReplace(
                                       ((object.bd_price || object.price || object.max_bd_price || object.max_price) / 100) *
                                          (object.cashback + (max_building_cashback.value || 0))
                                    );
                                 }

                                 if (item.value === 'price') {
                                    currentField = numberReplace(object.bd_price || object.price);
                                 }

                                 if (item.value === 'pricePerMeter') {
                                    currentField = numberReplace((object.bd_price || object.price) / object.area);
                                 }

                                 return (
                                    <div key={index} className={styles.ComparisonCol}>
                                       <RenderValue field={currentField} typeField={item.typeField} postfix={item.postfix} />
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     );
                  })}
               </div>
            ),
         };
      });
      return <Accordion data={dataItems} multiple={true} defaultValue={getArrayFromNumber(dataNames.length)} />;
   };

   useEffect(() => {
      toggleNavDisabled();
   }, [comparisonBodyRef.current, data]);

   if (isLoading) {
      return (
         <div className="select-none rounded-xl bg-white shadow p-4">
            <WebSkeleton className="rounded-xl h-[270px] w-full" />
            <WebSkeleton className="rounded-xl h-[55px] w-1/5 mt-4" />
            <WebSkeleton className="rounded-xl h-[65px] w-full mt-4" />
            <WebSkeleton className="rounded-xl h-[65px] w-full mt-4" />
            <WebSkeleton className="rounded-xl h-[65px] w-full mt-4" />
            <WebSkeleton className="rounded-xl h-[65px] w-full mt-4" />
            <WebSkeleton className="rounded-xl h-[55px] w-1/5 mt-4" />
            <WebSkeleton className="rounded-xl h-[65px] w-full mt-4" />
            <WebSkeleton className="rounded-xl h-[55px] w-1/5 mt-4" />
            <WebSkeleton className="rounded-xl h-[65px] w-full mt-4" />
            <WebSkeleton className="rounded-xl h-[65px] w-full mt-4" />
         </div>
      );
   }

   if (!data.length) {
      return (
         <EmptyTextBlock className="col-span-full">
            <h3 className="title-3 mt-4">Добавляйте объявления в сравнение</h3>
            <p className="mt-3">Отмечайте интересные объявления чтобы получать персональные скидки от застройщика</p>
            <Link to={RoutesPath.listing} className="mt-6">
               <Button Selector="div">Искать объявления</Button>
            </Link>
         </EmptyTextBlock>
      );
   }

   return (
      <section className="white-block relative">
         <div className={styles.ComparisonBody} ref={comparisonBodyRef}>
            <div className={styles.ComparisonWrapper}>
               <div className={styles.ComparisonTop}>
                  <div className="flex w-full md1:flex-col md1:gap-8">
                     <div className={`${styles.ComparisonActions} ${styles.ComparisonName}`}>
                        <p className="font-medium mb-8">
                           В сравнении {data.length} {type === 'apartment' ? 'квартир' : 'ЖК'}
                        </p>
                        <div className="flex flex-col gap-3">
                           {/* <Checkbox
                              checked={comparisonDiff}
                              onChange={e => setComparisonDiff(e.target.checked)}
                              option={{ value: 'comparison-diff', label: 'Показывать только различия' }}
                           />
                           <BtnActionText className="!px-0">
                              <IconShare width={16} height={16} />
                              <span className="text-dark font-medium">Поделиться списком</span>
                           </BtnActionText> */}
                           <BtnActionText className="!px-0" onClick={() => deleteAll(type)}>
                              <IconTrash width={16} height={16} className="!stroke-red" />
                              <span className="text-dark font-medium">Удалить весь список</span>
                           </BtnActionText>
                        </div>
                     </div>
                     <div className="flex">
                        {data.map((item, index) => {
                           return (
                              <div key={index} className={styles.ComparisonCol}>
                                 <Card totalCount={data.length} index={index} dataCard={item} type={type} deleteCard={deleteCard} />
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>
               <div className="mt-4">
                  <RenderAccordion />
               </div>
               <NavBtnPrev
                  onClick={() => onClickNav('prev')}
                  className={`${styles.ComparisonPrev} ${navPrevDisabled ? '_disabled opacity-0' : ''} md1:!hidden`}
               />
               <NavBtnNext
                  onClick={() => onClickNav('next')}
                  className={`${styles.ComparisonNext} ${navNextDisabled ? '_disabled opacity-0' : ''} md1:!hidden`}
               />
            </div>
         </div>
      </section>
   );
};

export default ComparisonBody;
