import React, { memo, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import cn from 'classnames';

import BuildingTabs from '../BuildingTabs';
import BuildingFilter from '../BuildingFilter';
import { BuildingApartsContext, BuildingContext } from '../../../context';
import { ROLE_ADMIN } from '../../../constants/roles';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import Button from '../../../uiForm/Button';
import ObjectAdvantages from '../../../admin/pages/Object/ObjectAdvantages';
import DiscountCashbackApartmentsListModal from '../../../admin/modals/discount-cashback/DiscountCashbackApartmentsListModal';

const BuildingApartments = ({ data = null, frames = [], tags = [], advantages = [], userRole, children, className, variant = 'default' }) => {
   const { apartmentsLastUpdate } = useContext(BuildingContext);
   const params = useParams();

   const [filtersResult, setFiltersResult] = useState({});

   const [layouts, setLayouts] = useState({});
   const [layoutsIsLoading, setLayoutsIsLoading] = useState(true);

   const [showDiscountModal, setShowDiscountModal] = useState(false);

   return (
      <BuildingApartsContext.Provider
         value={{ layouts, setLayouts, filtersResult, setFiltersResult, layoutsIsLoading, setLayoutsIsLoading, frames, tags, advantages, userRole }}>
         <div className={cn('white-block md1:px-0', className)}>
            {userRole === ROLE_ADMIN.name && variant === 'default' ? (
               <div className="flex justify-between gap-2 md1:mx-4">
                  <h2 className="title-2">Квартиры комплекса</h2>
                  <div className="flex gap-2">
                     {data && <ObjectAdvantages data={data} frames={frames} />}

                     <Button size="Small" onClick={() => setShowDiscountModal('discount')}>
                        Скидка
                     </Button>
                     <Button size="Small" onClick={() => setShowDiscountModal('cashback')}>
                        Кешбэк
                     </Button>
                     <Link to={`${PrivateRoutesPath.apartment.create}${params.id}`} target="_blank">
                        <Button Selector="div" size="Small">
                           Добавить квартиру
                        </Button>
                     </Link>
                  </div>
               </div>
            ) : (
               <h2 className="title-2 md1:mx-4">Квартиры от застройщика</h2>
            )}
            {userRole !== ROLE_ADMIN.name && variant === 'default' && (
               <p className="mt-2 text-primary400 text-small md1:mx-4">Информация о квартирах обновлена {apartmentsLastUpdate}</p>
            )}
            <BuildingFilter />
            <BuildingTabs />

            <DiscountCashbackApartmentsListModal
               condition={showDiscountModal}
               set={setShowDiscountModal}
               options={{
                  type: showDiscountModal,
                  frames,
                  id: params.id,
                  is_edit: false,
               }}
            />

            {children}
         </div>
      </BuildingApartsContext.Provider>
   );
};

export default memo(BuildingApartments);
