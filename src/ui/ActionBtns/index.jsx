import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getMainInfo, setLikes } from "@/redux";

import SelectAccLogModal from "../../ModalsMain/SelectAccLogModal";
import { getDataRequest, sendPostRequest } from "../../api/requestsApi";
import { RoutesPath } from "../../constants/RoutesPath";
import {
	IconComparison,
	IconComparisonActive,
	IconComplain,
	IconEdit,
	IconEye,
	IconFavoriteStroke,
	IconSave,
	IconShareArrow,
	IconTrash
} from "../Icons";
import { SpinnerForBtn } from "../Spinner";
import { NotificationTimer, Tooltip } from "../Tooltip";

import styles from "./ActionBtns.module.scss";

export const BtnAction = props => {
	const { className = "", Selector = "button" } = props;
	if (Selector !== "button") {
		return <div className={`${styles.BtnAction} ${className}`}>{props.children}</div>;
	}
	return (
		<button type='button' {...props} className={`${styles.BtnAction} ${className}`}>
			{props.children}
		</button>
	);
};

export const BtnActionText = props => {
	const { className = "" } = props;
	return (
		<button type='button' {...props} className={`${styles.BtnActionText} ${className}`}>
			{props.children}
		</button>
	);
};

export const BtnActionBg = props => {
	const { className = "", variant = "bg" } = props;
	return (
		<button
			type='button'
			{...props}
			className={`${variant === "bg" ? styles.BtnActionBg : variant === "circle" ? styles.BtnActionCircle : ""} ${className}`}>
			{props.children}
		</button>
	);
};

export const BtnActionLook = props => {
	const { className = "", Selector = "button" } = props;
	if (Selector !== "button") {
		return (
			<div title='Смотреть' className={className}>
				<IconEye className='fill-blue' width={18} height={18} />
			</div>
		);
	}
	return (
		<button type='button' {...props} title='Смотреть' className={className}>
			<IconEye className='fill-blue' width={18} height={18} />
		</button>
	);
};

export const BtnActionEdit = props => {
	const { className = "", Selector = "button", title = "Редактировать" } = props;
	if (Selector !== "button") {
		return (
			<div title={title} className={className}>
				<IconEdit className='stroke-blue' width={18} height={18} />
			</div>
		);
	}
	return (
		<button type='button' {...props} title={title} className={className}>
			<IconEdit className='stroke-blue' width={18} height={18} />
		</button>
	);
};

export const BtnActionDelete = props => {
	const { className = "", variant = "" } = props;
	return (
		<button
			type='button'
			{...props}
			title='Удалить'
			className={`${
				variant === "absolute"
					? "absolute top-4 right-4 w-8 h-8 z-99 bg-white rounded-lg flex items-center justify-center transition-all shadow-primary opacity-0 invisible"
					: ""
			} ${className}`}>
			<IconTrash className='stroke-red' width={16} height={16} />
		</button>
	);
};

export const BtnActionSave = props => {
	const { className = "" } = props;
	return (
		<button type='button' {...props} title='Сохранить' className={className}>
			<IconSave className='fill-blue' width={16} height={16} />
		</button>
	);
};

export const BtnActionComplain = props => {
	const { className = "", children } = props;
	return (
		<button type='button' title='Заблокировать' {...props} className={className}>
			<IconComplain className='fill-red' width={18} height={18} />
			{children}
		</button>
	);
};

export const BtnActionComparison = props => {
	const { id, type, variant, placement = "bottom", className = "" } = props;

	const [showNotification, setShowNotification] = useState(false);

	const requestMetric = () => {
		sendPostRequest("/api/metric", {
			type: "added_to_compare",
			metricable_type: type === "complex" ? "App\\Models\\Building" : "App\\Models\\Apartment",
			metricable_id: id
		}).then(res => {
			console.log(res);
		});
	};

	const toggleComparison = () => {
		const comparisonData = localStorage.getItem(`comparison_${type}`);

		if (comparisonData) {
			const parseData = JSON.parse(comparisonData);
			if (parseData.includes(id)) {
				setShowNotification("delete");
				const newData = parseData.filter(item => item !== id);
				localStorage.setItem(`comparison_${type}`, JSON.stringify(newData));
			} else {
				setShowNotification("add");
				requestMetric();
				localStorage.setItem(`comparison_${type}`, JSON.stringify([...parseData, id]));
			}
		} else {
			setShowNotification("add");
			requestMetric();
			localStorage.setItem(`comparison_${type}`, JSON.stringify([id]));
		}
	};

	return (
		<>
			{variant === "tooltip" && (
				<>
					<Tooltip
						placement={placement}
						offset={[10, 5]}
						ElementTarget={() => (
							<BtnAction className='relative z-50' onClick={toggleComparison}>
								{JSON.parse(localStorage.getItem(`comparison_${type}`))?.includes(id) ? (
									<IconComparisonActive width={16} height={16} className='pointer-events-none fill-blue' />
								) : (
									<IconComparison width={16} height={16} className='pointer-events-none' />
								)}
							</BtnAction>
						)}>
						{JSON.parse(localStorage.getItem(`comparison_${type}`))?.includes(id) ? "Удалить из сравнения" : "Добавить в сравнение"}
					</Tooltip>
				</>
			)}
			{(variant === "bg" || variant === "circle") && (
				<>
					<BtnActionBg
						variant={variant}
						onClick={toggleComparison}
						className={className}
						title={
							JSON.parse(localStorage.getItem(`comparison_${type}`))?.includes(id) ? "Удалить из сравнения" : "Добавить в сравнение"
						}>
						{JSON.parse(localStorage.getItem(`comparison_${type}`))?.includes(id) ? (
							<IconComparisonActive width={16} height={16} className='pointer-events-none fill-blue' />
						) : (
							<IconComparison width={16} height={16} className='pointer-events-none' />
						)}
					</BtnActionBg>
				</>
			)}

			{showNotification === "add" &&
				createPortal(
					<NotificationTimer
						show={showNotification}
						set={setShowNotification}
						onClose={() => setShowNotification(false)}
						classListRoot='min-w-[300px]'>
						<span className='font-medium text-defaultMax'>Добавлено в сравнение</span>
						<Link className='block underline mt-2' to={RoutesPath.comparison}>
							Перейти
						</Link>
					</NotificationTimer>,
					document.getElementById("overlay-wrapper")
				)}
			{showNotification === "delete" &&
				createPortal(
					<NotificationTimer
						show={showNotification}
						set={setShowNotification}
						onClose={() => setShowNotification(false)}
						classListRoot='min-w-[300px]'>
						<span className='font-medium text-defaultMax'>Удалено с сравнения</span>
					</NotificationTimer>,
					document.getElementById("overlay-wrapper")
				)}
		</>
	);
};

