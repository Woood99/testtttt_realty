import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BASE_URL } from "@/constants";

import { sendPostRequest } from "@/api";

import { useAuth } from "@/hooks";

import { getSrcImage, isEmptyArrObj, refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from "@/helpers";

import { addToastPrimary, getUserInfo } from "@/redux";

export const useProfile = () => {
	const [data, setData] = useState(null);
	const userInfo = useSelector(getUserInfo);
	const [isLoading, setIsLoading] = useState(false);
	const { setAuthUser } = useAuth();
	const dispatch = useDispatch();

	const [photo, setPhoto] = useState(null);

	useEffect(() => {
		if (isEmptyArrObj(userInfo)) return;
		setData(userInfo);

		if (userInfo.image) {
			setPhoto({ id: 1, image: getSrcImage(userInfo.image) });
		}
	}, [userInfo]);

	const onSubmitHandler = async currentData => {
		setIsLoading(true);
		const resData = {
			...currentData,
			name: currentData.name.trim(),
			surname: currentData.surname.trim(),
			father_name: currentData.father_name.trim(),
			photo: photo ? [photo] : null,
			phone: currentData.phone.slice(1),
			email: currentData.email || userInfo.email
		};

		const formData = new FormData();

		if (resData.photo) {
			resData.photo = refactPhotoStageOne(resData.photo);
			refactPhotoStageAppend(resData.photo, formData);
			resData.photo = refactPhotoStageTwo(resData.photo);
			resData.photo = resData.photo[0];

			if (!resData.photo.new_image) {
				resData.photo.image = resData.photo.image.replace(BASE_URL, "");
			}
		} else {
			resData.photo = null;
		}

		formData.append("data", JSON.stringify(resData));
		await sendPostRequest("/api/profile/edit", formData, { "Content-Type": "multipart/form-data" });
		await setAuthUser();
		dispatch(addToastPrimary({ title: "Данные сохранены" }));

		setIsLoading(false);
	};

	return { data, photo, setPhoto, onSubmitHandler, isLoading };
};
