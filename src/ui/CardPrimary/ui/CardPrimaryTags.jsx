import { CardPrimaryContext } from "..";
import { useContext } from "react";

import { getMaxCashback } from "../../../helpers/cashbackUtils";
import findObjectWithMinValue from "../../../helpers/findObjectWithMinValue";
import { isArray } from "../../../helpers/isEmptyArrObj";
import { TagCashback, TagPresents, TagTop, TagsDiscounts } from "../../Tag";
import { TagsMoreHeight } from "../../TagsMore";

const CardPrimaryTagsTop = () => {
	const { cashback, max_price, max_bd_price, present, top, main_gifts, stickers, second_gifts, buildingDiscounts, buildingCashbacks, apartments } =
		useContext(CardPrimaryContext);

	const has = Boolean(cashback || present || top);
	const has_cashback = Boolean(cashback);
	const has_present = Boolean(main_gifts?.length || present || second_gifts?.length);
	const has_stickers = Boolean(stickers?.length);

	const max_building_cashback = getMaxCashback(buildingCashbacks);
	const cashbackValue = ((max_bd_price || max_price) / 100) * ((cashback || 0) + (max_building_cashback.value || 0));
	const minValue = findObjectWithMinValue(apartments, "bd_price");

	if (!has) return;

	return (
		<div className='flex gap-1.5 flex-wrap mb-3'>
			{has_stickers && (
				<div className='flex flex-wrap gap-1.5'>
					<TagsMoreHeight data={[...stickers.map(item => ({ ...item, type: "sticker" }))]} increaseHeight maxHeightDefault={50} />
				</div>
			)}
			<TagsDiscounts discounts={buildingDiscounts} is_building by_price={minValue?.bd_price} by_area={minValue?.min_area} />
			{has_present && (
				<TagPresents
					dataMainGifts={isArray(main_gifts) ? main_gifts.filter(item => item) : []}
					dataSecondGifts={isArray(second_gifts) ? second_gifts.filter(item => item) : []}
					title='Есть подарок'
				/>
			)}

			{top && <TagTop top={top} />}
		</div>
	);
};

export default CardPrimaryTagsTop;
