import React, { useState } from 'react';

import styles from './LogIn.module.scss';

import AVATAR from '../../../assets/img/avatar.png';
import Button from '../../../uiForm/Button';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import { LoginPhoneModal } from '../../LoginPhone';

const LogIn = () => {
   const [popupLoginPhoneOpen, setPopupLoginPhoneOpen] = useState(false);
   return (
      <div className={styles.logIn}>
         <div className={styles.rowTop}>
            <h3 className="title-2">Авторизируйтесь</h3>
            <img loading="lazy" src={AVATAR} className={styles.avatar} width="70" height="70" alt="" />
         </div>
         <p className={styles.descr}>Чтобы посмотреть персональные предложения, подарки и кешбэк от застройщиков</p>
         <Button className="w-full md1:mt-8" onClick={() => setPopupLoginPhoneOpen(true)}>
            Войти
         </Button>
         <ModalWrapper condition={popupLoginPhoneOpen}>
            <LoginPhoneModal condition={popupLoginPhoneOpen} set={setPopupLoginPhoneOpen} />
         </ModalWrapper>
      </div>
   );
};

export default LogIn;
