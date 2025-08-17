
import { useContext, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Header.module.scss';

import { IconAdd, IconDoorOpen, IconArrowY, IconArrowSmall, IconClose, IconСamcorder } from '../../ui/Icons';

import { PersonalModal } from '../../ModalsMain/PersonalModal';
import { Tooltip } from '../../ui/Tooltip';

import disableScroll from '../../helpers/disableScroll';
import enableScroll from '../../helpers/enableScroll';
import Logo from './Logo';
import { BuyerRoutesPath, PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Button from '../../uiForm/Button';
import Accordion from '../../ui/Accordion';
import Avatar from '../../ui/Avatar';
import { capitalizeWords } from '../../helpers/changeString';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { ROLE_BUYER } from '../../constants/roles';
import { HeaderContext } from '../../context';
import CityBlock from './CityBlock';
import HeaderActionsTooltips from './HeaderActionsTooltips';
import { checkAuthUser, getWindowSize } from '@/redux';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';
import { useToggleNotification } from '../../hooks/useToggleNotification';
import { openUrl } from '../../helpers/openUrl';
import { Maybe } from '@/ui';

const HeaderActions = ({ maxWidth }) => {
   const {
      dataNav = [],
      isDesktop,
      containerHeader,
      isAdmin = false,
      theme = 'white',
      userInfo,
      isOpenMenu,
      setIsOpenMenu,
      popupPersonalOpen,
      setPopupPersonalOpen,
   } = useContext(HeaderContext);

   const [cookies] = useCookies();
   const authUser = useSelector(checkAuthUser);

   const dispatch = useDispatch();
   const { width } = useSelector(getWindowSize);

   const personalBtnRef = useRef(null);

   const { isVisibleNotification, setIsVisibleNotification, onClose: notifOnClose } = useToggleNotification('auth_notif_status', 5, cookies.loggedIn);

   return (
      <div className={`${styles.headerActions}`}>
         <div
            className={`${styles.headerActionsContainer} ${containerHeader ? 'container' : 'px-4 md1:pr-0'}`}
            style={maxWidth && isDesktop ? { maxWidth } : null}>
            {!isDesktop && (
               <>
                  {isOpenMenu ? (
                     <button
                        onClick={() => {
                           setPopupPersonalOpen(false);
                           setIsOpenMenu(false);
                           enableScroll();
                        }}
                        className={`${styles.MenuBtn} ${styles.MenuBtnActive}`}>
                        <IconClose width={22} height={22} />
                     </button>
                  ) : (
                     <button
                        className={styles.MenuBtn}
                        onClick={() => {
                           setPopupPersonalOpen(false);
                           setIsOpenMenu(true);
                           disableScroll();
                        }}>
                        <div className={styles.burger}>
                           <span className={styles.burgerLine}></span>
                        </div>
                     </button>
                  )}
               </>
            )}
            <Logo />
            {isDesktop && <CityBlock />}
            <div className={styles.headerActionsList}>
               <Maybe condition={width > 350}>
                  <a href={RoutesPath.stream.list} className="flex items-center gap-1.5 mr-3 font-medium md1:mr-2">
                     {isDesktop && <IconСamcorder width={16} height={16} className="stroke-[2px]" />}
                     Live
                     <span className="w-2 h-2 bg-red rounded-full" />
                  </a>
               </Maybe>

               {!isAdmin && (
                  <>
                     {(isEmptyArrObj(userInfo) || userInfo.role?.id === ROLE_BUYER.id) && (
                        <>
                           {isDesktop ? (
                              <button
                                 className="flex items-center gap-2 ml-4 mr-4"
                                 onClick={() => {
                                    if (authUser) {
                                       openUrl(BuyerRoutesPath.purchase.create);
                                    } else {
                                       dispatch(setSelectAccLogModalOpen(true));
                                    }
                                 }}>
                                 <IconAdd width={16} height={16} className="fill-primary400" />
                                 <span className="whitespace-nowrap">Разместить заявку</span>
                              </button>
                           ) : (
                              <button
                                 className={styles.headerAction}
                                 onClick={() => {
                                    if (authUser) {
                                       openUrl(BuyerRoutesPath.purchase.create);
                                    } else {
                                       dispatch(setSelectAccLogModalOpen(true));
                                    }
                                 }}>
                                 <IconAdd width={16} height={16} className="fill-primary400" />
                              </button>
                           )}
                        </>
                     )}
                     <HeaderActionsTooltips />
                  </>
               )}
               <div className="mmd1:ml-4 w-full h-full">
                  <button
                     className={`${styles.headerAction} cut-one ${popupPersonalOpen ? 'bg-primary700' : ''}`}
                     onClick={() => {
                        setIsOpenMenu(false);
                        if (authUser) {
                           setPopupPersonalOpen(prev => !prev);
                        } else {
                           dispatch(setSelectAccLogModalOpen(true));
                        }
                     }}
                     ref={personalBtnRef}>
                     {cookies.loggedIn ? (
                        <>
                           <Avatar src={userInfo.image} title={capitalizeWords(userInfo.name, userInfo.surname)} size={isDesktop ? 32 : 28} />
                           {isDesktop && <p className={`title-4 cut-one ${theme === 'dark' ? '!text-primary400' : ''}`}>{userInfo.name}</p>}

                           {popupPersonalOpen && !isDesktop ? (
                              <IconClose width={20} height={20} className="flex-shrink-0 !fill-dark" />
                           ) : (
                              <div className="w-5">
                                 <IconArrowSmall width={12} height={12} className="flex-shrink-0" />
                              </div>
                           )}
                        </>
                     ) : (
                        <>
                           <IconDoorOpen width={14} height={14} />
                           {isDesktop && <span>Вход и регистрация</span>}
                        </>
                     )}
                  </button>
                  {!authUser &&
                     isDesktop &&
                     personalBtnRef.current &&
                     window.location.pathname !== RoutesPath.loginPhone &&
                     window.location.pathname !== PrivateRoutesPath.login && (
                        <Tooltip
                           mobile
                           ElementTarget={() => <></>}
                           placement="bottom-end"
                           event="click"
                           value={isVisibleNotification}
                           onChange={setIsVisibleNotification}
                           offset={[0, 12]}
                           classNameContent="!px-0 !pt-10 !pb-6 overflow-hidden"
                           classNameRoot="!z-[200] max-w-[300px]"
                           onClose={notifOnClose}
                           close>
                           <div className="px-6">
                              <h3 className="title-2-5 mb-2 !text-white">Авторизируйтесь</h3>
                              <p className="text-defaultMax">Чтобы посмотреть персональные предложения, подарки и кешбэк от застройщиков</p>
                              <Button
                                 size="Small"
                                 className="!px-8 mt-4 w-max"
                                 onClick={() => {
                                    dispatch(setSelectAccLogModalOpen(true));
                                 }}>
                                 Войти
                              </Button>
                           </div>
                        </Tooltip>
                     )}
               </div>
            </div>

            {Boolean(!isDesktop && isOpenMenu) && (
               <div className={styles.Menu}>
                  <div className="pt-4 pb-4 border-top-lightgray">
                     <CityBlock />
                  </div>
                  <div className="flex flex-col">
                     <Accordion
                        defaultValue={[0]}
                        classNameItem="border-top-lightgray"
                        data={dataNav.map(item => {
                           if (!item.name) return;

                           return {
                              button: item.href ? (
                                 <a href={item.href} className="py-4 w-full font-medium">
                                    {item.name}
                                 </a>
                              ) : (
                                 <span className="flex items-center gap-4 justify-between py-4 w-full font-medium">
                                    {item.name}
                                    <IconArrowY className="fill-blue" width={22} height={22} />
                                 </span>
                              ),
                              body:
                                 item.items && item.items.length > 0 ? (
                                    <div className="pb-4 flex flex-col">
                                       {item.items
                                          .flat()
                                          .filter(item => item.mobile !== false)
                                          .map((item, index) => (
                                             <a key={index} href={item.link} className="flex items-center gap-4 justify-between py-4">
                                                <span>{item.name}</span>
                                                {item.subtitle && <span className="text-blue">{item.subtitle}</span>}
                                             </a>
                                          ))}
                                    </div>
                                 ) : null,
                           };
                        })}
                     />

                     <div>
                        {userInfo.role?.id === ROLE_BUYER.id && (
                           <Button variant="secondary" size="Small" Selector="div" className="mt-3 mb-2">
                              <Link
                                 to={BuyerRoutesPath.purchase.create}
                                 onClick={() => set(false)}
                                 className="w-full h-full flex items-center justify-center gap-2">
                                 <IconAdd width={14} height={14} />
                                 Разместить заявку на покупку
                              </Link>
                           </Button>
                        )}
                     </div>
                  </div>
               </div>
            )}
            {authUser && (
               <ModalWrapper condition={popupPersonalOpen}>
                  <PersonalModal condition={popupPersonalOpen} set={setPopupPersonalOpen} />
               </ModalWrapper>
            )}
         </div>
      </div>
   );
};

export default HeaderActions;
