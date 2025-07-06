import React, { useContext } from 'react';
import { EmptyTextBlock } from '../../components/EmptyBlock';
import { MyObjectsContext } from '../../context';
import CardPrimary from '../../ui/CardPrimary';
import { IconEye, IconFavoriteStroke } from '../../ui/Icons';
import { Link } from 'react-router-dom';
import Button from '../../uiForm/Button';
import RepeatContent from '../../components/RepeatContent';
import { CardPrimarySkeleton } from '../../ui/CardPrimary/CardPrimarySkeleton';

const MyObjectsItems = () => {
   const { complexes } = useContext(MyObjectsContext);

   return (
      <>
         <h2 className="title-2 mb-6">Мои объекты</h2>
         <div className="grid grid-cols-2 gap-4 md3:grid-cols-1">
            {complexes.isLoading ? (
               <RepeatContent count={3}>
                  <CardPrimarySkeleton className="p-0" />
               </RepeatContent>
            ) : (
               <>
                  {complexes.items.length === 0 && (
                     <div className="col-span-full">
                        <EmptyTextBlock block={false}>
                           <h4 className="title-3 mt-4">У вас пока нет объектов</h4>
                        </EmptyTextBlock>
                     </div>
                  )}
                  {complexes.items.map((card, index) => {
                     return (
                        <CardPrimary
                           {...card}
                           key={index}
                           userVisible={false}
                           customControls={
                              <>
                                 <div title={`${card.building_visited || 0} просмотров`} className="z-10 flex items-center gap-2">
                                    <IconEye className="fill-blue" width={14} height={14} /> {card.building_visited || 0}
                                 </div>
                                 <div title={`${card.likes || 0} добавили в избранное`} className="z-10 flex items-center gap-2">
                                    <IconFavoriteStroke className="fill-red" width={14} height={14} /> {card.added_to_favorites || 0}
                                 </div>
                                 <div title={`${card.application || 0} записалось на просмотр`} className="z-10 flex items-center gap-2">
                                    <IconEye className="fill-dark" width={14} height={14} /> {card.application || 0}
                                 </div>
                              </>
                           }>
                           <Button size="34" variant="secondary" Selector="div" className="mt-2 relative z-[99]">
                              <Link to={'#'} target="_blank" className="w-full h-full flex items-center justify-center">
                                 Добавление к объекту
                              </Link>
                           </Button>
                        </CardPrimary>
                     );
                  })}
               </>
            )}
         </div>
      </>
   );
};

export default MyObjectsItems;
