import React, { useState } from 'react';
import cn from 'classnames';
import styles from './PresentCard.module.scss';
import { ElementOldPrice } from '../Elements';
import numberReplace from '../../helpers/numberReplace';
import { IconBasket, IconClose, IconEdit, IconTrash } from '../Icons';
import Button from '../../uiForm/Button';
import getSrcImage from '../../helpers/getSrcImage';
import ModalWrapper from '../Modal/ModalWrapper';
import Modal from '../Modal';
import { ThumbPhotoFull } from '../ThumbPhoto';
import { GetDescrHTML } from '../../components/BlockDescr/BlockDescr';
import { NotificationTimer } from '../Tooltip';
import { createPortal } from 'react-dom';
import Quantity from '../../uiForm/Quantity';
import { useSelector } from 'react-redux';
import { getWindowSize } from '../../redux/helpers/selectors';

export const PresentCard = props => {
   const {
      id,
      image,
      title,
      name,
      specification,
      checked,
      onChange = () => {},
      className = '',
      classNameRoot = '',
      oldPrice,
      newPrice,
      old_price,
      new_price,
      value,
      controls = false,
      deleteCard,
      editCard,
      actions = true,
      count = 0,
   } = props;
   const [modalOpen, setModalOpen] = useState(false);
   const { isDesktop, width } = useSelector(getWindowSize);

   const [showNotification, setShowNotification] = useState(false);
   return (
      <article className={classNameRoot}>
         <div className={`${styles.PresentCardRoot} ${styles.PresentCardBorderRoot} ${className} ${value && !checked ? '_disabled-opacity' : ''}`}>
            <div className="CardLinkElement z-40" onClick={() => setModalOpen(true)} />
            <img src={getSrcImage(image)} className={cn('rounded-xl', isDesktop ? 'w-[140px] h-[135px]' : 'w-[85px] h-[90px]')} alt="" />
            <div className={styles.PresentCardInfo}>
               <p className={`title-4 ${styles.PresentCardTitle}`}>{title || name}</p>
               {specification && <button className={`blue-link ${styles.PresentCardSpec}`}>Посмотреть спецификацию</button>}

               <div className="mt-3 flex items-center gap-1.5 text-verySmall">
                  <span>Стоимость</span>
                  <ElementOldPrice>{numberReplace(oldPrice || old_price || 0)} ₽</ElementOldPrice>
                  <span className="font-medium">{numberReplace(newPrice || new_price || 0)} ₽</span>
               </div>
               {!controls ? (
                  <>
                     {actions ? (
                        <>
                           {!checked ? (
                              <Button
                                 variant="secondary"
                                 size="34"
                                 className={`w-max mt-auto z-50 flex items-center gap-1.5 ml-auto`}
                                 onClick={() => {
                                    onChange(!checked, id);
                                    if (!checked) {
                                       setShowNotification('add');
                                    } else {
                                       setShowNotification('delete');
                                    }
                                 }}>
                                 <IconBasket width={16} height={16} />
                                 Добавить
                              </Button>
                           ) : (
                              <div className="mt-auto ml-auto">
                                 <Quantity
                                    disabledIncrement={value}
                                    count={count}
                                    onChangeIncrement={() => {
                                       onChange(true, id);
                                       setShowNotification('add');
                                    }}
                                    onChangeDecrement={() => {
                                       onChange(false, id);
                                       setShowNotification('delete');
                                    }}
                                 />
                              </div>
                           )}
                        </>
                     ) : (
                        <Button variant="secondary" size="34" className="w-max mt-auto z-50 flex items-center gap-1.5" disabled>
                           <IconBasket width={16} height={16} />
                           Добавлен
                        </Button>
                     )}
                  </>
               ) : (
                  <div className="relative z-50 flex items-center gap-6 mt-auto">
                     <button type="button" className="relative z-50" onClick={editCard}>
                        <IconEdit width={17} height={17} className="fill-none stroke-blue stroke-[1.5px]" />
                     </button>
                     <button type="button" className="relative z-50" onClick={deleteCard}>
                        <IconTrash width={17} height={17} className="fill-red" />
                     </button>
                  </div>
               )}
            </div>
         </div>
         {!controls && (
            <ModalWrapper condition={modalOpen}>
               <PresentCardModal
                  condition={modalOpen}
                  set={setModalOpen}
                  data={props}
                  onChange={() => onChange(!checked, id)}
                  value={checked}
                  actions={actions}
               />
            </ModalWrapper>
         )}

         {showNotification === 'add' &&
            createPortal(
               <NotificationTimer
                  style={{ zIndex: 99999 }}
                  show={showNotification}
                  set={setShowNotification}
                  onClose={() => setShowNotification(false)}
                  classListRoot="min-w-[440px] md1:min-w-[300px] md1:w-[300px]">
                  <span className="font-medium text-defaultMax">Подарок добавлен в чат и в запись на просмотр</span>
               </NotificationTimer>,
               document.getElementById('overlay-wrapper')
            )}
         {showNotification === 'delete' &&
            createPortal(
               <NotificationTimer
                  style={{ zIndex: 99999 }}
                  show={showNotification}
                  set={setShowNotification}
                  onClose={() => setShowNotification(false)}
                  classListRoot="min-w-[300px]">
                  <span className="font-medium text-defaultMax">Подарок удалён</span>
               </NotificationTimer>,
               document.getElementById('overlay-wrapper')
            )}
      </article>
   );
};

export const PresentCardModal = ({ condition, set, data, onChange, value, actions = true }) => {
   return (
      <Modal condition={condition} set={set} options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[700px]' }}>
         <ThumbPhotoFull>
            <img src={getSrcImage(data.image)} className="w-full h-full !object-contain" />
         </ThumbPhotoFull>
         <div className="mt-4">
            <h2 className="title-2">{data.title || data.name}</h2>

            {Boolean(data.descr || data.description) && (
               <div className={`mt-2`}>
                  <GetDescrHTML data={data.descr || data.description} />
               </div>
            )}
            {data.details && (
               <div className="mt-6">
                  <h3 className="title-4 mb-1">Дополнительная информация</h3>
                  <GetDescrHTML data={data.details} />
               </div>
            )}
         </div>
         {actions && (
            <Button
               variant="secondary"
               className="mt-8 w-full z-50 flex items-center gap-1.5"
               onClick={() => {
                  onChange();
                  set(false);
               }}>
               {!value ? (
                  <>
                     <IconBasket width={16} height={16} />
                     Добавить
                  </>
               ) : (
                  <>
                     <IconClose width={16} height={16} />
                     Удалить
                  </>
               )}
            </Button>
         )}
      </Modal>
   );
};
