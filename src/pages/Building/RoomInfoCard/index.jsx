import React, { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { PrivateRoutesPath, ROLE_ADMIN, ROLE_BUYER, RoutesPath } from "@/constants";

import { getSrcImage, isArray, numberReplace } from "@/helpers";

import { getIsDesktop } from "@/redux";

import { RequestPrice } from "@/components";

import { BtnAction, ElementOldPrice, Maybe, TagCashback, TagDiscount, TagPresents, TagsMoreHeight, ThumbPhoto, Tooltip } from "@/ui";
import { IconEdit, IconTrash } from "@/ui/Icons";

import { DeleteApartmentModal } from "@/ModalsMain";

import styles from "./RoomInfoCard.module.scss";

const RoomInfoCard = memo(({ data, room, userRole }) => {
	const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
	const isDesktop = useSelector(getIsDesktop);

	const isUserBuyer = userRole === ROLE_BUYER.name;

	const price = data.bd_price || data.price;

	const is_discount = data.bd_price > 0 && data.bd_price !== data.price;

	const cashbackPrc = ((data.cashback / data.price) * 100 || 0) + (data.buildingCashback?.value || 0);
	const cashbackValue = (price / 100) * cashbackPrc;

	const priceContent = useMemo(
		() => (
			<>
				<Maybe
					condition={data.hidePrices && isUserBuyer}
					fallback={
						<div className='flex flex-col gap-1 md1:!flex-row whitespace-nowrap md1:gap-2 md1:items-center'>
							<h3 className={`title-3 ${styles.RoomInfoCardTitle}`}>{numberReplace(price)} ₽</h3>
							{is_discount && <ElementOldPrice className='self-start w-max'>{numberReplace(data.price)} ₽</ElementOldPrice>}
						</div>
					}></Maybe>
			</>
		),
		[price, data.price, is_discount]
	);

	return (
		<div className={styles.RoomInfoCardRoot}>
			<Link to={`${RoutesPath.apartment}${data.id}`} className={styles.RoomInfoCardLink} target='_blank' rel='noopener noreferrer' />
			<ThumbPhoto>
				<img src={getSrcImage(data.image)} width={85} height={85} alt='' />
			</ThumbPhoto>
			<div className='flex flex-col gap-1 md3:gap-3'>
				<Maybe condition={!isDesktop}>{priceContent}</Maybe>
				<div className={styles.RoomInfoCardAttr}>
					{room === 0 ? "Студия" : `${room}-комн.`} {data.area} м², {data.floor} эт.
				</div>
				<div className='flex items-center gap-4 flex-wrap md3:gap-1'>
					{data.frame && <span>Корпус: {data.frame}</span>}
					{data.deadline && <span>Сдача: {data.deadline}</span>}
				</div>
			</div>
			<Maybe condition={isDesktop}>{priceContent}</Maybe>
			<div className='flex gap-4 md1:gap-3 md1:items-start relative md1:col-span-2 md1:mt-4 md1:flex-wrap'>
				<TagDiscount {...(data.buildingDiscount || {})} prefix='' />
				<Maybe condition={data.main_gifts.length || data.present || data.second_gifts.length}>
					<TagPresents
						dataMainGifts={isArray(data.main_gifts) ? data.main_gifts.filter(item => item) : []}
						dataSecondGifts={isArray(data.second_gifts) ? data.second_gifts.filter(item => item) : []}
						title='Есть подарок'
					/>
				</Maybe>
				<TagCashback cashback={cashbackValue} increased={data.buildingCashback} prefix='Кешбэк' />
				<Maybe condition={data.tags?.length}>
					<TagsMoreHeight data={data.tags} className='pointer-events-none !w-auto' />
				</Maybe>
			</div>
			<Maybe condition={data.hidePrices && isUserBuyer}>
				<RequestPrice />
			</Maybe>

			<Maybe condition={userRole === ROLE_ADMIN.name}>
				<div className='flex gap-4 md1:gap-2 md1:flex-col md1:col-start-3 md1:col-end-4 md1:row-start-1 md1:row-end-2'>
					<Tooltip
						ElementTarget={() => (
							<Link to={`${PrivateRoutesPath.apartment.edit}${data.id}`}>
								<BtnAction Selector='div' className='relative z-50'>
									<IconEdit className='stroke-blue stroke-[1.5px]' width={18} height={18} />
								</BtnAction>
							</Link>
						)}>
						Редактировать
					</Tooltip>
					<Tooltip
						ElementTarget={() => (
							<BtnAction className='relative z-50' onClick={() => setConfirmDeleteModal(data.id)}>
								<IconTrash className='fill-red' width={16} height={16} />
							</BtnAction>
						)}>
						Удалить
					</Tooltip>
				</div>
			</Maybe>
			<DeleteApartmentModal
				options={{
					condition: confirmDeleteModal,
					set: setConfirmDeleteModal
				}}
			/>
		</div>
	);
});

export default RoomInfoCard;
