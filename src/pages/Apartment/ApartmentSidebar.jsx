import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { PrivateRoutesPath, ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER, RoutesPath } from "@/constants";

import { sendPostRequest } from "@/api";

import { numberReplace } from "@/helpers";

import { ApartmentContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { Sidebar } from "@/components";

import { AnimatedNumber, AnimatedText, BadgeText, BtnActionBg, BtnActionFavorite, BtnActionShare, Chars, ElementOldPrice, UserInfo } from "@/ui";
import { IconEdit, IconTrash } from "@/ui/Icons";

import { Button } from "@/uiForm";

import { DeleteApartmentModal } from "@/ModalsMain";

import ApartmentPrice from "./components/ApartmentPrice";

const ApartmentSidebar = () => {
	const {
		id,
		developer,
		gift_group,
		title,
		city,
		setIsOpenRecordView,
		goToChat,
		goToChatCall,
		setIsOpenShareModal,
		userRole,
		purchaseId,
		buildingDiscount,
		cashbackValue,
		priceByDiscount,
		price
	} = useContext(ApartmentContext);

	const selector = useSelector(state => state.apartment);
	const isDesktop = useSelector(getIsDesktop);

	const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

	const total_amount =
		cashbackValue +
		(selector.info.maxAmount ? selector.info.maxAmount - selector.info.leftPrice : 0) +
		selector.defaultPresents.reduce((acc, item) => acc + (item.oldPrice - (item.newPrice || 0)), 0) +
		(priceByDiscount ? price - priceByDiscount : 0);

	return (
		<Sidebar>
			<div className='flex flex-col white-block-small !pt-2'>
				{isDesktop && (
					<>
						{userRole === ROLE_ADMIN.name ? (
							<div className='grid grid-cols-2 gap-3 mb-4'>
								<Link to={`${PrivateRoutesPath.apartment.edit}${id}`} className='w-full h-full block'>
									<BtnActionBg title='Редактировать'>
										<IconEdit className='!stroke-[currentColor]' width={18} height={18} />
									</BtnActionBg>
								</Link>
								<BtnActionBg title='Удалить' onClick={() => setConfirmDeleteModal(id)}>
									<IconTrash className='stroke-red' width={16} height={16} />
								</BtnActionBg>
							</div>
						) : (
							<div className='grid grid-cols-2 gap-3 mb-4'>
								<BtnActionFavorite
									id={id}
									type='apartment'
									variant='bg'
									className={userRole === ROLE_SELLER.name ? "opacity-60 pointer-events-none" : ""}
								/>
								<BtnActionShare set={setIsOpenShareModal} />
							</div>
						)}
						<h4 className='title-4 mt-2 mb-1'>{title}</h4>
						<ApartmentPrice />
					</>
				)}
				{Boolean(selector.selectedPresents.length || selector.defaultPresents.length) && (
					<div className='mt-4 mmd1:pt-4 md1:mt-2 border-top-lightgray md1:!border-none'>
						{!isDesktop && <h3 className='title-3 mb-2'>Подарки:</h3>}
						<div className='flex flex-col gap-4 scrollbarPrimary overflow-y-auto max-h-[125px] pr-4'>
							{[...selector.defaultPresents, ...selector.selectedPresents].map((item, index) => {
								return (
									<div className='flex gap-4 flex-nowrap' key={index}>
										<span className='font-medium overflow-hidden w-full text-ellipsis whitespace-nowrap'>{item.title}</span>
										<div className='whitespace-nowrap'>
											<ElementOldPrice>{numberReplace(item.oldPrice || 0)} ₽</ElementOldPrice>
										</div>
										<span className='font-medium whitespace-nowrap'>{numberReplace(item.newPrice || 0)} ₽</span>
									</div>
								);
							})}
						</div>
					</div>
				)}
				{Boolean(!Boolean(userRole === ROLE_SELLER.name && purchaseId) && total_amount) && (
					<div className='bg-pageColor p-1 rounded-lg mt-4'>
						<div className='my-2 px-3 flex flex-col gap-2 w-full'>
							{priceByDiscount && (
								<Chars justifyBetween>
									<span className='!text-dark !font-medium'>
										Скидка&nbsp; -{numberReplace(buildingDiscount.value)} {buildingDiscount.type === 1 ? "%" : "₽"}
										{Boolean(buildingDiscount.unit === 2) && "/м²"}
									</span>
									<span className='!text-[#b57600] !font-medium'>
										<AnimatedNumber to={price - priceByDiscount} />
										&nbsp;₽
									</span>
								</Chars>
							)}
							{Boolean(cashbackValue) && (
								<Chars justifyBetween>
									<span className='!text-dark !font-medium'>Кешбэк наличными</span>
									<span className='!text-[#009532] !font-medium'>
										<AnimatedNumber to={cashbackValue} />
										&nbsp;₽
									</span>
								</Chars>
							)}

							{(selector.selectedPresents.length > 0 || selector.defaultPresents.length > 0) && gift_group && (
								<Chars justifyBetween>
									<span className='!text-dark !font-medium'>Подарки на сумму</span>
									<span className='!text-dark !font-medium'>
										<AnimatedNumber
											to={
												Number(selector.info.maxAmount) -
												Number(selector.info.leftPrice) +
												Number(
													selector.defaultPresents.reduce((acc, item) => acc + (item.oldPrice - (item.newPrice || 0)), 0)
												)
											}
										/>
										&nbsp;₽
									</span>
								</Chars>
							)}
						</div>
						<div className='flex items-center justify-between w-full font-medium bg-white py-2 px-3 rounded-lg'>
							<span className='text-bigSmall'>Ваша выгода:</span>
							<span className='text-bigSmall'>
								<AnimatedNumber to={total_amount} />
								&nbsp;₽
							</span>
						</div>
					</div>
				)}
				{isDesktop && (userRole === ROLE_BUYER.name || (userRole === ROLE_SELLER.name && purchaseId)) && (
					<div
						className={`mt-6 flex flex-col gap-2 w-full ${
							Boolean(selector.selectedPresents.length + selector.defaultPresents.length) ? "gap-4" : ""
						}`}>
						{userRole === ROLE_BUYER.name && (
							<>
								<Button onClick={goToChat} className='relative'>
									Написать в чат
								</Button>
								<Button variant='secondary' onClick={() => setIsOpenRecordView(true)} className='relative'>
									{Boolean(selector.selectedPresents.length + selector.defaultPresents.length) && (
										<BadgeText color='dark' variant='absolute' className='-top-3 -right-3' animated>
											Подарки закреплены за вами
										</BadgeText>
									)}
									<AnimatedText texts={["Записаться на просмотр", "Записаться на онлайн-показ"]} intervalTime={3000} />
								</Button>
								<Button variant='secondary' onClick={goToChatCall}>
									Позвонить
								</Button>
							</>
						)}
						{userRole === ROLE_SELLER.name && purchaseId && (
							<Button
								onClick={() => {
									const now = dayjs();

									const requestParams = {
										order_id: purchaseId,
										property_type: "apartment",
										property_id: id,
										date: now.format("YYYY-MM-DD"),
										time: now.format("HH:mm")
									};

									sendPostRequest("/seller-api/suggestions/create", requestParams).then(res => {
										alert("Ваше предложение отправлено.");
									});
								}}>
								Предложить объект
							</Button>
						)}
					</div>
				)}
				<UserInfo
					className='mt-8'
					avatar={developer?.avatar_url}
					name={developer?.name}
					pos={developer?.pos}
					centered
					nameHref={`${RoutesPath.developers.inner}${developer?.id}?city=${city}`}
				/>
			</div>
			<DeleteApartmentModal
				options={{
					condition: confirmDeleteModal,
					set: setConfirmDeleteModal,
					redirectUrl: `${RoutesPath.listing}`
				}}
			/>
		</Sidebar>
	);
};

export default ApartmentSidebar;
