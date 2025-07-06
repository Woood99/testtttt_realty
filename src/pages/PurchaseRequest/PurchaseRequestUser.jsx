import React, { useContext, useState } from 'react';
import Button from '../../uiForm/Button';
import { PurchasePageContext } from '../../context';
import Avatar from '../../ui/Avatar';
import { Link, useParams } from 'react-router-dom';
import { RoutesPath } from '../../constants/RoutesPath';

const PurchaseRequestUser = ({ className = '' }) => {
   const { data, userIsSeller, userIsBuyer, myPurchaseRequest, emptyObjectModal, setEmptyObjectModal } = useContext(PurchasePageContext);
   const params = useParams();

   if (!Boolean(data.user)) return;

   return (
      <div className={`flex flex-col text-center items-center white-block-small p-6 mmd1:mb-4 ${className}`}>
         <Avatar size={95} src={data.user?.avatarUrl} title={data.user.name} />
         <span className="font-medium mt-5">{myPurchaseRequest ? 'Вы' : data.user.name}</span>
         {(data.user.pos || data.user.last_seen_online) && (
            <span className="text-primary400 mt-1.5">
               {data.user.pos} {data.user.last_seen_online ? `был в сети ${data.user.last_seen_online}` : ''}
            </span>
         )}

         {userIsSeller && (
            <div className="flex flex-col w-full mt-5">
               <Link target="_blank" to={`${RoutesPath.listingFlats}?purchase=${params.id}`}>
                  <Button Selector="div">Предложить объект</Button>
               </Link>
            </div>
         )}
         {userIsBuyer && !myPurchaseRequest && (
            <div className="flex flex-col w-full mt-5">
               <Button onClick={() => setEmptyObjectModal(true)}>Предложить объект</Button>
            </div>
         )}
      </div>
   );
};

export default PurchaseRequestUser;
