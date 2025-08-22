import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { getToastPrimary } from "@/redux";

import { deleteToastPrimary } from "../../redux/slices/toastPrimarySlice";
import { NotificationTimer } from "../../ui/Tooltip";

const ToastPrimary = () => {
	const { toast } = useSelector(getToastPrimary);
	const isVisible = toast?.visible;
	const dispatch = useDispatch();

	if (!isVisible) return;

	return createPortal(
		<NotificationTimer
			show={isVisible}
			time={toast.data.time || 5000}
			onClose={() => dispatch(deleteToastPrimary(false))}
			classListRoot='pr-12 z-[999999999]'>
			{toast.data.title && <p className='font-medium text-defaultMax'>{toast.data.title}</p>}
			{toast.data.descr && <p className='mt-0.5 text-defaultMax'>{toast.data.descr}</p>}
			{toast.data.button && (
				<button type='button' className='mt-0.5 text-defaultMax text-white' onClick={toast.data.onClick}>
					{toast.data.button}
				</button>
			)}
		</NotificationTimer>,
		document.getElementById("overlay-wrapper")
	);
};

export default ToastPrimary;
