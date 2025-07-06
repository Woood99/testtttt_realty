import React from 'react';
import { useDispatch } from 'react-redux';

import RoomsContainer from '../CheckboxRoom/RoomsContainer';
import CheckboxRoom from '../CheckboxRoom';

const Rooms = ({ dispatchChange, roomsSelector }) => {
   const dispatch = useDispatch();

   const changeCheckboxRoom = (e, id) => {
      dispatch(dispatchChange({ id, value: e.target.checked }));
   };
   
   return (
      <RoomsContainer>
         {roomsSelector.options.map((option, index) => {
            return (
               <CheckboxRoom
                  key={index}
                  checked={roomsSelector.value.includes(option.value)}
                  onChange={e => changeCheckboxRoom(e, option.value)}
                  label={option.label}
                  size={option.value === 0 ? 'Studio' : 'Default'}
               />
            );
         })}
      </RoomsContainer>
   );
};

export default Rooms;
