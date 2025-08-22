export const isIOS = () => {
	const ua = navigator.userAgent;
	const iOSDevice = /iPhone|iPod/.test(ua);
	const iPadOS = ua.includes("Macintosh") && "ontouchend" in document;
	return iOSDevice || iPadOS;
};
