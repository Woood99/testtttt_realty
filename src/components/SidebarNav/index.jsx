import cn from 'classnames';
import React from 'react';
import { ElementNavBtn, ElementNavBtnCount } from '../../ui/Elements';
import { Link } from 'react-router-dom';
import { BuyerRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import { getFilteredObject } from '../../helpers/objectMethods';
import { getCurrentCitySelector, getUserInfo } from '@/redux';
import { useSelector } from 'react-redux';
import { isBuyer } from '../../helpers/utils';
import isEmptyArrObj, { isNumber } from '../../helpers/isEmptyArrObj';

export const SidebarNav = ({ data = [], className }) => {
   return (
      <nav className={cn('flex flex-col gap-2 items-start white-block !p-4', className)}>
         {data.map((item, index) => {
            return (
               <Link key={index} to={item.link || '#'} className="w-full group">
                  <ElementNavBtn active={Boolean(item.active)}>
                     {item.label}
                     {isNumber(item.count) && <ElementNavBtnCount active={Boolean(item.active)}>{item.count}</ElementNavBtnCount>}
                  </ElementNavBtn>
               </Link>
            );
         })}
      </nav>
   );
};

export const SidebarNavElements = ({ className, dataVariant = 'primary', activeObj = { name: '', count: 0 } }) => {
   const userInfo = useSelector(getUserInfo);
   const userIsBuyer = isBuyer(userInfo);
   const { data: cityData } = useSelector(getCurrentCitySelector);

   const DATA_SIDEBAR_NAV = getDataSidebarNav(dataVariant, activeObj, { userIsBuyer, cityData, userInfo });

   return <SidebarNav data={DATA_SIDEBAR_NAV} className={className} />;
};

const getDataSidebarNav = (dataVariant, activeObj = {}, options) => {
   let result = [];

   if (dataVariant === 'primary') {
      result = [
         {
            name: 'developers',
            label: 'Застройщики',
            link: RoutesPath.developers.list,
            count: (options.cityData && options.cityData.find(item => item.name === 'Каталог застройщиков')?.count) || 0,
         },
         {
            name: 'specialists',
            label: 'Менеджеры',
            link: RoutesPath.specialists.list,
            count: (options.cityData && options.cityData.find(item => item.name === 'Каталог специалистов')?.count) || 0,
         },
         getFilteredObject(options.userIsBuyer, {
            name: 'my-purchase',
            label: 'Мои заявки на покупку',
            link: BuyerRoutesPath.purchase.list,
            count: options.userInfo.counts?.orders || 0,
         }),
         getFilteredObject(options.userIsBuyer, {
            name: 'view-purchase',
            label: 'Записи на просмотр',
            link: BuyerRoutesPath.view,
            count: options.userInfo.counts?.suggestions || 0,
         }),
         getFilteredObject(options.userIsBuyer, {
            name: 'create-purchase',
            label: 'Создать заявку',
            link: BuyerRoutesPath.purchase.create,
         }),
      ];
   }

   if (dataVariant === 'second') {
      result = [
         {
            name: 'purchases',
            label: 'Заявки на покупку',
            link: RoutesPath.purchase.list,
            count: 0,
         },
         getFilteredObject(options.userIsBuyer, {
            name: 'my-purchase',
            label: 'Мои заявки на покупку',
            link: BuyerRoutesPath.purchase.list,
            count: options.userInfo.counts?.orders || 0,
         }),
         getFilteredObject(options.userIsBuyer, {
            name: 'create-purchase',
            label: 'Создать заявку',
            link: BuyerRoutesPath.purchase.create,
         }),
      ];
   }

   return result
      .map(item => {
         if (item.name && item.name === activeObj.name) {
            return { ...item, active: true, count: activeObj.count };
         } else {
            return item;
         }
      })
      .filter(item => !isEmptyArrObj(item));
};
