import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { getIsDesktop, getUserIsBuyer } from '@/redux';
import { ApartmentContext } from '@/context';
import { ElementOldPrice, Maybe, TagCashback, TagDiscount, TagPresent } from '@/ui';
import { numberReplace } from '@/helpers';
import { RequestPrice } from '@/components';

const ApartmentPrice = ({ className }) => {
   const { buildingDiscount, cashbackValue, buildingCashback, present, price, bd_price, buildingHidePrices } = useContext(ApartmentContext);

   const isDesktop = useSelector(getIsDesktop);
   const userIsBuyer = useSelector(getUserIsBuyer);
   const is_discount = bd_price > 0 && bd_price !== price;

   return (
      <div className={className}>
         <div>
            <div className="flex items-center gap-4">
               <Maybe
                  condition={buildingHidePrices && userIsBuyer}
                  fallback={
                     <>
                        <h2 className="title-2">{numberReplace(bd_price || price)} ₽</h2>
                        {is_discount && <ElementOldPrice>{numberReplace(price)} ₽</ElementOldPrice>}
                     </>
                  }>
                  <RequestPrice className="mt-2" />
               </Maybe>
            </div>
            {isDesktop && (
               <>
                  {Boolean(buildingDiscount || cashbackValue || present) && (
                     <div className="flex flex-wrap gap-2 mt-4">
                        <TagDiscount {...buildingDiscount} />
                        {present && <TagPresent present={present} />}
                        <TagCashback cashback={cashbackValue} prefix="Кешбэк" increased={buildingCashback} />
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

export default ApartmentPrice;
