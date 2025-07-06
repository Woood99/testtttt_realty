import React from 'react';

import styles from './CardRow.module.scss';
import { Badges } from '../Badges';
import UserInfo from '../UserInfo';
import numberReplace from '../../helpers/numberReplace';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SellerRoutesPath } from '../../constants/RoutesPath';
import { getLastSeenOnline } from '../../helpers/changeDate';
import { IconChat, IconChecked, IconLocation } from '../Icons';
import { getFirstLetter, getShortNameSurname } from '../../helpers/changeString';
import { getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import cn from 'classnames';
import { ExternalLink } from '../ExternalLink';
import { BtnAction } from '../ActionBtns';
import Avatar from '../Avatar';
import { CharsColItems } from '../Chars';
import WebSkeleton from '../Skeleton/WebSkeleton';

export const CardRow = ({ children, className = '' }) => {
   return <div className={cn(styles.CardRowRoot, className)}>{children}</div>;
};

export const CardRowBg = ({ children, className = '' }) => {
   return <div className={cn(styles.CardRowRoot, styles.CardRowRootBg, className)}>{children}</div>;
};

export const CardRowPurchaseBasic = ({
   data = {},
   className = '',
   classNameContent = '',
   href = '#',
   userVisible = true,
   bg = false,
   children,
   actionsChildren,
}) => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <CardRow
         className={cn(
            'relative py-5 px-8 md1:px-4 [&:not(:last-child)]:border-b border-lightGray hover:bg-pageColor hover:border-pageColor',
            !isDesktop && '!flex',
            bg && styles.CardRowRootBg,
            className
         )}>
         {Boolean(href) && <ExternalLink to={href} className={cn('CardLinkElement z-20')} />}
         <div className="w-full flex flex-col gap-3">
            <div className={cn('flex mmd1:items-center gap-4 md1:flex-col', classNameContent)}>
               <div className="flex-grow md1:flex md1:gap-4">
                  <ParametersLayout data={data} />
                  {Boolean(actionsChildren && !isDesktop) && <div className="relative z-20 ml-auto">{actionsChildren}</div>}
               </div>
               {Boolean(isDesktop) && <UserInfoLayout userVisible={userVisible} data={data} />}
               {Boolean(actionsChildren && isDesktop) && <div className="relative z-20 ml-auto">{actionsChildren}</div>}
            </div>
            <Badges data={data.calc_props} className="z-20" />
            {Boolean(!isDesktop) && <UserInfoLayout userVisible={userVisible} data={data} />}
         </div>
      </CardRow>
   );
};

export const CardRowPurchaseSelect = ({ data, className, value = false }) => {
   return (
      <CardRow className={cn('grid-cols-[1fr_max-content] z-10 border', className, value ? 'border-blue' : 'border-primary600')}>
         {Boolean(value) && (
            <div className="absolute -top-1.5 -right-1.5 bg-blue w-5 h-5  rounded-full flex items-center justify-center" aria-hidden>
               <IconChecked className="fill-none stroke-white" width={10} height={10} />
            </div>
         )}
         <ParametersLayout data={data} className="title-4" />
      </CardRow>
   );
};

// ============================================================================================================

const ParametersLayout = ({ data, className = '' }) => {
   const roomsArr = data.rooms ? data.rooms.filter(item => item !== 0) : [];
   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className={cn('flex items-center gap-1 flex-wrap max-w-[95%] title-3', className, !isDesktop && 'title-4')}>
         <span>Новостройки.</span>
         {data.rooms && data.rooms.length > 0 && (
            <span>
               {data.rooms[0] === 0 && 'Студия,'} {roomsArr.length > 0 ? `${roomsArr.join(',')}-комн.` : ''}
            </span>
         )}
         {data.area_total_from && <span>от {data.area_total_from} м²</span>}
         {data.area_total_to && <span>до {data.area_total_to} м²</span>}
         {data.floor_from && <span>от {data.floor_from} эт.</span>}
         {data.floor_to && <span>до {data.floor_to} эт.</span>}
         {data.price && (
            <span>
               {numberReplace(data.price || 0)} {data.price_type === 'month_payment' ? '₽/мес.' : '₽'}
            </span>
         )}
      </div>
   );
};

