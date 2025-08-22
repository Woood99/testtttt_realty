import { useContext } from "react";

import { ChatMessageContext } from "@/context";

import { GetDescrHTML } from "@/components";

import styles from "../../../Chat.module.scss";
import hasText from "../../ChatDraft/hasText";

const ChatMessageText = () => {
	const { data, dataText } = useContext(ChatMessageContext);

	if (data.is_json || !(dataText && hasText(dataText))) return;

	return (
		<GetDescrHTML
			className={styles.ChatMessageText}
			data={dataText}
			onClick={e => {
				const spoiler = e.target.closest(".draft-spoiler");
				if (spoiler) {
					spoiler.classList.add("draft-spoiler--active");
				}
			}}
		/>
	);
};

export default ChatMessageText;
