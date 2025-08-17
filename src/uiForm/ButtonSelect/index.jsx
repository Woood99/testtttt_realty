import cn from "classnames";

import discountImg from "@/assets/img/discount.png";
import presentImg from "@/assets/img/present.png";

import { Maybe } from "@/ui";

const ButtonSelect = ({ type = "default", onClick, children, isActive = false }) => {
	return (
		<button
			type='button'
			className={cn(
				"border border-solid border-graySecond h-10 rounded-lg flex items-center gap-2 px-3 relative flex-shrink-0",
				isActive && "!border-blue !shadow-[inset_0_0_0_1px_var(--blue)]"
			)}
			onClick={onClick}>
			<Maybe condition={type === "present"}>
				<img src={presentImg} width={18} height={18} alt='' className='' />
				<span>Есть подарок</span>
			</Maybe>
			<Maybe condition={type === "discount"}>
				<img src={discountImg} width={24} height={24} alt='' className='' />
				<span>Со скидкой</span>
			</Maybe>
			<Maybe condition={type === "cashback"}>
				<img src={discountImg} width={24} height={24} alt='' className='' />
				<span>Есть кешбэк</span>
			</Maybe>

			{children}
		</button>
	);
};

export default ButtonSelect;
