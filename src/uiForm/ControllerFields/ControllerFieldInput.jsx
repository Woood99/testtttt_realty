import React from "react";
import { Controller } from "react-hook-form";

import { clearMask } from "@/helpers";

import FieldError from "../FieldError";
import Input from "../Input";
import RangeSlider from "../Input/RangeSlider";

export const ControllerFieldInput = ({
	control,
	errors,
	requiredValue = "",
	name = "",
	beforeText = "",
	afterText,
	size,
	type,
	defaultValue = "",
	className = "",
	onlyNumber,
	convertNumber,
	onlyNumberSemicolon,
	maxLength,
	datePicker,
	variant,
	mask,
	disabled,
	placeholder = "",
	readOnly,
	refInput = null,
	minDate = false,
	maxDate = false,
	selectionButtons = null,
	requiredFn = () => true
}) => {
	return (
		<Controller
			control={control}
			name={name}
			defaultValue={defaultValue}
			rules={{
				required: requiredValue,
				validate: value => {
					if (selectionButtons && (selectionButtons.options?.length || selectionButtons.required)) {
						return selectionButtons.options.includes(value);
					}
					return requiredFn?.(value);
				}
			}}
			render={({ field }) => {
				return (
					<Input
						maxLength={maxLength}
						type={type}
						before={beforeText}
						after={afterText}
						size={size}
						variant={variant}
						value={field.value}
						onlyNumber={onlyNumber}
						convertNumber={convertNumber}
						datePicker={datePicker}
						onlyNumberSemicolon={onlyNumberSemicolon}
						onChange={value => field.onChange(value)}
						className={className}
						mask={mask}
						minDate={minDate}
						maxDate={maxDate}
						placeholder={placeholder}
						isValid={errors ? errors[name] : false}
						disabled={disabled}
						readOnly={readOnly}
						refInput={refInput}
						selectionButtons={selectionButtons}
					>
						<FieldError errors={errors} field={name} />
					</Input>
				);
			}}
		/>
	);
};

export const ControllerFieldInputRangeSlider = ({ control, name = "", beforeText = "", start = 0, range = { min: 0, max: 100 }, step = 1 }) => {
	return (
		<Controller
			control={control}
			name={name}
			defaultValue={start}
			render={({ field }) => {
				return (
					<RangeSlider beforeText={beforeText} value={field.value} onChange={value => field.onChange(value)} step={step} range={range} />
				);
			}}
		/>
	);
};

export const ControllerFieldInputPhone = ({ control, errors = null, name = "phone", size, defaultValue = "", disabled, refInput = null }) => {
	return (
		<Controller
			control={control}
			name={name}
			defaultValue={defaultValue}
			rules={
				errors
					? {
							required: "Введите корректный номер телефона",
							minLength: {
								value: 12,
								message: "Введите корректный номер телефона"
							}
						}
					: null
			}
			render={({ field }) => {
				return (
					<Input
						before="Телефон"
						mask="phone"
						size={size}
						disabled={disabled}
						value={field.value}
						onChange={value => field.onChange(clearMask(value))}
						refInput={refInput}
						isValid={errors ? errors[name] : false}
					>
						<FieldError errors={errors} field={name} />
					</Input>
				);
			}}
		/>
	);
};
