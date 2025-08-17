import plural from "plural-ru";
import React, { useEffect, useState } from "react";

import { addZero, countdownTimer } from "@/helpers";

import styles from "./CountdownTimer.module.scss";

export const CountdownTimer = ({ date }) => {
	const timer = countdownTimer(new Date(date));

	return (
		<div className={styles.CountdownTimerRoot}>
			<span className="text-primary400 text-small">
				До конца <br /> скидки
			</span>
			<div className="flex items-center gap-3">
				<div className={styles.CountdownTimerItem}>
					<span className={styles.CountdownTimerValue}>{addZero(timer.days)}</span>
					<span className={styles.CountdownTimerName}>{plural(timer.days, "день", "дня", "дней")}</span>
				</div>
				<div className="text-primary400 text-littleBig">:</div>
				<div className={styles.CountdownTimerItem}>
					<span className={styles.CountdownTimerValue}>{addZero(timer.hours)}</span>
					<span className={styles.CountdownTimerName}>{plural(timer.hours, "час", "часа", "часов")}</span>
				</div>
				<div className="text-primary400 text-littleBig">:</div>
				<div className={styles.CountdownTimerItem}>
					<span className={styles.CountdownTimerValue}>{addZero(timer.minutes)}</span>
					<span className={styles.CountdownTimerName}>мин.</span>
				</div>
				<div className="text-primary400 text-littleBig">:</div>
				<div className={styles.CountdownTimerItem}>
					<span className={styles.CountdownTimerValue}>{addZero(timer.seconds)}</span>
					<span className={styles.CountdownTimerName}>сек.</span>
				</div>
			</div>
		</div>
	);
};

export const CountdownTimerDefault = ({ initialTime = 1, onComplete = () => {}, children }) => {
	const [timeLeft, setTimeLeft] = useState(initialTime);

	useEffect(() => {
		if (timeLeft === 0) {
			onComplete();
			return;
		}

		const timerId = setInterval(() => {
			setTimeLeft(prevTime => prevTime - 1);
		}, 1000);

		return () => clearInterval(timerId);
	}, [timeLeft, onComplete]);

	return (
		<>
			{timeLeft}
			{children}
		</>
	);
};
