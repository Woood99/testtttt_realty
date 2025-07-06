import React from 'react';

import styles from './CheckboxRoom.module.scss';

const CheckboxRoom = ({ label, checked = false, onChange, size = 'Default', isValid }) => {
   return (
      <label
         className={`${styles.CheckboxRoomRoot} ${styles[`CheckboxRoom${size}`]} ${checked ? styles.CheckboxRoomActive : ''} ${
            isValid ? styles.CheckboxRoomError : ''
         }`}>
         <input type="checkbox" checked={checked} onChange={onChange} className={styles.CheckboxRoomInput} />
         <span className={styles.CheckboxRoomWrapper}>{label}</span>
      </label>
   );
};

export default CheckboxRoom;
