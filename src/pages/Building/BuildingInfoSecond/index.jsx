import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import cn from 'classnames';

import styles from './BuildingInfo.module.scss';

import { AdvantageCard, BtnShow, Chars, Maybe } from '@/ui';
import { BlockDescr } from '@/components';
import { BuildingContext } from '@/context';

const BuildingInfoSecond = () => {
   const { attributes, advantages, description } = useContext(BuildingContext);

   const [attrActive, setAttrActive] = useState(false);
   const [newAttributes, setNewAttributes] = useState([]);

   useEffect(() => {
      const newAttr = attributes || [];

      const findMainAttr = newAttr.find(item => item.tabName === 'Общая');
      if (findMainAttr) {
         findMainAttr.items = findMainAttr.items;
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

   return (
      <section>
         <div className="white-block">
            <h2 className="title-2">О комплексе</h2>
            <Maybe condition={newAttributes.length}>
               <div className="mt-6">
                  {newAttributes.map((attribute, index) => {
                     if (index !== 0 && !attrActive) return;
                     return (
                        <div key={index} className={styles.BuildingInfoChars}>
                           {index !== 0 && attribute.tabName && <h3 className="title-3 mb-5">{attribute.tabName}</h3>}

                           <div className={cn(styles.BuildingInfoCharsItems, index > 0 && '!grid-cols-1')}>
                              {attribute.items.map((item, currentIndex) => {
                                 if (index === 0 && currentIndex >= 4 && !attrActive) return;
                                 return (
                                    <Chars key={currentIndex}>
                                       <span>{item.name}</span>
                                       <div className={cn('flex items-start gap-2 ', index > 0 && '!min-w-[68%] !max-w-[68%]')}>
                                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                                             {item.value.split(', ').map((item, index, array) => (
                                                <span key={index}>
                                                   {item}
                                                   {Boolean(index < array.length - 1) && <>,</>}
                                                </span>
                                             ))}
                                          </div>
                                       </div>
                                    </Chars>
                                 );
                              })}
                           </div>
                        </div>
                     );
                  })}
               </div>
               <Maybe condition={attributesLength > 4}>
                  <BtnShow className="mt-5 md1:mt-4" onClick={() => setAttrActive(prev => !prev)} active={attrActive}>
                     {attrActive ? 'Скрыть' : 'Показать полностью'}
                  </BtnShow>
               </Maybe>
            </Maybe>

            <Maybe condition={description}>
               <BlockDescr title="О проекте" descr={description} />
            </Maybe>
            <Maybe condition={advantages.length}>
               <div className="mt-8">
                  <h3 className="title-2 mb-4">Уникальные квартиры</h3>
                  <div className="grid grid-cols-5 gap-4 md1:overflow-x-auto md1:flex">
                     {advantages.map(item => (
                        <Link to="section-apartments-id" smooth={true} offset={-52 - 12} duration={500} key={item.id} className="md1:min-w-[120px]">
                           <AdvantageCard data={item} textVisible={false} />
                        </Link>
                     ))}
                  </div>
               </div>
            </Maybe>
         </div>
      </section>
   );
};

export default BuildingInfoSecond;
