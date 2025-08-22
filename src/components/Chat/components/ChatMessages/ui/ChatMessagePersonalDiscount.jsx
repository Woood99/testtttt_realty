import { ChatContext } from "@/context";

import { getApartmentTitle } from "../../../../../helpers/getApartmentTitle";
import BlockPersonalDiscount from "../../../../BlockPersonalDiscount";

const ChatMessagePersonalDiscount = () => {
	const { currentDialog } = useContext(ChatContext);
	const { data, dataText } = useContext(ChatMessageContext);

	if (!Boolean(data.is_json && dataText && currentDialog.building && dataText.notificationable)) return;

	return (
		<BlockPersonalDiscount
			data={{
				id: dataText.id,
				property_type: dataText.notificationable_type === "App\\Models\\Building" ? "complex" : "apartment",
				type: dataText.is_absolute ? "price" : dataText.is_special_condition ? "special-condition" : "prc",
				object_id: dataText.discountable_id,
				valid_till: dataText.valid_till,
				discount: dataText.discount,
				author: dataText.author
			}}
			mainData={{
				...dataText.notificationable,
				title:
					dataText.notificationable_type === "App\\Models\\Building"
						? dataText.notificationable.title || dataText.notificationable.name
						: getApartmentTitle(dataText.notificationable)
			}}
		/>
	);
};

export default ChatMessagePersonalDiscount;
