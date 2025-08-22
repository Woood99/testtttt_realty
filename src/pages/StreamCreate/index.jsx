import cn from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";


import { getBuilding, getCardBuildingsByIds, getFrames, sendPostRequest } from "@/api";

import { convertToDate, isEmptyArrObj, isValidTime, refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from "@/helpers";

import { getUserInfo } from "@/redux";

import { MainLayout } from "@/layouts";

import { ChoiceApartmentsFilter, Header } from "@/components";
import { DragDropItems } from "@/components/DragDrop/DragDropItems";
import { FileDropZone } from "@/components/DragDrop/FileDropZone";

import { CardInfo, Spinner } from "@/ui";

import { Button, ControllerFieldInput, ControllerFieldTextarea } from "@/uiForm";

import { choiceApartmentsFilterOptions } from "@/data/selectsField";
import getImagesObj from "@/unifComponents/getImagesObj";

const StreamCreate = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingCreate, setIsLoadingCreate] = useState(false);
	const [isLiveStream, setIsLiveStream] = useState(false);
	const userInfo = useSelector(getUserInfo);
	const [complexes, setComplexes] = useState(0);
	const [isLoadingComplex, setIsLoadingComplex] = useState(false);
	const [currentComplex, setCurrentComplex] = useState(null);
	const navigate = useNavigate();

	const [selectedApartments, setSelectedApartments] = useState([]);
	const [filterFields, setFilterFields] = useState(choiceApartmentsFilterOptions);

	const {
		formState: { errors },
		handleSubmit,
		control,
		watch,
		setValue,
		reset
	} = useForm();

	const [images, setImages] = useState([]);

	const deleteItem = (_, idImage) => {
		const newData = images
			.filter(item => item.id !== idImage)
			.map((item, index) => {
				return { ...item, id: index + 1 };
			});

		setImages(newData);
	};

	useEffect(() => {
		if (isEmptyArrObj(userInfo)) return;

		const fetchStream = async () => {
			const { data: result } = await sendPostRequest("/seller-api/stream/all", { page: 1, per_page: 100 });
			const { cards } = await getCardBuildingsByIds(userInfo.associated_objects);
			setComplexes(cards);

			setIsLiveStream(result.streams.data.find(item => item.is_live));

			setIsLoading(false);
		};
		fetchStream();
	}, [userInfo]);

	const onSubmitHandler = async params => {
		// setIsLoadingCreate(true);
		const formData = new FormData();
		const payload = {
			title: params.title,
			scheduled_start: `${dayjs(convertToDate(params.date, "DD-MM-YYYY"), "DD.MM.YYYY").format("YYYY-MM-DD")} ${params.time}:00`,
			dialog_id: 286,
			description: params.description,
			complex: params.complex,
			apartments: selectedApartments.map(item => item.value),
			promos: params.promos,
			image: images
		};

		payload.image = refactPhotoStageOne(payload.image);
		refactPhotoStageAppend(payload.image, formData);
		payload.image = refactPhotoStageTwo(payload.image);
		payload.image = payload.image[0];
		
		formData.append("data", JSON.stringify(payload));

		const { data } = await sendPostRequest("/seller-api/stream/create", formData, {
			"Content-Type": "multipart/form-data",
			"Accept-Encodin": "gzip, deflate, br, zstd",
			Accept: "application/json"
		});
		// setIsLoadingCreate(false);
		// reset();
		// navigate(`${SellerRoutesPath.stream.broadcaster}${data.result.id}`);
	};

	return (
		<MainLayout
			helmet={
				<Helmet>
					<title>Создание стрима</title>
					<meta name='description' content='Добро пожаловать на сайт inrut.ru' />;
					<meta name='description' content='На inrut.ru вы можете решить любой вопрос с недвижимостью' />;
				</Helmet>
			}>
			<Header />
			<main className='main relative'>
				<div className='main-wrapper'>
					{isLoading && (
						<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
							<Spinner style={{ "--size": "65px" }} />
						</div>
					)}
					{Boolean(!isLoading && !isLiveStream) && (
						<div className='container'>
							<form className='white-block' onSubmit={handleSubmit(onSubmitHandler)}>
								<h2 className='title-2-5 mb-6'>Создание стрима</h2>
								<div className='grid grid-cols-3 justify-center gap-2'>
									<ControllerFieldInput control={control} beforeText='Название стрима' name='title' requiredValue errors={errors} />
									<ControllerFieldInput
										control={control}
										datePicker
										minDate={new Date()}
										beforeText='Дата'
										name='date'
										requiredValue
										errors={errors}
									/>
									<ControllerFieldInput
										control={control}
										mask='hhmmMask'
										beforeText='Время'
										name='time'
										requiredValue
										errors={errors}
										requiredFn={value => isValidTime(value)}
									/>
									<div className='col-span-3'>
										<ControllerFieldTextarea
											control={control}
											datePicker
											placeholder='Описание'
											name='description'
											requiredValue
											errors={errors}
											maxLength={2000}
											minHeight={140}
										/>
									</div>
									<div className={cn("col-span-3 mt-3", isLoadingComplex && "pointer-events-none opacity-50")}>
										<h3 className='title-3 mb-4'>ЖК</h3>
										<Controller
											name='complex'
											control={control}
											defaultValue={null}
											rules={{ required: true }}
											render={({ field }) => (
												<Swiper slidesPerView={3.5} spaceBetween={16}>
													{complexes.map((item, index) => (
														<SwiperSlide key={index}>
															<CardInfo
																image={item.images?.[0]}
																title={item.title}
																descr={item.deadline}
																onClick={async () => {
																	setIsLoadingComplex(true);

																	if (field.value !== item.id) {
																		const dataComplex = await getBuilding(item.id);
																		await new Promise(resolve => setTimeout(resolve, 300));
																		const dataFrames = await getFrames(item.id);
																		await new Promise(resolve => setTimeout(resolve, 300));

																		setCurrentComplex({
																			...dataComplex,
																			frames: dataFrames,
																			promos: [
																				...dataComplex.calculations,
																				...dataComplex.stock,
																				...dataComplex.news
																			]
																		});
																	} else {
																		setCurrentComplex(null);
																	}
																	setFilterFields(choiceApartmentsFilterOptions);
																	setSelectedApartments([]);
																	setValue("promos", []);

																	field.onChange(item.id === field.value ? null : item.id);
																	setIsLoadingComplex(false);
																}}
																isActive={item.id === field.value}
																isError={errors.complex}
															/>
														</SwiperSlide>
													))}
												</Swiper>
											)}
										/>
									</div>
									{Boolean(currentComplex) && (
										<div className='col-span-3 mt-6'>
											<ChoiceApartmentsFilter
												building_id={currentComplex.id}
												frames={currentComplex.frames}
												setData={setSelectedApartments}
												defaultValue={[]}
												filterFields={filterFields}
												setFilterFields={setFilterFields}
												selectedApartments={selectedApartments}
												setSelectedApartments={setSelectedApartments}
											/>
										</div>
									)}
									{Boolean(currentComplex && currentComplex.promos.length) && (
										<div className='col-span-3 mt-6'>
											<h3 className='title-3 mb-4'>Акции/новости</h3>
											<Controller
												name='promos'
												control={control}
												defaultValue={[]}
												render={({ field }) => (
													<Swiper slidesPerView={3.5} spaceBetween={16}>
														{currentComplex.promos.map((item, index) => (
															<SwiperSlide key={index}>
																<CardInfo
																	image={item.image}
																	title={item.name}
																	descr={item.descr}
																	onClick={() => {
																		if (field.value.includes(item.id)) {
																			field.onChange(field.value.filter(id => id !== item.id));
																		} else {
																			field.onChange([...field.value, item.id]);
																		}
																	}}
																	isActive={field.value.includes(item.id)}
																/>
															</SwiperSlide>
														))}
													</Swiper>
												)}
											/>
										</div>
									)}
									<div>
										<DragDropItems items={images} deleteItem={deleteItem} />
										<FileDropZone
											addFiles={files => {
												setImages(getImagesObj([...images, ...files]));
											}}
											className={images.length > 0 ? "mt-6" : ""}
										/>
									</div>
								</div>
								<Button className='w-full mt-8 ' isLoading={isLoadingCreate}>
									Создать
								</Button>
							</form>
						</div>
					)}
				</div>
			</main>
		</MainLayout>
	);
};

export default StreamCreate;
