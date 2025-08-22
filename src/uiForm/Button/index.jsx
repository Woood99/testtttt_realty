import cn from "classnames";

import styles from "./Button.module.scss";

const Button = props => {
	const {
		children,
		className = "",
		variant = "primary",
		size = "",
		onClick = () => {},
		Selector = "button",
		href,
		active,
		type,
		disabled,
		linkBlank = false,
		isLoading = false,
		style = {},
		textLoading
	} = props;
	const classNames = `${styles.ButtonMain} ${size ? styles[`size${size}`] : ""} ${styles[variant]} ${className} ${
		active ? styles.ButtonActive : ""
	}`;
	if (Selector === "a") {
		return (
			<a href={href} className={classNames} target={linkBlank ? "_blank" : ""}>
				{children}
			</a>
		);
	}
	return (
		<Selector type={type} disabled={disabled || isLoading} onClick={onClick} className={classNames} style={style}>
			{isLoading ? <div className={cn(styles.ButtonLoading, variant === "fourth" && styles.ButtonLoadingBlue)} /> : <>{children}</>}
			{isLoading && textLoading}
		</Selector>
	);
};

export default Button;
