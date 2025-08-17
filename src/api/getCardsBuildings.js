import { sendPostRequest } from "./requestsApi";

const getCardsBuildings = async data => {
	try {
		const response = await sendPostRequest("/api/catalog", data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const getCardBuildingsById = async id => {
	try {
		const response = await sendPostRequest("/api/catalog", { visibleObjects: [id] });
		return response.data?.cards?.[0];
	} catch (error) {
		console.log(error);
	}
};
export const getCardBuildingsByIds = async (ids = []) => {
	try {
		if (!ids.length) return;
		const response = await sendPostRequest("/api/catalog", { visibleObjects: ids });
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export default getCardsBuildings;
