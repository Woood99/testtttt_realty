import React, { useContext } from "react";

import { getMaxCashback, isArray, numberReplace } from "@/helpers";

import { BuildingContext } from "@/context";

import { Maybe, MetroItems, Tag, TagCashback, TagPresents, TagTop, TagsDiscounts } from "@/ui";

const BuildingInfo = () => {
	const {
		title,
		cashback,
		present,
		stickers,
		address,
		metro,
		minPrice,
		minBdPrice,
		max_bd_price,
		max_price,
		tags,
		city,
		main_gifts = [],
		second_gifts = [],
		buildingDiscounts,
		buildingCashbacks,
		minBdPricePerMeter,
		minPricePerMeter
	} = useContext(BuildingContext);

	const max_building_cashback = getMaxCashback(buildingCashbacks);
	const cashbackValue = ((max_bd_price || max_price) / 100) * ((cashback || 0) + (max_building_cashback.value || 0));

	return (
		<section>
			<div className='white-block'>
				<h1 className='title-1'>{title}</h1>
				<div className='mt-1 mb-3 md1:my-1'>
					{city},&nbsp; {address || ""}
				</div>
				<MetroItems data={metro} visibleItems={99} className='mb-3' />
				<div className='flex items-center gap-3 mb-3 md1:my-3'>
					<h3 className='title-2'>от {numberReplace(minBdPrice || minPrice || 0)} ₽</h3>
				</div>
				<Maybe condition={cashback || present || stickers?.length}>
					<div className='flex gap-2 flex-wrap'>
						{Boolean(stickers.length) && stickers.map(item => <TagTop top={item.name} key={item.id} />)}
						<TagsDiscounts
							discounts={buildingDiscounts}
							is_building
							by_price={minBdPrice}
							by_area={(minBdPrice || minPrice) / (minBdPricePerMeter || minPricePerMeter)}
						/>
						{Boolean(main_gifts.length || present || second_gifts.length) && (
							<TagPresents
								dataMainGifts={isArray(main_gifts) ? main_gifts.filter(item => item) : []}
								dataSecondGifts={isArray(second_gifts) ? second_gifts.filter(item => item) : []}
								title='Есть подарок'
							/>
						)}
						{Boolean(cashback) && <TagCashback cashback={cashbackValue} increased={max_building_cashback} />}
					</div>
				</Maybe>

				{tags.length > 0 && (
					<div className='mt-4 flex gap-2 flex-wrap'>
						{tags.map((item, index) => (
							<Tag size='small' color='default' key={index}>
								{item.name}
							</Tag>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default BuildingInfo;
