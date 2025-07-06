import React, { useContext } from 'react';

import TitleIcon from '../TitleIcon';
import { IconStorm } from '../../../ui/Icons';
import { MainTableContent, MainTableHeader } from '../../../ui/MainTable';
import { CardRowPurchaseBasic } from '../../../ui/CardsRow';

import BannerInfo from '../../../components/BannerInfo';
import Button from '../../../uiForm/Button';
import { RoutesPath } from '../../../constants/RoutesPath';
import { HomeContext } from '..';

const PurchaseRequests = () => {
   const { ordersCards } = useContext(HomeContext);

   if (!ordersCards.data.length) return;

   return (
      <section className="mt-3">
         <div className="container-desktop">
            <div className="bg-white shadow-primary py-8 rounded-[20px]">
               <TitleIcon
                  className="px-8"
                  icon={<IconStorm width={24} height={24} />}
                  text="Заявки на покупку каталог"
                  link={{ href: RoutesPath.purchase.list, name: 'Смотреть всё' }}
               />
               <div>
                  <div className="px-8">
                     <MainTableHeader className="grid-cols-[600px_350px_max-content]">
                        <span>Параметры</span>
                        <span>Бюджет</span>
                        <span>Заявка от</span>
                     </MainTableHeader>
                  </div>
                  <MainTableContent className="mt-3 md1:flex md1:flex-col md1:gap-8">
                     {ordersCards.data.map((item, index) => (
                        <CardRowPurchaseBasic
                           data={{
                              ...item,
                              calc_props: item.badges,
                           }}
                           key={index}
                           classNameContent="grid grid-cols-[600px_350px_max-content]"
                           className="py-5 px-8"
                           href={`${RoutesPath.purchase.inner}${item.id}`}
                        />
                     ))}
                  </MainTableContent>
               </div>
            </div>
            <BannerInfo backgroundColor="rgb(160, 186, 252)" className="mt-3">
               <h3 className="title-3">Оставить заявку если вам нужно особенное жильё под ваши требования</h3>
               <Button className="md1:w-full">Оставить заявку</Button>
            </BannerInfo>
         </div>
      </section>
   );
};

export default PurchaseRequests;
