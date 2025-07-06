import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../uiForm/Button';
import { useApartment } from './useApartment';
import { BtnActionText } from '../../../ui/ActionBtns';
import { IconTrash } from '../../../ui/Icons';
import DeleteApartmentModal from '../../../ModalsMain/DeleteApartmentModal';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import { ExternalLink } from '../../../ui/ExternalLink';
import ApartmentForm from './ApartmentForm';

const ApartmentEdit = () => {
   const apartmentOptions = useApartment(null, 'edit');
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
   const params = useParams();

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <div className="flex items-center justify-between">
                  <h2 className="title-2">Редактировать квартиру</h2>
                  <div className="flex items-center gap-4">
                     <ExternalLink to={`${PrivateRoutesPath.apartment.create}${apartmentOptions?.data?.building_id}?copy=${params.id}`}>
                        <Button size="Small" Selector="div">
                           Скопировать
                        </Button>
                     </ExternalLink>
                     <BtnActionText
                        className="!px-0"
                        onClick={() => {
                           setConfirmDeleteModal(params.id);
                        }}>
                        <IconTrash width={16} height={16} className="!fill-red" />
                        <span className="text-dark font-medium">Удалить квартиру</span>
                     </BtnActionText>
                  </div>
               </div>
            </div>
            <ApartmentForm options={apartmentOptions} />
         </div>
         <DeleteApartmentModal
            options={{
               condition: confirmDeleteModal,
               set: setConfirmDeleteModal,
               redirectUrl: `${PrivateRoutesPath.objects.edit}${apartmentOptions?.data?.building_id}`,
            }}
         />
      </main>
   );
};

export default ApartmentEdit;
