import { useContext } from 'react';
import { HeaderContext } from '../../context';
import ModalWrapper from '../../ui/Modal/ModalWrapper';

import styles from './Header.module.scss';
import { IconLocation } from '../../ui/Icons';
import { sendPostRequest } from '../../api/requestsApi';
import { updateMainInfo } from '../../redux/slices/mainInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentCitySelector } from '@/redux';
import CityModal from '../../ModalsMain/CityModal';

const CityBlock = () => {
   const { isDesktop, currentCity, popupCityOpen, setPopupCityOpen } = useContext(HeaderContext);
   const dispatch = useDispatch();

   const currentCityObj = useSelector(getCurrentCitySelector);

   const onClickSave = city => {
      if (!city) {
         return;
      }

      sendPostRequest('/api/city/get-info', { city: city.id }).then(res => {
         const data = {
            id: city.id,
            name: city.name,
            data: res.data,
            geo: [city.latitude, city.longitude],
         };
         localStorage.setItem('cityData', JSON.stringify(data));
         dispatch(updateMainInfo(data));
         setPopupCityOpen(false);
         window.location.reload();
      });
   };

   return (
      <div className={styles.headerCity}>
         <button className={`${styles.headerAction} md1:!p-0 w-full`} onClick={() => setPopupCityOpen(true)}>
            <div className="w-full gap-2.5 flex items-center">
               <IconLocation width={12} height={14} className="md1:!fill-dark" />
               <span className="md1:font-medium md1:!text-dark">{currentCity || 'Город не выбран'}</span>
            </div>
            {!isDesktop && <span className="blue-link !font-normal">Изменить</span>}
         </button>
         <ModalWrapper condition={popupCityOpen}>
            <CityModal onSubmit={onClickSave} currentCity={currentCityObj} condition={popupCityOpen} set={setPopupCityOpen} />
         </ModalWrapper>
      </div>
   );
};

export default CityBlock;
