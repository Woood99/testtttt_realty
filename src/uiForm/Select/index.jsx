import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import { convertSum, isEmptyArrObj } from "@/helpers";

import { Modal } from "@/ui";
import { IconArrowY } from "@/ui/Icons";

import { DropdownInputsLayoutBody, LayoutBody } from "./LayoutBody";
import styles from "./Select.module.scss";

function Select({
	options,
	value = {},
	onChange,
	nameLabel,
	search = false,
	placeholderName = "Не выбрано",
	className = "",
	isValid,
	children,
	defaultOption = false,
	searchLabel = "Поиск по названию",
	isInit = true,
	disabled = false,
	onClose = () => {},
	variant = "primary",
	iconArrow = true
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState("");

	const popupRef = useRef(null);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleDocumentClick = event => {
			if (window.innerWidth <= 1222) return;
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
				if (isOpen) {
					onClose();
				}
			}
		};

		document.addEventListener("click", handleDocumentClick, {
			capture: true
		});

		return () => {
			document.removeEventListener("click", handleDocumentClick, {
				capture: true
			});
		};
	}, [isOpen]);

	const onChangeHandler = option => {
		setIsOpen(false);
		onChange(option);
		onClose();
	};

	const handlerToggle = () => {
		if (isOpen === false) {
			setSearchText("");
		} else {
			onClose();
		}

		setIsOpen(!isOpen);
	};

	const variantClasses = {
		selectRoot:
			variant === "primary"
				? styles.SelectRoot
				: variant === "second"
					? styles.SelectRootSecond
					: variant === "third"
						? cn(styles.SelectRoot, styles.SelectRootThird)
						: "",
		selectButton:
			variant === "primary"
				? styles.SelectButton
				: variant === "second"
					? styles.SelectButtonSecond
					: variant === "third"
						? cn(styles.SelectButton, styles.SelectButtonThird)
						: ""
	};

	return (
		<div
			ref={dropdownRef}
			className={`${variantClasses.selectRoot} ${isOpen ? styles.SelectRootActive : ""} ${className}`}
			data-error={isValid ? isValid.ref.name : undefined}>
			<button
				type='button'
				onClick={handlerToggle}
				className={`${variantClasses.selectButton} ${isValid ? styles.SelectButtonError : ""} ${disabled ? styles.SelectButtonDisabled : ""}`}>
				<div className={`${nameLabel ? styles.SelectButtonWrapper : ""}`}>
					{Boolean(nameLabel) && (
						<span className={`${styles.SelectPlaceholder} ${!isEmptyArrObj(value) ? styles.SelectPlaceholderActive : ""}`}>
							{nameLabel}
						</span>
					)}

					<span className={`${styles.SelectPlaceholderSelected} ${isEmptyArrObj(value) ? styles.SelectPlaceholderNone : ""}`}>
						{isInit ? !isEmptyArrObj(value) ? value.label : placeholderName : <span className='text-primary400'>Загрузка...</span>}
					</span>
				</div>
				{iconArrow && <IconArrowY className={styles.SelectCheck} />}
			</button>
			{children}
			{!disabled && (
				<>
					{window.innerWidth > 1222 ? (
						<CSSTransition nodeRef={popupRef} in={isOpen} classNames='_open-select' timeout={200} unmountOnExit>
							<div ref={popupRef} className={styles.SelectDropdown}>
								<LayoutBody
									options={options}
									value={value}
									onChange={onChangeHandler}
									handlerToggle={handlerToggle}
									searchText={searchText}
									search={search}
									setSearchText={setSearchText}
									defaultOption={defaultOption}
									searchLabel={searchLabel}
									placeholderName={placeholderName}
								/>
							</div>
						</CSSTransition>
					) : (
						<Modal
							options={{ overlayClassNames: "_full _bottom", modalContentClassNames: styles.SelectModal }}
							set={setIsOpen}
							condition={isOpen}
							closeBtn={false}>
							<LayoutBody
								options={options}
								value={value}
								onChange={onChangeHandler}
								handlerToggle={handlerToggle}
								searchText={searchText}
								search={search}
								setSearchText={setSearchText}
								defaultOption={defaultOption}
								searchLabel={searchLabel}
								placeholderName={placeholderName}
							/>
						</Modal>
					)}
				</>
			)}
		</div>
	);
}

export default Select;

export const DropdownInputs = ({
	value = {},
	options = [],
	onChange,
	nameLabel,
	placeholderName = "Не выбрано",
	className = "",
	isValid,
	children
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const popupRef = useRef(null);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleDocumentClick = event => {
			if (window.innerWidth <= 1222) return;
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("click", handleDocumentClick, {
			capture: true
		});

		return () => {
			document.removeEventListener("click", handleDocumentClick, {
				capture: true
			});
		};
	}, [isOpen]);

	const onChangeHandler = (value, id, type) => {
		onChange({ value, id, type });
	};

	const handlerToggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div
			ref={dropdownRef}
			className={`${styles.SelectRoot} ${isOpen ? styles.SelectRootActive : ""} ${className}`}
			data-error={isValid ? isValid.ref.name : undefined}>
			<button type='button' onClick={handlerToggle} className={`${styles.SelectButton} ${isValid ? styles.SelectButtonError : ""}`}>
				<div className={`${nameLabel ? styles.SelectButtonWrapper : ""}`}>
					{nameLabel ? (
						<span className={`${styles.SelectPlaceholder} ${value.value ? styles.SelectPlaceholderActive : ""}`}>{nameLabel}</span>
					) : (
						""
					)}

					<span className={`${styles.SelectPlaceholderSelected} ${!value.value ? styles.SelectPlaceholderNone : ""}`}>
						{value.value ? `${options[0].before.toLowerCase()} ${convertSum(value.value)}` : placeholderName}
					</span>
				</div>
				<IconArrowY className={styles.SelectCheck} />
			</button>
			{children}
			<>
				{window.innerWidth > 1222 ? (
					<CSSTransition nodeRef={popupRef} in={isOpen} classNames='_open-select' timeout={200} unmountOnExit>
						<div ref={popupRef} className={styles.SelectDropdown}>
							<DropdownInputsLayoutBody options={options} handlerToggle={handlerToggle} onChange={onChangeHandler} value={value} />
						</div>
					</CSSTransition>
				) : (
					<Modal
						options={{ overlayClassNames: "_full _bottom", modalContentClassNames: styles.SelectModal }}
						set={setIsOpen}
						condition={isOpen}
						closeBtn={false}>
						<DropdownInputsLayoutBody options={options} handlerToggle={handlerToggle} onChange={onChangeHandler} value={value} />
					</Modal>
				)}
			</>
		</div>
	);
};
