import isString from "./isString";

export const capitalizedWord = string => {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getFirstLetter = (string, upperCase = false) => {
	if (typeof string !== "string") return "";
	let letter = string.charAt(0);
	if (upperCase) {
		letter = letter.toUpperCase();
	}

	return letter;
};

export const getShortNameSurname = (name, surname) => {
	return `${capitalizedWord(name || "")} ${surname ? `${getFirstLetter(surname || "", true)}.` : ""}`;
};

export const capitalizeWords = (...words) => {
	return words
		.filter(item => item)
		.map(word => {
			if (!word) return;
			const wordWithoutSpaces = word.trim();
			return wordWithoutSpaces.charAt(0).toUpperCase() + wordWithoutSpaces.slice(1);
		})
		.join(" ");
};

export const removeWordFromText = (text, word) => {
	const parts = text.split(", ");
	if (parts.length > 1) {
		return parts.filter(item => item.toLowerCase() !== word.toLowerCase()).join(", ");
	}
};

export const stringToNumber = str => {
	return parseFloat(str.replace(/\s+/g, ""));
};

export const changePhoneFormat = phone => {
	if (!isString(phone)) return;
	return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5");
};

export const truncateString = (str, maxLength = 100) => {
	if (!isString(str)) return;

	const strTrim = str.trim().replace(/[.,]/g, "");

	if (strTrim.length > maxLength) {
		return `${strTrim.slice(0, maxLength)}...`;
	}

	return strTrim;
};
