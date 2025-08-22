import isEmptyArrObj from "../../helpers/isEmptyArrObj";
import { getDataRequest } from "../requestsApi";

export const getVideos = async data => {
	try {
		const result = data.length ? await getDataRequest(`/api/video-url`, { url: data }).then(res => res.data) : [];
		return result.filter(item => item && !isEmptyArrObj(item));
	} catch (error) {
		console.log(error);
	}
};
