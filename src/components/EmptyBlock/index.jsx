import React from "react";

import boxSvg from "../../assets/svg/box.svg";

import styles from "./EmptyBlock.module.scss";

const EmptyBlock = ({ block = true }) => {
	return (
		<div className={`${block ? "white-block" : ""} ${styles.EmptyBlockRoot}`}>
			<img src={boxSvg} alt="" />
			<h3 className="title-3 mt-4">Поиск не дал результатов</h3>
			<p className="mt-3">Попробуйте изменить критерии поиска</p>
		</div>
	);
};

export const EmptyTextBlock = ({ block = true, children, className = "", imageVisible = true }) => {
	return (
		<div className={`${block ? "white-block" : ""} ${styles.EmptyBlockRoot} ${className}`}>
			{imageVisible && <img src={boxSvg} alt="" />}
			{children}
		</div>
	);
};

export default EmptyBlock;
