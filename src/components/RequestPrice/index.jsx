import cn from "classnames";

const RequestPrice = ({ className }) => {
	return (
		<button type='button' className={cn("relative z-40 font-medium", className)}>
			Цена в чат или по телефону
		</button>
	);
};

export default RequestPrice;
