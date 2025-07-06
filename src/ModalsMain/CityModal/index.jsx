import React, { useEffect, useState } from 'react';
import styles from './CityModal.module.scss';

import Modal from '../../ui/Modal';
import { getCitiesSelector, getUserInfo } from '../../redux/helpers/selectors';
import { isAdmin } from '../../helpers/utils';
import { useSelector } from 'react-redux';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import Button from '../../uiForm/Button';

const CityModal = ({ condition, set, onSubmit = () => {}, currentCity }) => {
   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   const cities = useSelector(getCitiesSelector);

   const [activeCity, setActiveCity] = useState(currentCity);

   useEffect(() => {
      setActiveCity(currentCity);
   },[currentCity])
   
   const onClickCity = item => {
      setActiveCity(item);
   };

   return (
      <Modal
         options={{ overlayClassNames: '_left', modalClassNames: styles.CityModalRoot, modalContentClassNames: 'md1:flex md1:flex-col' }}
         set={set}
         condition={condition}>
         <h2 className="title-2 modal-title-gap">Выбор города</h2>
         <div className="flex flex-col flex-grow">
            <div className={styles.CityModalItems}>
               {userIsAdmin
                  ? cities.map(item => {
                       return (
                          <Button
                             onClick={() => onClickCity(item)}
                             active={item.name === activeCity.name}
                             className={`${styles.CityModalItem}`}
                             variant="secondary"
                             key={item.id}>
                             {item.name}
                          </Button>
                       );
                    })
                  : cities.map(item => {
                       return (
                          <Button
                             onClick={() => onClickCity(item)}
                             active={item.name === activeCity.name}
                             className={`${styles.CityModalItem}`}
                             variant="secondary"
                             key={item.id}>
                             {item.name}
                          </Button>
                       );
                    })}
            </div>
            <div className="mt-8 pt-6 border-top-lightgray md1:mt-auto md1:w-full">
               <Button
                  className={styles.CityModalSave}
                  onClick={() => {
                     if (isEmptyArrObj(activeCity)) return;
                     if (currentCity.id === activeCity.id) {
                        set(false);
                     }
                     const city = cities.find(item => item.id === activeCity.id);
                     onSubmit(city);
                  }}>
                  Сохранить
               </Button>
            </div>
         </div>
      </Modal>
   );
};

export default CityModal;
