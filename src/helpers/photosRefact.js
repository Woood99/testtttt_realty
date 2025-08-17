import { v4 as uuidv4 } from "uuid";

export const refactPhotoStageOne = (data, nameField = "image", nameField2 = "image") => {
	return data.map(item => {
		let newItem;
		if (item.file) {
			newItem = {
				...item,
				[nameField2]: uuidv4(),
				[`new_${nameField}`]: true
			};
		} else {
			newItem = {
				...item,
				[`new_${nameField}`]: false
			};
		}
		return newItem;
	});
};

export const refactPhotoStageTwo = (data, nameField = "image", nameField2 = "image") => {
	return data.map(item => {
		return {
			id: item.id,
			[nameField]: item[nameField2],
			[`new_${nameField}`]: item[`new_${nameField}`]
		};
	});
};

export const refactPhotoStageAppend = (data, form, nameField = "image", nameField2 = "image") => {
	data.forEach(item => {
		if (item[`new_${nameField}`]) {
			form.append(item[nameField2], item.file);
		}
	});
};