export const BtnActionFavorite = props => {
	const { id, type, variant, placement = "bottom", className = "" } = props;
	const [cookies] = useCookies();
	const dispatch = useDispatch();
	const { likes: likesItems } = useSelector(getMainInfo);

	const [popupPersonalOpen, setPopupPersonalOpen] = useState(false);

	const name = type === "complex" ? "building" : type === "apartment" ? "apartment" : "";

	const [isLoading, setIsLoading] = useState(false);

	const [currentStatus, setCurrentStatus] = useState(false);

	const [showNotification, setShowNotification] = useState(false);

	useEffect(() => {
		if (!cookies.loggedIn) return;
		const currentLike = likesItems.find(item => item.id === +id && item.type === name);

		if (currentLike) {
			setCurrentStatus(true);
		}
	}, [JSON.stringify(likesItems)]);

	const toggleFavorite = () => {
		if (!cookies.loggedIn) {
			setPopupPersonalOpen(true);
			return;
		}
		setIsLoading(true);
		sendPostRequest("/api/like", {
			likeable_id: id,
			likeable_type: name
		}).then(res => {
			setIsLoading(false);
			setCurrentStatus(res.data.newLike);

			if (res.data.newLike) {
				setShowNotification("add");
			} else {
				setShowNotification("delete");
			}

			getDataRequest("/api/likes").then(res => {
				dispatch(setLikes(res.data));
			});
		});
	};

	return (
		<>
			<SelectAccLogModal condition={popupPersonalOpen} set={setPopupPersonalOpen} />

			{variant === "tooltip" && (
				<>
					{isLoading ? (
						<BtnAction className='relative z-50'>
							<SpinnerForBtn size={16} />
						</BtnAction>
					) : (
						<>
							{!currentStatus ? (
								<Tooltip
									placement={placement}
									offset={[10, 5]}
									ElementTarget={() => (
										<BtnAction className={`relative z-50 ${className}`} onClick={toggleFavorite}>
											<IconFavoriteStroke width={14} height={14} className='pointer-events-none' />
										</BtnAction>
									)}>
									Добавить в избранное
								</Tooltip>
							) : (
								<Tooltip
									placement={placement}
									offset={[10, 5]}
									ElementTarget={() => (
										<BtnAction className='relative z-50' onClick={toggleFavorite}>
											<IconFavoriteStroke width={14} height={14} className='pointer-events-none stroke-red' />
										</BtnAction>
									)}>
									Удалить с избранное
								</Tooltip>
							)}
						</>
					)}
				</>
			)}
			{(variant === "bg" || variant === "circle") && (
				<>
					{!currentStatus ? (
						<BtnActionBg variant={variant} onClick={toggleFavorite} className={className} title='Добавить в избранное'>
							<IconFavoriteStroke width={16} height={16} className='pointer-events-none' />
						</BtnActionBg>
					) : (
						<BtnActionBg variant={variant} onClick={toggleFavorite} className={className} title='Удалить с избранное'>
							<IconFavoriteStroke width={16} height={16} className='pointer-events-none !stroke-red' />
						</BtnActionBg>
					)}
				</>
			)}

			{showNotification === "add" &&
				createPortal(
					<NotificationTimer
						show={showNotification}
						set={setShowNotification}
						onClose={() => setShowNotification(false)}
						classListRoot='min-w-[300px]'>
						<span className='font-medium text-defaultMax'>Добавлено в избранное</span>
						<Link className='block underline mt-2' to={RoutesPath.favorites}>
							Перейти
						</Link>
					</NotificationTimer>,
					document.getElementById("overlay-wrapper")
				)}
			{showNotification === "delete" &&
				createPortal(
					<NotificationTimer
						show={showNotification}
						set={setShowNotification}
						onClose={() => setShowNotification(false)}
						classListRoot='min-w-[300px]'>
						<span className='font-medium text-defaultMax'>Удалено с избранного</span>
					</NotificationTimer>,
					document.getElementById("overlay-wrapper")
				)}
		</>
	);
};

export const BtnActionShare = props => {
	const { set, variant = "bg" } = props;

	return (
		<BtnActionBg variant={variant} onClick={() => set(true)} title='Поделиться'>
			<IconShareArrow width={16} height={16} className='!fill-[transparent] !stroke-[currentColor] !stroke-[1.5px]' />
		</BtnActionBg>
	);
};
