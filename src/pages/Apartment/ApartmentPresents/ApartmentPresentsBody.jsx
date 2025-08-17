import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import plural from 'plural-ru';

import styles from './ApartmentPresents.module.scss';
import { PresentCard } from '../../../ui/PresentCard';
import AnimatedNumber from '../../../ui/AnimatedNumber';
import { Tooltip } from '../../../ui/Tooltip';
import { IconInfoTooltip } from '../../../ui/Icons';

import { getIsDesktop } from '@/redux';

const ApartmentPresentsBody = ({ type = 'default', options }) => {
   const { onChangeHandler, selector, setOpenModal, mainGift, secondGift } = options;
   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className={cn(type === 'default' && 'white-block')}>
         <div className="flex flex-col gap-8">
            {Boolean(mainGift.length && !secondGift.length) && (
               <div className="flex items-center gap-2">
                  <h2 className="title-2">Есть подарок</h2>
                  <Tooltip
                     mobile
                     color="white"
                     ElementTarget={() => <IconInfoTooltip width={16} height={16} />}
                     classNameTarget="h-4"
                     placement="bottom">
                     <h3 className="title-3">Подарки</h3>
                     <p className="mt-1">Сможете получить после покупки квартиры</p>
                  </Tooltip>
               </div>
            )}
            {Boolean(mainGift.length) && (
               <div className={styles.ApartmentPresentsCards}>
                  {mainGift.map((item, index) => {
                     return <PresentCard {...item} key={index} actions={false} />;
                  })}
               </div>
            )}
            {Boolean(secondGift.length) && (
               <div>
                  <div className="flex items-center gap-2 mb-4">
                     <h2 className="title-2">
                        {selector.info.type === 'sum' && (
                           <>
                              Выберите подарки на сумму <AnimatedNumber to={selector.info.leftPrice} /> ₽
                           </>
                        )}
                        {selector.info.type === 'count' && (
                           <>
                              Выбрано {selector.selectedPresents.length} из {selector.info.maxCount} дополнительных{' '}
                              {plural(selector.selectedPresents.length, 'подарков', 'подарка', 'подарков')}
                           </>
                        )}
                     </h2>
                     <Tooltip
                        mobile
                        color="white"
                        ElementTarget={() => <IconInfoTooltip width={16} height={16} />}
                        classNameTarget="h-4"
                        placement="bottom">
                        <h3 className="title-3">Подарки</h3>
                        <p className="mt-1">Сможете получить после покупки квартиры</p>
                     </Tooltip>
                  </div>
                  <div className={styles.ApartmentPresentsCards}>
                     {secondGift.map((item, index) => {
                        let value = false;

                        if (item.newPrice > item.oldPrice) {
                           value = selector.info.leftPrice < item.newPrice;
                        } else {
                           value = selector.info.leftPrice < item.oldPrice - item.newPrice;
                        }

                        if (selector.info.type === 'count' && selector.selectedPresents.length >= selector.info.maxCount) {
                           value = true;
                        }

                        return (
                           <PresentCard
                              classNameRoot={cn(!isDesktop && '[&:not(:last-child)]:!border-b [&:not(:last-child)]:!border-b-pageColor')}
                              {...item}
                              key={index}
                              onChange={e => {
                                 if (isDesktop && selector.selectedPresents.filter(present => present.id === item.id).length === 0 && setOpenModal) {
                                    setOpenModal(true);
                                 }
                                 onChangeHandler(e, item.id);
                              }}
                              checked={selector.selectedPresents.find(present => present.id === item.id)}
                              value={value}
                              count={selector.selectedPresents.filter(present => present.id === item.id).length}
                           />
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default ApartmentPresentsBody;
