import ModalWrapper from '../../../../ui/Modal/ModalWrapper';
import BUILDING_ICON from '../../../../assets/svg/building.svg';
import CardIcon from '../../../../ui/CardIcon';
import Modal from '../../../../ui/Modal';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../../../redux/helpers/selectors';
import { isAdmin, isBuyer, isSeller } from '../../../../helpers/utils';
import { IconHand, IconHouseBuilding, IconLock2, IconMegaphone, IconMoon, IconUsers, IconUsers2 } from '../../../../ui/Icons';
import { useContext } from 'react';
import { ChatContext } from '../../../../context';

import styles from '../../Chat.module.scss';
import Avatar from '../../../../ui/Avatar';
import { capitalizeWords } from '../../../../helpers/changeString';
import { ElementNavBtn } from '../../../../ui/Elements';
import { ExternalLink } from '../../../../ui/ExternalLink';
import { AuthRoutesPath } from '../../../../constants/RoutesPath';
import CheckboxToggle from '../../../../uiForm/CheckboxToggle';
import { useLocation } from 'react-router-dom';

const MenuModal = ({ options }) => {
   const { setGroupFormModal, setChannelFormModal, setBlockedUserList, themeOptions } = useContext(ChatContext);
   const location = useLocation();
   const { theme, toggleTheme } = themeOptions;
   const { condition, set, setCreateDialogWithDevelopModal, setCreateDialogWithSpecialistModal } = options;

   const userInfo = useSelector(getUserInfo);
   const userIsBuyer = isBuyer(userInfo);
   const userIsAdmin = isAdmin(userInfo);
   const userIsSeller = isSeller(userInfo);

   return (
      <ModalWrapper condition={condition}>
         <Modal
            options={{ overlayClassNames: '_left', modalClassNames: 'mmd1:!w-[400px]', modalContentClassNames: 'md1:flex md1:flex-col !px-3' }}
            condition={condition}
            set={set}>
            {Boolean(userInfo) && (
               <div className="flex flex-col items-center mb-5">
                  <Avatar src={userInfo.image} title={capitalizeWords(userInfo.name, userInfo.surname)} size={72} />

                  {/* для менеджера */}
                  <ExternalLink to={AuthRoutesPath.profile.edit} className="title-3-5 mt-3">{`${userInfo.surname || ''} ${
                     userInfo.name || ''
                  }`}</ExternalLink>
               </div>
            )}

            <div className="flex flex-col border-top-lightgray">
               <div className="mt-2">
                  {(userIsAdmin || userIsSeller) && (
                     <>
                        <button
                           onClick={() => {
                              set(false);
                              setGroupFormModal(true);
                           }}
                           className={styles.ChatMenuButton}>
                           <ElementNavBtn className="flex items-center">
                              <IconUsers className="!fill-blue" />
                              <span>Создать групповой чат</span>
                           </ElementNavBtn>
                        </button>
                        <button
                           onClick={() => {
                              set(false);
                              setChannelFormModal(true);
                           }}
                           className={styles.ChatMenuButton}>
                           <ElementNavBtn className="flex items-center">
                              <IconMegaphone className="fill-blue" />
                              <span>Создать канал</span>
                           </ElementNavBtn>
                        </button>
                     </>
                  )}

                  <button
                     onClick={() => {
                        set(false);
                        setCreateDialogWithDevelopModal(true);
                     }}
                     className={styles.ChatMenuButton}>
                     <ElementNavBtn className="flex items-center">
                        <IconHouseBuilding className="fill-blue" />
                        <span>Застройщики</span>
                     </ElementNavBtn>
                  </button>
                  <button
                     onClick={() => {
                        set(false);
                        setCreateDialogWithSpecialistModal(true);
                     }}
                     className={styles.ChatMenuButton}>
                     <ElementNavBtn className="flex items-center">
                        <IconUsers2 className="fill-blue" />
                        <span>Менеджеры</span>
                     </ElementNavBtn>
                  </button>
                  {Boolean(userIsBuyer) && (
                     <button onClick={() => setBlockedUserList(true)} className={styles.ChatMenuButton}>
                        <ElementNavBtn className="flex items-center">
                           <IconLock2 className="fill-blue" />
                           <span>Заблокированные пользователи</span>
                        </ElementNavBtn>
                     </button>
                  )}
                  {/* {location.pathname === AuthRoutesPath.chat && (
                     <button onClick={() => {}} className={styles.ChatMenuButton}>
                        <ElementNavBtn className="flex items-center">
                           <CheckboxToggle className="items-center w-full" checked={theme === 'dark'} set={()=>{
                              toggleTheme()
                           }} text="">
                              <IconMoon className="fill-blue -order-2" />
                              <span className="-order-1 ml-3 mr-auto text-dark">Ночной режим</span>
                           </CheckboxToggle>
                        </ElementNavBtn>
                     </button>
                  )} */}
               </div>
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default MenuModal;
