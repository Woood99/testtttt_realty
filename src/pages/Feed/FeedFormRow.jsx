import React, { useContext } from 'react';
import FormRow from '../../uiForm/FormRow';
import ResetBtn from '../../uiForm/ResetBtn';
import { FeedContext } from '../../context';
import FeedFormMainFilters from './FeedFormMainFilters';

const FeedFormRow = () => {
   const { reset } = useContext(FeedContext);
   return (
      <FormRow className="grid-cols-[275px_275px_285px_255px_max-content] container">
         <FeedFormMainFilters />
         <ResetBtn
            text="Очистить"
            onClick={e => {
               e.preventDefault();
               reset();
            }}
         />
      </FormRow>
   );
};

export default FeedFormRow;
