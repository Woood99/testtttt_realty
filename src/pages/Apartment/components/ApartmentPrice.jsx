import React, { useContext } from 'react';
import { ApartmentContext } from '../../../context';
import { TagCashback, TagDiscount, TagPresent } from '../../../ui/Tag';
import numberReplace from '../../../helpers/numberReplace';
import { ElementOldPrice } from '../../../ui/Elements';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';

const ApartmentPrice = ({ className }) => {
   const { buildingDiscount, cashbackValue, buildingCashback, present, price, bd_price } = useContext(ApartmentContext);

   const isDesktop = useSelector(getIsDesktop);

   const is_discount = bd_price > 0 && bd_price !== price;

   return (
      <div className={className}>
         <div>
            <div className="flex items-center gap-4">
               <h2 className="title-2">{numberReplace(bd_price || price)} ₽</h2>
               {is_discount && <ElementOldPrice>{numberReplace(price)} ₽</ElementOldPrice>}
            </div>
            {isDesktop && (
               <>
                  {Boolean(buildingDiscount || cashbackValue || present) && (
                     <div className="flex flex-wrap gap-2 mt-4">
                        <TagDiscount {...buildingDiscount} />
                        <TagCashback cashback={cashbackValue} prefix="Кешбэк" increased={buildingCashback} />
                        {present && <TagPresent present={present} />}
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

export default ApartmentPrice;
