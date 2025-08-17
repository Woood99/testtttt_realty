import React from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
	AuthRoutesPath,
	BuyerRoutesPath,
	COOKIE_MAX_AGE,
	PrivateRoutesPath,
	ROLE_ADMIN,
	ROLE_BUYER,
	ROLE_SELLER,
	RoutesPath,
	SellerRoutesPath
} from "@/constants";

import { getDataRequest } from "@/api";

import { useAuth } from "@/hooks";

import { capitalizeWords, changePhoneFormat } from "@/helpers";

import { getIsDesktop, getUserInfo } from "@/redux";

import { Avatar, ElementNavBtn, ElementNavBtnCount, Maybe, Modal } from "@/ui";
import {
	IconAdd,
	IconBasket2,
	IconComparison,
	IconExit,
	IconFavoriteStroke,
	IconHouseLaptop,
	IconNotifStroke,
	IconSettings,
	IconWalletStroke
} from "@/ui/Icons";

import { Button } from "@/uiForm";

export const PersonalModal = ({ condition, set }) => {
	const [cookies, setCookie, removeCookie] = useCookies();
	const userInfo = useSelector(getUserInfo);

	const isDesktop = useSelector(getIsDesktop);

	const { setAuthUser, logout } = useAuth();

	const role_id = userInfo.role?.id;

	const onClickLogout = () => {
		if (!cookies.loggedIn) return;
		logout().then(() => {
			setTimeout(() => {
				if (window.location.pathname !== RoutesPath.loginPhone) {
					window.location.href = RoutesPath.home;
				}
			}, 100);
		});
	};

	return (
		<Modal
			options={{
				overlayClassNames: "_right md1:!top-[50px]",
				modalClassNames: "mmd1:!w-[420px]",
				modalContentClassNames: "mmd1:!px-5 md1:!pt-8"
			}}
			set={set}
			condition={condition}
			closeBtn={isDesktop}>
			<div className='flex flex-col items-center'>
				<Avatar src={userInfo.image} title={capitalizeWords(userInfo.name, userInfo.surname)} size={72} />
				<h3 className='title-3 mt-3'>{`${userInfo.surname || ""} ${userInfo.name || ""}`}</h3>
				<Maybe condition={userInfo.phone}>
					<p className='mt-1.5 text-primary400'>{changePhoneFormat(userInfo.phone)}</p>
				</Maybe>
			</div>
			<div className='mt-2 flex justify-center'>
				<Link to={AuthRoutesPath.profile.edit} onClick={() => set(false)} className='blue-link'>
					Управление аккаунтом
				</Link>
			</div>

			<div className='mt-6'>
				<div className='border-top-lightgray'>
					{role_id === ROLE_BUYER.id && (
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
					{role_id === ROLE_ADMIN.id && (
						<>
							<Link to={PrivateRoutesPath.dashboardAdmin} onClick={() => set(false)} className='w-full border-top-lightgray py-2'>
								<ElementNavBtn>
									<IconSettings />
									<span>Создание/настройка системы</span>
								</ElementNavBtn>
							</Link>

							<Link to={"/"} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Мои объекты</span>
									<ElementNavBtnCount>{userInfo.objects_count || 0}</ElementNavBtnCount>
								</ElementNavBtn>
							</Link>
							<Link to={RoutesPath.purchase.list} onClick={() => set(false)} className='w-full py-1'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Все заявки на покупку</span>
								</ElementNavBtn>
							</Link>
							<Link to={RoutesPath.purchase.list} onClick={() => set(false)} className='w-full py-1'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Покупатели</span>
								</ElementNavBtn>
							</Link>
							<Link to={"/"} onClick={() => set(false)} className='w-full py-1'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Запрос на просмотр</span>
								</ElementNavBtn>
							</Link>
						</>
					)}
					{role_id === ROLE_SELLER.id && (
						<Button variant='secondary' size='Small' Selector='div' className='mt-3 mb-2'>
							<Link
								to={SellerRoutesPath.home}
								onClick={() => set(false)}
								className='w-full h-full flex items-center justify-center gap-2'>
								Кабинет
							</Link>
						</Button>
					)}
					{role_id === ROLE_SELLER.id && cookies.login_as_admin && (
						<Button
							variant='secondary'
							size='Small'
							className='w-full mt-2 mb-5'
							onClick={async () => {
								const {
									data: { token }
								} = await getDataRequest("/api/impersonation/stop", { token: cookies.access_token });
								setCookie("loggedIn", true, { maxAge: COOKIE_MAX_AGE, path: "/" });
								setCookie("access_token", token, { maxAge: COOKIE_MAX_AGE, path: "/" });
								removeCookie("login_as_admin", { path: "/" });
								setAuthUser();
							}}>
							Войти как администратор
						</Button>
					)}

					<a href={RoutesPath.chat} className='w-full py-1 group'>
						<ElementNavBtn className='flex items-center'>
							<IconHouseLaptop />
							<span>Чат</span>
							<ElementNavBtnCount>{userInfo.counts?.dialogs || 0}</ElementNavBtnCount>
						</ElementNavBtn>
					</a>
					{role_id === ROLE_BUYER.id && (
						<>
							<Link to={BuyerRoutesPath.view} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconBasket2 />
									<span>Записи на просмотр</span>
									<ElementNavBtnCount>{userInfo.counts?.suggestions || 0}</ElementNavBtnCount>
								</ElementNavBtn>
							</Link>
							<Link to={BuyerRoutesPath.walletPage} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconWalletStroke />
									<span>Кошелёк</span>
									<ElementNavBtnCount>{userInfo.purchase_count || 0} ₽</ElementNavBtnCount>
								</ElementNavBtn>
							</Link>
							<Link to={BuyerRoutesPath.purchase.list} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconBasket2 />
									<span>Мои заявки на покупку</span>
									<ElementNavBtnCount>{userInfo.counts?.orders || 0}</ElementNavBtnCount>
								</ElementNavBtn>
							</Link>

							<ElementNavBtn className='flex items-center group'>
								<IconNotifStroke />
								<span>Уведомления</span>
								<ElementNavBtnCount>{userInfo.counts?.notifications || 0}</ElementNavBtnCount>
							</ElementNavBtn>
							<Link to={RoutesPath.favorites} onClick={() => set(false)} className='w-full py-1'>
								<ElementNavBtn className='flex items-center'>
									<IconFavoriteStroke />
									<span>Избранное</span>
								</ElementNavBtn>
							</Link>
							<Link to={RoutesPath.comparison} onClick={() => set(false)} className='w-full py-1'>
								<ElementNavBtn className='flex items-center'>
									<IconComparison />
									<span>Сравнение</span>
								</ElementNavBtn>
							</Link>
						</>
					)}
					{role_id === ROLE_SELLER.id && (
						<>
							<Link to={SellerRoutesPath.object.list} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Мои объекты</span>
									<ElementNavBtnCount>{userInfo.counts?.objects || 0}</ElementNavBtnCount>
								</ElementNavBtn>
							</Link>
							<a href={SellerRoutesPath.purchase.list_buyers} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Мои покупатели</span>
								</ElementNavBtn>
							</a>
							<a href={SellerRoutesPath.purchase.list_all} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Все заявки на покупку</span>
								</ElementNavBtn>
							</a>
							<Link to={SellerRoutesPath.view} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Записи на просмотр</span>
								</ElementNavBtn>
							</Link>
							<Link to={SellerRoutesPath.calendar_view} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Календарь</span>
								</ElementNavBtn>
							</Link>
							<Link to={SellerRoutesPath.specialists} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Менеджеры отдела продаж</span>
								</ElementNavBtn>
							</Link>
							<Link to={SellerRoutesPath.objects_developer} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Объекты застройщика</span>
								</ElementNavBtn>
							</Link>
							<Link to={SellerRoutesPath.wallet} onClick={() => set(false)} className='w-full py-1 group'>
								<ElementNavBtn className='flex items-center'>
									<IconHouseLaptop />
									<span>Кошелёк</span>
								</ElementNavBtn>
							</Link>
						</>
					)}
				</div>
				<button className='w-full border-top-lightgray py-2' onClick={onClickLogout}>
					<ElementNavBtn>
						<IconExit />
						<span>Выйти</span>
					</ElementNavBtn>
				</button>
			</div>
		</Modal>
	);
};
