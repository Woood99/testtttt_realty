import React from "react";
import { useDropzone } from "react-dropzone";

import Button from "../../uiForm/Button";

import styles from "./FileDropZone.module.scss";

export const FileDropZone = ({
	addFiles,
	multiple = true,
	className = "",
	acceptType = { "image/*": [] },
	textBtn = "Выберите фото",
	text = "или перетащите в эту область",
	buttonSize = ""
}) => {
	const onDrop = acceptedFiles => {
		addFiles(acceptedFiles);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: multiple,
		accept: acceptType
	});

	return (
		<div {...getRootProps()} className={`${styles.FileDropZoneRoot} ${isDragActive ? styles.FileDropZoneRootActive : ""} ${className}`}>
			<input {...getInputProps()} />
			<Button Selector='div' size={buttonSize}>
				{textBtn}
			</Button>
			<div className='text-primary400 ml-4'>{text}</div>
			{isDragActive && <div className={styles.FileDropZoneOverlay}>Отпустите изображения</div>}
		</div>
	);
};
