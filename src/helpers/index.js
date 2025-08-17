export { isSeller, isBuyer, isAdmin } from "./utils";
export { isObject, isArray, isNumber } from "./isEmptyArrObj";
export { appendParams } from "./appendParams";
export {
	getLastElementArray,
	getFirstElementArray,
	combinedArray,
	combinedArrayLength,
	getSumOfArray,
	removeDuplicatesArray,
	mapOrNull
} from "./arrayMethods";
export { getMaxCashback } from "./cashbackUtils";
export { isToday, isYesterday, getLastSeenOnline, getLastOnline } from "./changeDate";
export {
	capitalizedWord,
	getFirstLetter,
	getShortNameSurname,
	capitalizeWords,
	removeWordFromText,
	stringToNumber,
	changePhoneFormat
} from "./changeString";
export { checkUserIdByRole } from "./checkUserIdByRole";
export { cleanObject } from "./cleanObject";
export { addZero } from "./toggleZero";
export { refactPhotoStageOne, refactPhotoStageTwo, refactPhotoStageAppend } from "./photosRefact";
export { timeToSeconds } from "./timeTo";
export { isValidTime } from "./isValidTime";

export { default as isEmptyArrObj } from "./isEmptyArrObj";
export { default as clearData } from "./clearData";
export { default as convertToDate } from "./convertToDate";
export { default as getSrcImage } from "./getSrcImage";
export { default as numberReplace } from "./numberReplace";
export { default as convertSum } from "./convertSum";
export { default as isString } from "./isString";
export { default as convertFieldsJSON } from "./convertFieldsJSON";
export { default as clearMask } from "./clearMask";
export { default as countdownTimer } from "./countdownTimer";
export { default as formatPhoneNumber } from "./formatPhoneNumber";
export { default as handleCopyText } from "./handleCopyText";

export * from "./declensionWords";
