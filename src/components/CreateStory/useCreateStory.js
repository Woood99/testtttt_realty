import { useState } from "react";
import { useDispatch } from "react-redux";

import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from "@/helpers";

import { addToastPrimary } from "@/redux";

import getImagesObj, { getVideoObj } from "@/unifComponents/getImagesObj";

export const useCreateStory = () => {
	const [files, setFiles] = useState([]);
	const dispatch = useDispatch();
	const [links, setLinks] = useState([]);
	const [description, setDescription] = useState("");
	const MAX_LENGTH = 5;
	const [isLoading, setIsLoading] = useState(false);

	const addPhoto = newFiles => {
		const newData = [...files, ...newFiles];

		const photosData = getImagesObj(
			newData.filter(item => {
				return (item.type || item.file.type).startsWith("image");
			})
		).map(item => ({
			...item,
			type: "image"
		}));

		const videosData = getVideoObj(
			newData.filter(item => {
				return item.type.startsWith("video");
			})
		).map(item => ({
			...item,
			type: "video",
			url: item.video
		}));

		const resData = [...videosData, ...photosData].slice(0, MAX_LENGTH);

		if ([...photosData, ...videosData].length > MAX_LENGTH) {
			dispatch(addToastPrimary({ title: `История не может быть больше ${MAX_LENGTH} фото/видео` }));
		}

		setFiles(resData);
	};

	const deleteItem = (_, idImage) => {
		const newData = files
			.filter(item => item.id !== idImage)
			.map((item, index) => {
				return { ...item, id: index + 1 };
			});

		setFiles(newData);
	};

	const onSubmitHandler = async () => {
		if (!files.length) return;
		setIsLoading(true);
		const filesOrders = files.map((item, index) => ({
			file: item.file,
			id: index + 1,
			type: item.type
		}));
		const data = {
			links: links.map(item => ({
				text: item.text,
				url: item.url
			})),
			description,
			videos: filesOrders.filter(item => item.type === "video"),
			images: filesOrders.filter(item => item.type === "image")
		};

		const formData = new FormData();

		if (data.videos.length) {
			data.videos = refactPhotoStageOne(data.videos, "video", "video");
			refactPhotoStageAppend(data.videos, formData, "video", "video");
			data.videos = refactPhotoStageTwo(data.videos, "video", "video");
		}
		if (data.images.length) {
			data.images = refactPhotoStageOne(data.images);
			refactPhotoStageAppend(data.images, formData);
			data.images = refactPhotoStageTwo(data.images);
		}
		formData.append("data", JSON.stringify(data));

		for (let pair of formData.entries()) {
			console.log(pair[0] + ": " + pair[1]);
		}
		console.log(data);

		await new Promise(resolve => setTimeout(resolve, 5000));
		reset();
	};

	const reset = () => {
		setFiles([]);
		setLinks([]);
		setDescription("");
		setIsLoading(false);
	};

	return { files, links, setLinks, description, setDescription, isLoading, addPhoto, deleteItem, onSubmitHandler, reset };
};
