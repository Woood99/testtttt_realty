import isString from "./isString";

const normalizeUrl = value => {
	if (!isString(value)) return;
	let u = value.trim();

	if (u && !/^https?:\/\//i.test(u)) {
		u = "https://" + u;
	}

	try {
		const parsed = new URL(u);
		const hostname = parsed.hostname;
		if (!/\./.test(hostname)) return null;
		if (!/[a-zA-Z]{2,}$/.test(hostname.split(".").pop())) return null;

		return parsed.href;
	} catch {
		return null;
	}
};

export default normalizeUrl;
