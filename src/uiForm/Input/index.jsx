import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MaskedInput from "react-text-mask";

import { getIsDesktop } from "@/redux";

import clearMask from "../../helpers/clearMask";
import isString from "../../helpers/isString";
import numberReplace from "../../helpers/numberReplace";
import { IconEye, IconSearch } from "../../ui/Icons";
import { Tooltip } from "../../ui/Tooltip";

import styles from "./Input.module.scss";

export const phoneMask = ["+", "7", " ", "(", /[0-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/];
export const numbers4Mask = [/[0-9]/, /[0-9]/, "-", /[0-9]/, /[0-9]/];
export const hhmmssMask = [/[0-9]/, /[0-9]/, ":", /[0-6]/, /[0-9]/, ":", /[0-6]/, /[0-9]/];
export const hhmmMask = [/[0-2]/, /[0-9]/, ":", /[0-6]/, /[0-9]/];
export const bankCardMask = [/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/];
export const expiryMask = [/[0-1]/, /[0-9]/, "/", /[2-9]/, /[0-9]/];
export const cvvMask = [/\d/, /\d/, /\d/];

const Input = props => {
	const {
		className = "",
		before,
		after,
		placeholder,
		type = "text",
		name,
		size = "default",
		onChange = () => {},
		value = "",
		maxLength = null,
		convertNumber = false,
		onlyNumber = false,
		onlyNumberSemicolon = false,
		replaceComma = false,
		mask = null,
		isValid,
		children,
		datePicker,
		disabled,
		readOnly = false,
		maxValue,
		search = false,
		variant,
		refInput,
		minDate = false,
		maxDate = false,
		selectionButtons = null
	} = props;

	const [newValue, setNewValue] = useState(value);
	const rootRef = useRef(null);
	const inputRef = useRef(null);
	const [typePassword, setTypePassword] = useState("password");
	const isDesktop = useSelector(getIsDesktop);

	const [selectionButtonsOpen, setSelectionButtonsOpen] = useState(false);

	useEffect(() => {
		setNewValue(value);
	}, [value]);

	useEffect(() => {
		let result = value;
		if (inputRef.current && refInput && !refInput.current) {
			refInput.current = inputRef.current;
		}

		if (onlyNumber) {
			result = result.toString().replace(/\D/g, "");
		}

		if (onlyNumberSemicolon) {
			result = result.toString().replace(/[^\d.,]/g, "");

			if (replaceComma) {
				result = result.replace(/,/g, ".");
			}
		}

		if (convertNumber && !onlyNumberSemicolon) {
			result = numberReplace(result);
		}

		setNewValue(result);
		onChange(result);
	}, []);

	const labelClassNames = `${styles.InputRoot} ${className} ${variant ? styles[`Input${variant}`] : ""} 
   ${newValue.length > 0 ? styles.InputRootActive : ""}`;

	const onChangeHandler = e => {
		let result = "";
		if (isString(e)) {
			result = e;
		} else if (e) {
			result = e.target.value;
		}

		if (+result > +maxValue) {
			result = maxValue;
		}

		if (onlyNumber) {
			result = result.toString().replace(/\D/g, "");
		}

		if (onlyNumberSemicolon) {
			result = result.toString().replace(/[^\d.,]/g, "");

			if (replaceComma) {
				result = result.replace(/,/g, ".");
			}
		}

		if (convertNumber && !onlyNumberSemicolon) {
			result = numberReplace(result);
		}

		if (mask) {
			result = clearMask(result);
		}
		setNewValue(result);
		onChange(result);
	};

	const inputMaskOptions = {
		value: newValue,
		onChange: onChangeHandler,
		placeholder,
		disabled
	};

	const handleFocus = ref => {
		ref.current.removeAttribute("readonly");
	};

	const togglePasswordVisibility = () => {
		if (typePassword === "password") {
			setTypePassword("text");
		} else {
			setTypePassword("password");
		}
	};

	return (
		<div
			ref={rootRef}
			data-error={isValid ? isValid.ref.name : undefined}
			onClick={() => {
				if (selectionButtons && (selectionButtons.options?.length || selectionButtons.emptyText)) {
					setSelectionButtonsOpen(prev => !prev);
				}
			}}
		>
			<label
				className={`${labelClassNames} ${size !== "default" ? styles["InputSize" + size] : ""} ${isValid ? styles.InputError : ""} ${disabled ? styles.InputDisabled : ""}`}
			>
				{before && <span className={styles.InputBefore}>{before}</span>}
				{!mask && !datePicker && (
					<>
						{search ? <IconSearch /> : ""}
						<input
							type={type === "password" ? typePassword : type}
							name={name}
							maxLength={maxLength}
							className={styles.InputWrapper}
							value={newValue}
							onChange={onChangeHandler}
							placeholder={placeholder}
							disabled={disabled}
							autoCapitalize="off"
							autoCorrect="off"
							autoComplete={type === "password" ? "current-password" : "off"}
							readOnly={readOnly}
							ref={inputRef}
							onFocus={() => handleFocus(inputRef)}
						/>
					</>
				)}
				{datePicker && <DatePickerInput value={newValue} onChange={onChangeHandler} minDate={minDate} maxDate={maxDate} />}
				{mask === "phone" && (
					<InputMask
						{...inputMaskOptions}
						mask={phoneMask}
						options={{ autoComplete: "tel" }}
						inputRef={inputRef}
						type="tel"
						inputMode="tel"
					/>
				)}
				{mask === "numbers4" && <InputMask {...inputMaskOptions} mask={numbers4Mask} inputRef={inputRef} type="tel" inputMode="numeric" />}
				{mask === "hhmmssMask" && <InputMask {...inputMaskOptions} mask={hhmmssMask} inputRef={inputRef} type="tel" inputMode="numeric" />}
				{mask === "hhmmMask" && <InputMask {...inputMaskOptions} mask={hhmmMask} inputRef={inputRef} type="tel" inputMode="numeric" />}
				{mask === "bankCardMask" && (
					<InputMask {...inputMaskOptions} mask={bankCardMask} inputRef={inputRef} type="tel" inputMode="numeric" />
				)}
				{mask === "expiryMask" && <InputMask {...inputMaskOptions} mask={expiryMask} inputRef={inputRef} />}
				{mask === "cvvMask" && <InputMask {...inputMaskOptions} mask={cvvMask} inputRef={inputRef} type="tel" inputMode="numeric" />}

				{after && <span className={styles.InputAfter}>{after}</span>}
				{type === "password" && (
					<button
						type="button"
						aria-label="Показать пароль"
						title="Показать пароль"
						className="w-4 h-4 shrink-0 flex items-center justify-center"
						onClick={togglePasswordVisibility}
					>
						<IconEye className="fill-[#717171]" width={16} height={16} />
					</button>
				)}
			</label>
			{Boolean((selectionButtons?.options?.length && selectionButtonsOpen) || selectionButtons?.emptyText) && (
				<Tooltip mobile color="white" event="click" placement="bottom-start" value={selectionButtonsOpen} onChange={setSelectionButtonsOpen}>
					<div style={{ width: rootRef?.current?.clientWidth - 40 || 0 }}>
						<div className={`${selectionButtons.className}`}>
							{selectionButtons.options.map((item, index) => {
								return (
									<button
										key={index}
										onClick={() => {
											onChangeHandler(item);
											if (!isDesktop) {
												setSelectionButtonsOpen(false);
											}
										}}
										className={`px-2 h-8 rounded-lg ${newValue === item ? "bg-blue text-white" : ""}`}
									>
										{item}
									</button>
								);
							})}
						</div>
						{!selectionButtons.options.length && selectionButtons.emptyText && (
							<div className="text-center">{selectionButtons.emptyText}</div>
						)}
					</div>
				</Tooltip>
			)}
			{children}
		</div>
	);
};

export default Input;

const InputMask = ({ value, onChange, placeholder, mask, options, disabled, inputRef, type, inputMode }) => {
	return (
		<MaskedInput
			inputMode={inputMode}
			type={type}
			mask={mask}
			className={styles.InputWrapper}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			guide={true}
			showMask={true}
			disabled={disabled}
			ref={inputRef}
			{...options}
		/>
	);
};

const DatePickerInput = ({ value, onChange, minDate = false, maxDate = false }) => {
	const datepickerRef = useRef(null);

	useEffect(() => {
		if (datepickerRef.current) {
			const [day, month, year] = value.split(".");
			const formattedDateString = `${year}-${month}-${day}`;
			const startValue = new Date(formattedDateString);

			new AirDatepicker(datepickerRef.current, {
				autoClose: true,
				isMobile: true,
				selectedDates: dayjs(startValue).isValid() ? startValue : "",
				onSelect: ({ date }) => {
					console.log(date);

					if (date) {
						onChange(dayjs(date).format("DD.MM.YYYY"));
					} else {
						onChange(null);
					}
				},
				minDate,
				maxDate
			});
		}
	}, []);

	return <input ref={datepickerRef} value={value} readOnly className="bg-transparent" />;
};
