import dayjs from "dayjs";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { getIsDesktop } from "@/redux";

import ChoiceSpecialistForChat from "../../ModalsMain/ChoiceSpecialistForChat";
import ShareModal from "../../ModalsMain/ShareModal";
import { GetDescrHTML } from "../../components/BlockDescr/BlockDescr";
import BodyAndSidebar from "../../components/BodyAndSidebar";
import FixedBlock from "../../components/FixedBlock";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { RoutesPath } from "../../constants/RoutesPath";
import { capitalizeWords } from "../../helpers/changeString";
import getSrcImage from "../../helpers/getSrcImage";
import { useQueryParams } from "../../hooks/useQueryParams";
import MainLayout from "../../layouts/MainLayout";
import Avatar from "../../ui/Avatar";
import CardSecond from "../../ui/CardSecond";
import { IconArrow, IconShareArrow } from "../../ui/Icons";
import { ThumbPhoto, ThumbPhotoDefault, ThumbPhotoFull } from "../../ui/ThumbPhoto";
import Button from "../../uiForm/Button";

import { usePromo } from "./usePromo";

const Promo = () => {
	const paramsString = useQueryParams();
	const [isShareModal, setIsShareModal] = useState(false);
	const isDesktop = useSelector(getIsDesktop);
	const { data, specialistsData, isOpenChoiceSpecialist, setIsOpenChoiceSpecialist, goToChat } = usePromo();

	if (!data) return;

	return (
		<MainLayout
			helmet={
				<Helmet>
					<title>Скидка</title>
					<meta name='description' content='Добро пожаловать на сайт inrut.ru' />;
					<meta name='description' content='На inrut.ru вы можете решить любой вопрос с недвижимостью' />;
				</Helmet>
			}>
			<Header />
			<main className={`main ${!isDesktop ? "!pb-[70px]" : ""}`}>
				<div className='main-wrapper'>
					<div className='white-block'>
						<div className='container-desktop'>
							<BodyAndSidebar className='!gap-x-6'>
								<section className='min-w-0'>
									<div className='flex flex-col'>
										<button size='Small' className='ml-auto mb-4 flex gap-2 items-center' onClick={() => setIsShareModal(true)}>
											<IconShareArrow className='fill-lightGray' width={15} height={15} />
											Поделиться
										</button>
										{!data.isActual && (
											<Button size='34' Selector='div' className='mb-6 flex-center-all gap-2 !bg-[#fff5e2] w-full !text-dark'>
												Срок действия акции истёк
											</Button>
										)}

										<h1 className='title-1'>{data.title}</h1>
										<p className='mt-4 text-primary400'>Действует до {dayjs(data.date_end * 1000).format("DD.MM.YYYY г.")}</p>

										<img className='mt-6 mb-6 rounded-xl w-full max-h-[512px]' src={getSrcImage(data.image)} alt={data.name} />
										{/* <img className="mt-6 mb-6 rounded-xl w-full" src={getSrcImage(data.image)} alt={data.name} /> */}
										{/* <div className="mt-6 mb-6 w-full min-w-full bg-thumbPhoto max-h-[512px] overflow-hidden rounded-xl">
                                 <img src={getSrcImage(data.image)} width={85} height={85} className="!object-contain w-full h-full max-h-[512px] rounded-xl" alt="" />
                              </div> */}
										<div className='text-littleBig'>
											<GetDescrHTML data={data.descr} />
										</div>
										{Boolean(+paramsString.visibleComplex) && (
											<div className='mt-8 flex gap-4 items-center w-full'>
												<Link to={`${RoutesPath.building}${data.building_id}`} className='w-full' target='_blank'>
													<Button Selector='div' variant='secondary'>
														Перейти в ЖК
													</Button>
												</Link>
											</div>
										)}
									</div>
									{Boolean(data.currentUser) && (
										<div className='mt-10 flex items-center gap-4 p-6 bg-primary600 rounded-xl relative'>
											<Link
												to={`${data.typeUser === "author" ? `${RoutesPath.specialists.inner}` : `${RoutesPath.developers.inner}`}${
													data.currentUser.id
												}`}
												target='_blank'
												className='CardLinkElement z-10'
											/>
											<Avatar
												size={65}
												src={data.currentUser.image || data.currentUser.avatar_url}
												title={data.currentUser.name}
											/>
											<div>
												<p className='text-primary400'>Автор статьи</p>
												<p className='font-medium mt-1.5 blue-link-hover'>
													{capitalizeWords(data.currentUser.name, data.currentUser.surname)}
												</p>
												<p className='text-primary400 mt-2'>
													{data.typeUser === "author" ? (
														<>Менеджер отдела продаж "{data.building_name}"</>
													) : (
														<>Застройщик</>
													)}
												</p>
											</div>
											{isDesktop && (
												<>
													<Button className='ml-auto relative z-20' size='Small' onClick={goToChat}>
														Написать в чат
													</Button>
													<IconArrow width={25} height={25} />
												</>
											)}
										</div>
									)}

									{Boolean(data.apartments && data.apartments.length) && (
										<div className='mt-10'>
											<div className='flex justify-between items-start gap-4 mb-6'>
												<h2 className='title-2'>Проходит в данных квартирах</h2>
												{data.apartments.length > 2 && (
													<a
														href={`${RoutesPath.listingFlats}?promo=${data.id}`}
														className='blue-link _active'
														target='_blank'>
														Смотреть всё
													</a>
												)}
											</div>
											<Swiper
												slidesPerView={1.2}
												spaceBetween={16}
												breakpoints={{
													799: {
														slidesPerView: 2.5,
														spaceBetween: 24
													},
													1222: {
														slidesPerView: 2.5,
														spaceBetween: 24
													}
												}}>
												{data.apartments.map(item => {
													return (
														<SwiperSlide key={item.id}>
															<CardSecond {...item} />
														</SwiperSlide>
													);
												})}
											</Swiper>
										</div>
									)}
								</section>
								<Sidebar>
									{Boolean(data.user) && (
										<div className='flex flex-col text-center items-center mmd1:p-6 white-block-small-desktop md1:mt-8'>
											<Avatar size={95} src={data.user.avatar_url} title={data.user.name} />
											<Link to={`${RoutesPath.developers.inner}${data.user.id}`} className='font-medium mt-5 blue-link-hover'>
												{capitalizeWords(data.user.name, data.user.surname)}
											</Link>
											<p className='text-primary400 mt-1.5'>{data.user.pos}</p>
											{(data.user.underСonstruction || data.user.handedOver) && (
												<div className='mt-5 font-medium'>
													{data.user.underСonstruction && <span>{data.user.underСonstruction} Строиться, </span>}
													{data.user.handedOver && <span>{data.user.handedOver} сдано</span>}
												</div>
											)}
										</div>
									)}
								</Sidebar>
							</BodyAndSidebar>
						</div>
					</div>
				</div>
				<FixedBlock activeDefault conditionWidth={!isDesktop}>
					<div className='py-2.5 px-4 gap-2 grid grid-cols-1'>
						<Button className='w-full' onClick={goToChat}>
							Написать в чат
						</Button>
					</div>
				</FixedBlock>
			</main>
			<ShareModal condition={isShareModal} set={setIsShareModal} title='Поделиться' />

			{data.typeUser === "developer" && (
				<ChoiceSpecialistForChat
					condition={isOpenChoiceSpecialist}
					set={setIsOpenChoiceSpecialist}
					specialists={specialistsData}
					building_id={data.building_id}
					toChat
				/>
			)}
		</MainLayout>
	);
};

export default Promo;
