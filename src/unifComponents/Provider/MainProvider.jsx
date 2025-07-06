import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthUser, getHelpSliceSelector } from '../../redux/helpers/selectors';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';
import SelectAccLogModal from '../../ModalsMain/SelectAccLogModal';
import CookieBlock from '../../components/CookieBlock';
import { useMainProvider } from './useMainProvider';

const MainProvider = () => {
   const { selectAccLogModalOpen } = useSelector(getHelpSliceSelector);
   useMainProvider();

   const authUser = useSelector(checkAuthUser);
   const dispatch = useDispatch();

   return (
      <div>
         {!authUser && (
            <SelectAccLogModal
               condition={selectAccLogModalOpen}
               set={value => {
                  dispatch(setSelectAccLogModalOpen(value));
               }}
            />
         )}
         <CookieBlock />
      </div>
   );
};

export default MainProvider;
