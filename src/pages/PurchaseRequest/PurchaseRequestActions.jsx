import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PurchasePageContext } from '../../context';
import { IconComplain, IconEdit, IconTrash } from '../../ui/Icons';
import { BtnActionBg, BtnActionShare } from '../../ui/ActionBtns';
import { BuyerRoutesPath } from '../../constants/RoutesPath';

const PurchaseRequestActions = ({ className = '' }) => {
   const { data, setConfirmDeleteModal, setIsOpenComplainModal, setIsOpenShareModal, myPurchaseRequest } = useContext(PurchasePageContext);
   const params = useParams();

   return (
      <div className={`white-block-small !py-2 mb-3 ${className}`}>
         <div className="grid grid-cols-2 gap-3">
            {myPurchaseRequest ? (
               <>
                  <Link target="_blank" to={`${BuyerRoutesPath.purchase.edit}${params.id}`} className="w-full h-full block">
                     <BtnActionBg title="Редактировать">
                        <IconEdit width={16} height={16} className="!stroke-[currentColor] !stroke-[1.5px] !fill-none" />
                     </BtnActionBg>
                  </Link>
                  <BtnActionBg title="Закрыть" onClick={() => setConfirmDeleteModal(data.id)}>
                     <IconTrash width={16} height={16} />
                  </BtnActionBg>
               </>
            ) : (
               <>
                  <BtnActionShare set={setIsOpenShareModal} />
                  <BtnActionBg title="Пожаловаться" onClick={() => setIsOpenComplainModal(true)}>
                     <IconComplain width={16} height={16} />
                  </BtnActionBg>
               </>
            )}
         </div>
      </div>
   );
};

export default PurchaseRequestActions;
