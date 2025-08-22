import { CardPrimaryContext } from "..";
import cn from "classnames";
import { useContext } from "react";

import convertSum from "../../../helpers/convertSum";
import numberReplace from "../../../helpers/numberReplace";
import { CharsFlat } from "../../Chars";
import styles from "../CardPrimary.module.scss";

const CardPrimaryApartments = () => {
	const { apartments, quantity } = useContext(CardPrimaryContext);

	if (!Boolean(apartments && apartments.length > 0)) return;

	return (
		<div className={cn(styles.CardPrimaryQuantity, "mt-4")}>
			<p className={styles.CardPrimaryQuantityBtn}>{numberReplace(quantity)} квартир от застройщика</p>
			<div className='mt-3 flex flex-col gap-2.5'>
				{apartments
					.sort((a, b) => a.rooms - b.rooms)
					.map((item, index) => {
						return (
							<CharsFlat key={index}>
								<span>
									{item.rooms === 0 ? "Студии" : `${item.rooms}-комн`} &nbsp; от {item.min_area} м²
								</span>
								<span>от {convertSum(item.bd_price || item.price || 0)} ₽</span>
							</CharsFlat>
						);
					})}
			</div>
		</div>
	);
};

export default CardPrimaryApartments;
