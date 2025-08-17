import React from 'react';

import Modal from '../../ui/Modal';

import CardLink from '../../ui/CardLink';

import styles from './AddModal.module.scss';
import { BuyerRoutesPath } from '../../constants/RoutesPath';

const AddModal = ({ condition, set }) => {
   return (
      <Modal options={{ overlayClassNames: '_right', modalClassNames: styles.root }} set={set} condition={condition}>
         <h2 className="title-2 modal-title-gap">Добавить</h2>
         <div className={styles.items}>
            <CardLink href={BuyerRoutesPath.purchase.create}>
               <span>Заявка на покупку недвижимости</span>
            </CardLink>
         </div>
      </Modal>
   );
};

export default AddModal;
