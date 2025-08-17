import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { useSelector } from "react-redux";

import { getIsDesktop } from "@/redux";

import { IconClose } from "../Icons";
import Modal from "../Modal";
import ModalWrapper from "../Modal/ModalWrapper";

import stylesTooltip from "./Tooltip.module.scss";

export const Tooltip = ({
	ElementTarget = () => <></>,
	children,
	color = "dark",
	offset = [0, 5],
	placement = "bottom",
	close = false,
	classNameTarget = "",
	classNameRoot = "",
	classNameTargetActive = "",
	classNameContent = "",
	event = "move",
	value = null,
	onChange = null,
	mobile = false,
	mobileDefault = false,
	onClose,
	virtualPosition = null
}) => {
	const isDesktop = useSelector(getIsDesktop);
	const [showPopper, setShowPopper] = useState(false);

	if (!mobile && !isDesktop && showPopper) {
		setShowPopper(false);
		return;
	}

	return (
		<TooltipBody
			ElementTarget={ElementTarget}
			children={children}
			color={color}
			offset={offset}
			placement={placement}
			close={close}
			classNameTarget={classNameTarget}
			classNameRoot={classNameRoot}
			classNameTargetActive={classNameTargetActive}
			classNameContent={classNameContent}
			event={isDesktop ? event : "click"}
			showPopper={value !== null ? value : showPopper}
			setShowPopper={onChange !== null ? onChange : setShowPopper}
			mobile={mobile}
			mobileDefault={mobileDefault}
			onClose={onClose}
			virtualPosition={virtualPosition}
		/>
	);
};

const TooltipBody = ({
	ElementTarget,
	children,
	color = "dark",
	offset = [0, 5],
	placement = "bottom",
	close = false,
	classNameTarget = "",
	classNameRoot = "",
	classNameTargetActive = "",
	classNameContent = "",
	event = "move",
	showPopper = false,
	setShowPopper = () => {},
	mobile = false,
	mobileDefault = false,
	onClose,
	virtualPosition
}) => {
	const isDesktop = useSelector(getIsDesktop);
	const [referenceEl, setReferenceEl] = useState(null);
	const [popperEl, setPopperEl] = useState(null);

	const virtualRef = useMemo(() => {
		if (!virtualPosition) return null;
		return {
			getBoundingClientRect: () => ({
				width: 0,
				height: 0,
				top: virtualPosition.y,
				bottom: virtualPosition.y,
				left: virtualPosition.x,
				right: virtualPosition.x,
				x: virtualPosition.x,
				y: virtualPosition.y,
				toJSON: () => {}
			})
		};
	}, [virtualPosition]);

	const { styles, attributes } = usePopper(
		virtualPosition && virtualRef ? virtualRef : referenceEl,
		popperEl,
		{
			placement: placement,
			modifiers: [
				{
					name: "offset",
					options: {
						offset: [0, 0]
					}
				}
			]
		}
	);

	const handleOpen = () => {
		setShowPopper(true);
	};

	const handleClose = () => {
		setShowPopper(false);
		onClose?.();
	};

	useEffect(() => {
		const close = e => {
			if (!showPopper) return;
			if (popperEl && !popperEl.contains(e.target) && referenceEl && !referenceEl.contains(e.target)) {
				handleClose();
			}
		};
		document.addEventListener("click", close, {
			capture: true
		});

		return () => {
			document.removeEventListener("click", close, {
				capture: true
			});
		};
	}, [showPopper, popperEl]);

	return (
		<>
			<div
				ref={setReferenceEl}
				onMouseEnter={event === "move" ? handleOpen : null}
				onMouseLeave={event === "move" ? handleClose : null}
				onClick={event === "click" ? () => setShowPopper(prev => !prev) : null}
				className={`${classNameTarget} ${showPopper ? classNameTargetActive : ""}`}>
				{Boolean(ElementTarget) && <ElementTarget />}
			</div>
			<>
				{Boolean(!isDesktop && mobile) && (
					<ModalWrapper condition={showPopper}>
						<Modal
							condition={showPopper}
							set={setShowPopper}
							options={{ overlayClassNames: "_full _bottom !z-[99999]", modalContentClassNames: "!px-5" }}>
							<div className={`${classNameContent}`}>{children}</div>
						</Modal>
					</ModalWrapper>
				)}
				{showPopper &&
					(isDesktop || mobileDefault) &&
					createPortal(
						<div
							className={`z-[99999] ${classNameRoot}`}
							ref={setPopperEl}
							style={{
								...styles.popper,
								padding: `${offset[1]}px ${offset[0]}px`
							}}
							{...attributes.popper}
							onMouseEnter={event === "move" ? handleOpen : null}
							onMouseLeave={event === "move" ? handleClose : null}>
							<div
								className={`${stylesTooltip.TooltipRoot} ${
									color === "dark" ? stylesTooltip.TooltipRootDark : color === "white" ? stylesTooltip.TooltipRootWhite : ""
								} ${classNameContent}`}>
								{Boolean(close) && (
									<button className='absolute top-4 right-4' onClick={handleClose}>
										<IconClose width={20} height={20} className='fill-blue' />
									</button>
								)}
								{children}
							</div>
						</div>,
						document.getElementById("overlay-wrapper")
					)}
			</>
		</>
	);
};

export const NotificationTimer = ({
	show,
	set,
	onClose,
	classListRoot = "",
	style = {},
	children,
	time = 5000,
	visibleProgressBar = true,
	position = "top-right",
	color = "dark"
}) => {
	const currentColor = color === "dark" ? stylesTooltip.NotificationTimerDark : color === "white" ? stylesTooltip.NotificationTimerWhite : "";
	const currentPosition = position === "top-right" ? "top-6 right-6" : position === "bottom-right" ? "bottom-6 right-6" : "";

	useEffect(() => {
		if (show) {
			const timer = setTimeout(() => {
				if (set) {
					set(false);
				} else if (onClose) {
					onClose();
				}
			}, time);
			return () => clearTimeout(timer);
		}
	}, [show]);

	return (
		<div className={`${stylesTooltip.NotificationTimer} ${currentPosition} ${currentColor} ${classListRoot}`} style={style}>
			{children}
			{Boolean(visibleProgressBar) && (
				<div className={stylesTooltip.NotificationTimerProgressBar}>
					<span style={{ animationDuration: `${time / 1000}s` }} />
				</div>
			)}

			<button onClick={onClose} className='absolute top-4 right-4'>
				<IconClose className='fill-white' />
			</button>
		</div>
	);
};
