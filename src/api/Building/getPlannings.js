import { getDataRequest } from "../requestsApi";

export const getPlannings = async (id, data = {}) => {
	try {
		const response = await getDataRequest(`/api/building/${id}/plannings`, data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
