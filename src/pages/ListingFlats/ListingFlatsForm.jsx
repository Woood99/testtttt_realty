import React, { useContext, useState } from 'react';
import ListingFlatsFormRow from './ListingFlatsFormRow';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ListingFlatsFormModal from './ListingFlatsFormModal';
import { ListingFlatsContext } from '../../context';

const ListingFlatsForm = ({}) => {
   const { filterCount } = useContext(ListingFlatsContext);

   const [isOpenMoreFilter, setIsOpenMoreFilter] = useState(false);

   const onSubmitHandler = e => {
      e.preventDefault();
   };

   return (
      <form onSubmit={onSubmitHandler} className="form-row-sticky">
         <ListingFlatsFormRow filterCount={filterCount} setIsOpenMoreFilter={setIsOpenMoreFilter} />
         <ModalWrapper condition={isOpenMoreFilter}>
            <ListingFlatsFormModal condition={isOpenMoreFilter} set={setIsOpenMoreFilter} filterCount={filterCount} />
         </ModalWrapper>
      </form>
   );
};

export default ListingFlatsForm;
