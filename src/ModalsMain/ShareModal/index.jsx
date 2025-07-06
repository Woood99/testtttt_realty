import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useLocation } from 'react-router-dom';

import Modal from '../../ui/Modal';

import styles from './ShareModal.module.scss';
import { IconCopy, IconOk, IconTelegram, IconVk, IconWhatsApp } from '../../ui/Icons';
import Button from '../../uiForm/Button';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { NotificationTimer } from '../../ui/Tooltip';
import { createPortal } from 'react-dom';

const ShareModal = ({ condition, set, children, title = 'Поделиться объявлением', url = '' }) => {
   const location = useLocation();
   const fullUrl = url || window.location.origin + location.pathname + location.search + location.hash;

   const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullUrl)}`;
   const tgUrl = `https://telegram.me/share/url?url=${encodeURIComponent(fullUrl)}&text=Inrut`;
   const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(fullUrl)}`;
   const okUrl = `https://connect.ok.ru/offer?url=${encodeURIComponent(fullUrl)}`;

   const [copied, setCopied] = useState(false);

   const handleCopy = () => {
      setCopied(true);
   };

   return (
      <ModalWrapper condition={condition}>
         <Modal
            options={{ overlayClassNames: '_right', modalClassNames: styles.root, modalContentClassNames: 'mmd1:!px-12' }}
            set={set}
            condition={condition}>
            {children ? <div className={styles.children}>{children}</div> : ''}
            <h2 className="title-3 modal-title-gap">{title}</h2>
            <div className="grid grid-cols-2 gap-3">
               <CopyToClipboard text={fullUrl} onCopy={handleCopy}>
                  <Button variant="secondary" className="col-span-2 gap-4" active={copied}>
                     <IconCopy width={18} height={18} className={`${copied ? 'fill-white' : ''}`} />
                     {copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
                  </Button>
               </CopyToClipboard>
               <a href={whatsAppUrl} className={styles.shareAppItem} target="_blank">
                  <IconWhatsApp width={26} height={26} className="fill-green" />
                  <span>WhatsApp</span>
               </a>
               <a href={tgUrl} className={styles.shareAppItem} target="_blank">
                  <IconTelegram width={26} height={26} className="fill-blue" />
                  <span>Telegram</span>
               </a>
               <a href={vkUrl} className={styles.shareAppItem} target="_blank">
                  <IconVk width={26} height={26} className="fill-blue" />
                  <span>Вконтакте</span>
               </a>
               <a href={okUrl} className={styles.shareAppItem} target="_blank">
                  <IconOk width={26} height={26} className="fill-orange" />
                  <span>Одноклассники</span>
               </a>
            </div>
            {copied &&
               createPortal(
                  <NotificationTimer show={copied} set={setCopied} onClose={() => setCopied(false)} classListRoot="min-w-[300px] !pt-6 !z-[99999]">
                     <p className="font-medium text-defaultMax">Ссылка скопирована</p>
                  </NotificationTimer>,
                  document.getElementById('overlay-wrapper')
               )}
         </Modal>
      </ModalWrapper>
   );
};

export default ShareModal;