const UserInfoLayout = ({ userVisible, data }) => {
   const userInfo = useSelector(getUserInfo);

   const myPurchase = data?.user?.id && data?.user?.id === userInfo.id;

   return (
      <>
         {userVisible && data.user && (
            <UserInfo
               textAvatar={data.user.name}
               avatar={data.user.image}
               name={myPurchase ? 'Вы' : `${data.user.name} ${data.user.surname ? `${getFirstLetter(data.user.surname)}.` : ''}`}
               centered
            />
         )}
      </>
   );
};

// ============================================================================================================

export const UserCardInfo = ({ data, gridCols = 'grid-cols-[215px_200px_90px_120px_90px_90px_90px_1fr]', children, link = true }) => {
   if (!data) return;
   return (
      <CardRowBg className={gridCols}>
         {link && <Link to={`${SellerRoutesPath.buyer}${data.id}/statistics`} className="CardLinkElement" />}
         <UserInfo avatar={data.user.avatarUrl} name={data.user.name} pos={data.user.pos} centered />
         <div>{getLastSeenOnline(data.last_seen_online)}</div>
         {children}
      </CardRowBg>
   );
};

export const UserCardBasic = ({ data, href = '#', className, charsData = [], onClickMessage = null, onClickloginAs }) => {
   return (
      <div
         className={cn(
            'relative py-5 px-8 md1:px-4 [&:not(:last-child)]:border-b border-lightGray hover:bg-pageColor hover:border-pageColor',
            className
         )}>
         {Boolean(href) && <ExternalLink to={href} className={cn('CardLinkElement z-20')} />}
         <div className="flex gap-4 items-center md1:items-start">
            <div className="gap-4 items-center md1:flex">
               <Avatar size={70} src={data.photo || data.image} title={data.name} />
            </div>
            <div className="flex gap-4 items-center flex-grow md1:flex-col md1:items-start">
               <div className="mr-6">
                  <div className="flex gap-2 flex-col">
                     <h3 className="title-4 cut-one w-[165px]">{getShortNameSurname(data.name, data.surname)}</h3>
                     {Boolean(data.agency) && <p className="text-primary400 text-small">{data.agency}</p>}
                     {Boolean(data.year) && <p className="text-primary400 text-small">Год основания {data.year} г.</p>}
                  </div>
               </div>
               {Boolean(charsData.length) && <CharsColItems className="!gap-x-5 !gap-y-3 flex-col" data={charsData} />}
               {onClickMessage && (
                  <button className="blue-link relative z-30 md1:mt-2 flex gap-2 text-small mmd1:ml-auto" size="Small" onClick={onClickMessage}>
                     <IconChat width={16} height={16} className="fill-blue" />
                     Написать сообщение
                  </button>
               )}
               {onClickloginAs && (
                  <button className="blue-link relative z-30 md1:mt-2 flex gap-2 text-small mmd1:ml-auto" size="Small" onClick={onClickloginAs}>
                     Войти как
                  </button>
               )}
            </div>
         </div>
      </div>
   );
};

export const UserCardBasicSkeleton = () => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className="py-5 px-8 md1:px-4">
         <div className="flex items-center gap-3 w-full h-[80px]">
            <WebSkeleton className="w-[80px] h-[80px] md1:w-[70px] md1:h-[70px] rounded-full" />
            <div className="flex-grow flex gap-4">
               <div className="flex flex-col gap-2 w-full">
                  <WebSkeleton className="w-[150px] md1:w-3/4 h-6 rounded-lg" />
                  <WebSkeleton className="w-[150px] md1:w-3/4 h-6 rounded-lg" />
               </div>
               {isDesktop && (
                  <>
                     <WebSkeleton className="w-2/6 h-6 rounded-lg ml-auto" />
                     <WebSkeleton className="w-2/6 h-6 rounded-lg" />
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export const UserCardSkeleton = () => {
   return (
      <div className="flex items-center gap-3 w-full">
         <WebSkeleton className="w-10 h-10 rounded-full" />
         <WebSkeleton className="w-4/5 h-10 rounded-lg" />
      </div>
   );
};
