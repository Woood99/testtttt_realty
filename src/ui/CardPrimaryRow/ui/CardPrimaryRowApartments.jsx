import { CardPrimaryRowContext } from "..";
import cn from "classnames";
import { useContext } from "react";

import convertSum from "../../../helpers/convertSum";
import isEmptyArrObj from "../../../helpers/isEmptyArrObj";
import { CharsFlat } from "../../Chars";
import styles from "../CardPrimaryRow.module.scss";
import { pricesClassName } from "../pricesClassName";

const CardPrimaryRowApartments = () => {
	const { apartments, visibleRooms = [], max_price } = useContext(CardPrimaryRowContext);

	if (!Boolean(apartments && apartments.length > 0)) return;

	return (
		<div className={cn(styles.CardPrimaryRowPrices, pricesClassName(apartments))}>
			{apartments
				.sort((a, b) => a.rooms - b.rooms)
				.map((item, index) => {
					return (
						<CharsFlat isActive={!isEmptyArrObj(visibleRooms) ? visibleRooms.includes(item.rooms) : true} key={index}>
							<span className='text-small'>
								{item.rooms === 0 ? "Студии" : `${item.rooms}-комн`} &nbsp;
								{max_price < 1000000000 && `от ${item.min_area} м²`}
							</span>
							<span className='text-small'>от {convertSum(item.bd_price || item.price)} ₽</span>
						</CharsFlat>
					);
				})}
		</div>
	);
};

export default CardPrimaryRowApartments;
