import cn from "classnames";
import { useContext, useRef } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { checkAuthUser, getWindowSize } from "@/redux";

import { Maybe } from "@/ui";
import { IconAdd, IconArrowDown, IconArrowY, IconClose, IconDoorOpen, IconСamcorder } from "@/ui/Icons";

import { PersonalModal } from "../../ModalsMain/PersonalModal";
import { BuyerRoutesPath, PrivateRoutesPath, RoutesPath } from "../../constants/RoutesPath";
import { ROLE_BUYER } from "../../constants/roles";
import { HeaderContext } from "../../context";
import { capitalizeWords } from "../../helpers/changeString";
import disableScroll from "../../helpers/disableScroll";
import enableScroll from "../../helpers/enableScroll";
import isEmptyArrObj from "../../helpers/isEmptyArrObj";
import { openUrl } from "../../helpers/openUrl";
import { useToggleNotification } from "../../hooks/useToggleNotification";
import { setSelectAccLogModalOpen } from "../../redux/slices/helpSlice";
import Accordion from "../../ui/Accordion";
import Avatar from "../../ui/Avatar";
import ModalWrapper from "../../ui/Modal/ModalWrapper";
import { Tooltip } from "../../ui/Tooltip";
import Button from "../../uiForm/Button";

import CityBlock from "./CityBlock";
import styles from "./Header.module.scss";
import HeaderActionsTooltips from "./HeaderActionsTooltips";
import Logo from "./Logo";

const HeaderActions = ({ maxWidth }) => {
	const {
		dataNav = [],
		isDesktop,
		containerHeader,
		isAdmin = false,
		theme = "white",
		userInfo,
		isOpenMenu,
		setIsOpenMenu,
		popupPersonalOpen,
		setPopupPersonalOpen
	} = useContext(HeaderContext);

	const [cookies] = useCookies();
	const authUser = useSelector(checkAuthUser);

	const dispatch = useDispatch();
	const { width } = useSelector(getWindowSize);

	const personalBtnRef = useRef(null);

	const {
		isVisibleNotification,
		setIsVisibleNotification,
		onClose: notifOnClose
	} = useToggleNotification("auth_notif_status", 5, cookies.loggedIn);

	return (
		<div className={`${styles.headerActions}`}>
			<div
				className={`${styles.headerActionsContainer} ${containerHeader ? "container" : "px-4 md1:pr-0"}`}
				style={maxWidth && isDesktop ? { maxWidth } : null}>
				<Maybe condition={!isDesktop}>
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
				</Maybe>
				<Logo />
				{isDesktop && <CityBlock />}
				<div className={styles.headerActionsList}>
					<a href={RoutesPath.stream.list} className='flex items-center gap-1.5 mr-3 font-medium md1:mr-3 text-primary400'>
						{isDesktop && <IconСamcorder width={16} height={16} className='stroke-[3px]' />}
						Live
					</a>
					<HeaderActionsTooltips />
					<Maybe condition={isEmptyArrObj(userInfo) || userInfo.role?.id === ROLE_BUYER.id}>
						<button
							className={styles.headerAction}
							onClick={() => {
								if (authUser) {
									openUrl(BuyerRoutesPath.purchase.create);
								} else {
									dispatch(setSelectAccLogModalOpen(true));
								}
							}}>
							<IconAdd width={16} height={16} className='stroke-primary400' />
							{isDesktop && <span className='whitespace-nowrap text-primary400 font-medium'>Разместить заявку</span>}
						</button>
					</Maybe>

					<div className={cn("h-full", authUser && "ml-2")}>
						<button
							className={cn(!cookies.loggedIn ? styles.headerAction : "h-full px-1.5 md1:px-3 flex items-center gap-2 text-primary400")}
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
									<Avatar
										src={userInfo.image}
										title={capitalizeWords(userInfo.name, userInfo.surname)}
										size={isDesktop ? 32 : 28}
									/>
									{popupPersonalOpen && <IconClose width={20} height={20} className='flex-shrink-0 !fill-dark' />}
								</>
							) : (
								<>
									<IconDoorOpen width={14} height={14} className='stroke-primary400' />
									{isDesktop && <span className='whitespace-nowrap'>Вход и регистрация</span>}
								</>
							)}
						</button>
						<Maybe
							condition={
								!authUser &&
								isDesktop &&
								personalBtnRef.current &&
								window.location.pathname !== RoutesPath.loginPhone &&
								window.location.pathname !== PrivateRoutesPath.login
							}>
							<Tooltip
								mobile
								ElementTarget={() => <></>}
								placement='bottom-end'
								event='click'
								value={isVisibleNotification}
								onChange={setIsVisibleNotification}
								offset={[0, 12]}
								classNameContent='!px-0 !pt-10 !pb-6 overflow-hidden'
								classNameRoot='!z-[200] max-w-[300px]'
								onClose={notifOnClose}
								close>
								<div className='px-6'>
									<h3 className='title-2-5 mb-2 !text-white'>Авторизируйтесь</h3>
									<p className='text-defaultMax'>Чтобы посмотреть персональные предложения, подарки и кешбэк от застройщиков</p>
									<Button
										size='Small'
										className='!px-8 mt-4 w-max'
										onClick={() => {
											dispatch(setSelectAccLogModalOpen(true));
										}}>
										Войти
									</Button>
								</div>
							</Tooltip>
						</Maybe>
					</div>
				</div>

				{Boolean(!isDesktop && isOpenMenu) && (
					<div className={styles.Menu}>
						<div className='pt-4 pb-4 border-top-lightgray'>
							<CityBlock />
						</div>
						<div className='flex flex-col'>
							<Accordion
								defaultValue={[0]}
								classNameItem='border-top-lightgray'
								data={dataNav.map(item => {
									if (!item.name) return;

									return {
										button: item.href ? (
											<a href={item.href} className='py-4 w-full font-medium'>
												{item.name}
											</a>
										) : (
											<span className='flex items-center gap-4 justify-between py-4 w-full font-medium'>
												{item.name}
												<IconArrowY className='fill-blue' width={22} height={22} />
											</span>
										),
										body:
											item.items && item.items.length > 0 ? (
												<div className='pb-4 flex flex-col'>
													{item.items
														.flat()
														.filter(item => item.mobile !== false)
														.map((item, index) => (
															<a key={index} href={item.link} className='flex items-center gap-4 justify-between py-4'>
																<span>{item.name}</span>
																{item.subtitle && <span className='text-blue'>{item.subtitle}</span>}
															</a>
														))}
												</div>
											) : null
									};
								})}
							/>

							<div>
								{userInfo.role?.id === ROLE_BUYER.id && (
									<Button variant='secondary' size='Small' Selector='div' className='mt-3 mb-2'>
										<Link
											to={BuyerRoutesPath.purchase.create}
											onClick={() => set(false)}
											className='w-full h-full flex items-center justify-center gap-2'>
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
