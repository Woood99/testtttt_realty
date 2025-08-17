import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER, RoutesPath } from "@/constants";

import { isAdmin, isEmptyArrObj, isSeller } from "@/helpers";

import { checkAuthUser, getIsDesktop, getUserInfo } from "@/redux";

import {
	BlockApartmentRenov,
	BlockEcologyParks,
	BlockPersonalDiscount,
	BodyAndSidebar,
	ErrorLoading,
	FeedBlockPrimary,
	FixedBlock,
	GalleryThumb,
	Header,
	HeaderFixedNav,
	ParallaxComponent,
	QuestionToChat,
	SidebarMove,
	SuggestionsCard,
	SuggestionsProvider,
	suggestionsTypes
} from "@/components";

import { AnimatedText, BtnActionFavorite, BtnActionShare, Maybe, ModalWrapper } from "@/ui";

import { ChoiceSpecialistForChat, RecordViewing, RecordViewingContact, RecordViewingSent, SelectAccLogModal, ShareModal } from "@/ModalsMain";

import HelmetBuilding from "../../Helmets/HelmetBuilding";
import { BuildingContext } from "../../context";
import { useToggleNotification } from "../../hooks/useToggleNotification";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../uiForm/Button";

import BuildingApartments from "./BuildingApartments";
import BuildingInfo from "./BuildingInfo";
import BuildingInfoSecond from "./BuildingInfoSecond";
import BuildingMap from "./BuildingMap";
import BuildingSidebar from "./BuildingSidebar";
import ModalSidebar from "./BuildingSidebar/ModalSidebar";
import BuildingSkeleton from "./BuildingSkeleton";
import BuildingSpecialists from "./BuildingSpecialists";
import BuildingStatistics from "./BuildingStatistics";
import BuildingСonstruction from "./BuildingСonstruction";
import { useBuilding } from "./useBuilding";

const Building = () => {
	const { id } = useParams();
	const stickyHelpRef = useRef(null);
	const galleryThumbRef = useRef(null);
	const [isOpenRecordView, setIsOpenRecordView] = useState(false);
	const [applicationSentModal, setApplicationSentModal] = useState(false);
	const [isOpenShareModal, setIsOpenShareModal] = useState(false);

	const isDesktop = useSelector(getIsDesktop);
	const { isVisibleNotification, setIsVisibleNotification, onClose: notifOnClose } = useToggleNotification("building_notif_status");

	const [userRole, setUserRole] = useState("");
	const userInfo = useSelector(getUserInfo);
	const authUser = useSelector(checkAuthUser);

	useEffect(() => {
		if (isAdmin(userInfo)) {
			setUserRole(ROLE_ADMIN.name);
		} else if (isSeller(userInfo) && userInfo.associated_objects?.includes(+id)) {
			setUserRole(ROLE_SELLER.name);
		} else {
			setUserRole(ROLE_BUYER.name);
		}
	}, [userInfo]);

	const {
		buildingData,
		minPriceAllObjects,
		maxPriceAllObjects,
		advantages,
		setIsOpenChoiceSpecialist,
		specialistsData,
		goToChat,
		goToChatCall,
		buildingDataError,
		myDiscount,
		frames,
		constructItems,
		isOpenChoiceSpecialist,
		suggestions,
		getSuggestions,
		isLoading,
		isOpenChoiceSpecialistCall,
		setIsOpenChoiceSpecialistCall
	} = useBuilding(id);

	return (
		<MainLayout helmet={<HelmetBuilding data={buildingData} />}>
			<Header />
			{isLoading && <BuildingSkeleton />}
			<Maybe
				condition={!buildingDataError && !isLoading}
				render={() => (
					<BuildingContext.Provider
						value={{
							...buildingData,
							minPriceAllObjects,
							maxPriceAllObjects,
							advantages,
							setIsOpenChoiceSpecialist,
							setIsOpenShareModal,
							specialistsData,
							goToChat,
							goToChatCall,
							isVisibleNotification,
							setIsVisibleNotification,
							notifOnClose,
							userRole,
							setIsOpenChoiceSpecialistCall
						}}>
						<main className={`main ${!isDesktop ? "!pb-[110px]" : ""}`}>
							{isDesktop && <HeaderFixedNav />}
							<ParallaxComponent condition={!isDesktop} block={galleryThumbRef.current} container={stickyHelpRef.current}>
								<div className='main-wrapper md1:pt-0'>
									<div className='container-desktop'>
										<Maybe condition={userRole === ROLE_SELLER.name}>
											<BuildingStatistics buildingData={buildingData} />
										</Maybe>
										<Maybe condition={buildingData.gallery.length || buildingData.videosGalleryData.length}>
											<section className='mb-3' style={{ position: isDesktop ? "relative" : "absolute" }} ref={galleryThumbRef}>
												<GalleryThumb items={buildingData.gallery} videosGallery={buildingData.videosGalleryData}>
													<div className='absolute top-[26px] right-[26px]  md1:top-4 md1:right-4 z-10 flex items-center gap-2'>
														<BtnActionFavorite
															id={id}
															type='complex'
															variant='circle'
															className={userRole === ROLE_SELLER.name ? "opacity-60 pointer-events-none" : ""}
														/>
														<BtnActionShare variant='circle' set={setIsOpenShareModal} />
													</div>
												</GalleryThumb>
											</section>
										</Maybe>
										<BodyAndSidebar className='relative'>
											<div
												className='flex flex-col gap-3 min-w-0'
												style={{ marginTop: isDesktop ? 0 : 400, position: "relative", zIndex: 99 }}
												ref={stickyHelpRef}>
												<Maybe
													condition={suggestions?.length}
													render={() => (
														<SuggestionsProvider
															suggestions_type={suggestionsTypes.buyerAll}
															customUpdate={() => {
																getSuggestions(id);
															}}>
															{suggestions.map(card => {
																return (
																	<section key={card.status_id}>
																		<div className='white-block'>
																			<SuggestionsCard
																				card={card}
																				suggestions_type={suggestionsTypes.buyerAll}
																				variant='default'
																			/>
																		</div>
																	</section>
																);
															})}
														</SuggestionsProvider>
													)}
												/>
												<BuildingInfo />
												<section id='section-apartments-id'>
													<BuildingApartments
														frames={frames}
														tags={buildingData.tags}
														advantages={advantages}
														userRole={userRole}
													/>
												</section>
												<Maybe condition={userRole === ROLE_BUYER.name}>
													<Maybe
														condition={myDiscount && !isEmptyArrObj(myDiscount)}
														render={() =>
															myDiscount.map(item => (
																<section key={item.id}>
																	<BlockPersonalDiscount data={item} mainData={buildingData} variant='block' />
																</section>
															))
														}
													/>
												</Maybe>
												{Boolean(specialistsData.length) && (
													<section>
														<BuildingSpecialists
															descr=''
															specialists={specialistsData}
															building_id={buildingData.id}
															toChat
														/>
													</section>
												)}
												<QuestionToChat
													classNames='white-block'
													building_id={buildingData.id}
													organization_id={buildingData.developer.id}
													isSpecialist={Boolean(specialistsData.length)}
												/>

												<FeedBlockPrimary
													data={[
														...buildingData.videos.map(item => ({ link: item, type: "video" })),
														...buildingData.shorts.map(item => ({ link: item, type: "short" }))
													]}
													currentComplexId={buildingData.id}
												/>
												<FeedBlockPrimary
													data={[
														...buildingData.stock.map(item => ({ ...item, building_id: buildingData.id, type: "stock" })),
														...buildingData.calculations.map(item => ({
															...item,
															building_id: buildingData.id,
															type: "calculation"
														})),
														...buildingData.news.map(item => ({ ...item, building_id: buildingData.id, type: "news" }))
													]}
													currentComplexId={buildingData.id}
												/>
												<BuildingInfoSecond />
												<Maybe
													condition={buildingData.apartmentRenov.length || buildingData.videosApartRenovData.length}
													render={() => (
														<section id='section-apartRenov-id'>
															<BlockApartmentRenov
																videos={buildingData.videosApartRenovData}
																data={buildingData.apartmentRenov}
																sidebar={<ModalSidebar setIsOpenRecordView={setIsOpenRecordView} />}
															/>
														</section>
													)}
												/>
												<Maybe
													condition={buildingData.ecologyParks.length || buildingData.videosEcologyParksData.length}
													render={() => (
														<section id='section-ecologyParks-id'>
															<BlockEcologyParks
																videos={buildingData.videosEcologyParksData}
																data={buildingData.ecologyParks}
																sidebar={<ModalSidebar setIsOpenRecordView={setIsOpenRecordView} />}
															/>
														</section>
													)}
												/>
												<Maybe
													condition={constructItems.length}
													render={() => (
														<section id='section-constPrgs-id'>
															<BuildingСonstruction
																data={constructItems}
																frames={frames}
																options={{
																	frames,
																	dataObject: buildingData
																}}
																sidebar={<ModalSidebar setIsOpenRecordView={setIsOpenRecordView} />}
															/>
														</section>
													)}
												/>

												{!isDesktop && (
													<BuildingSidebar
														setIsOpenRecordView={setIsOpenRecordView}
														controls
														specialists={specialistsData}
													/>
												)}
											</div>
											{isDesktop && (
												<BuildingSidebar setIsOpenRecordView={setIsOpenRecordView} controls specialists={specialistsData} />
											)}
										</BodyAndSidebar>
									</div>

									<div className='container-desktop'>
										<section className='mt-3' id='section-location-id'>
											<BuildingMap currentBuilding={buildingData} coordinates={buildingData.location} variant='block' />
										</section>
									</div>
								</div>
							</ParallaxComponent>

							<Maybe condition={userRole === ROLE_BUYER.name}>
								<FixedBlock activeDefault conditionWidth={!isDesktop}>
									<div className='py-2.5 px-4 gap-2 grid grid-cols-2 md3:grid-cols-1'>
										<Button size='Small' onClick={goToChat}>
											Написать в чат
										</Button>
										<Button size='Small' variant='secondary' onClick={() => setIsOpenRecordView(true)}>
											<AnimatedText texts={["Записаться на просмотр", "Записаться на онлайн-показ"]} intervalTime={3000} />
										</Button>
									</div>
								</FixedBlock>
							</Maybe>
						</main>
						<Maybe
							condition={authUser}
							render={() => (
								<Maybe
									condition={suggestions.length}
									render={() => (
										<RecordViewingContact
											condition={isOpenRecordView}
											set={setIsOpenRecordView}
											suggestions={suggestions}
											customUpdate={async () => {
												setIsOpenRecordView(false);
												await getSuggestions(id);
											}}
										/>
									)}
									fallback={
										<ModalWrapper condition={isOpenRecordView}>
											<RecordViewing
												condition={isOpenRecordView}
												set={setIsOpenRecordView}
												type='building'
												id={buildingData?.id}
												developName={buildingData.developer.name}
												objectData={buildingData}
												specialists={specialistsData}
												visibleCard={false}
												onUpdate={() => {
													getSuggestions(id);
													setIsOpenRecordView(false);
													setApplicationSentModal(true);
												}}
											/>
										</ModalWrapper>
									}
								/>
							)}
							fallback={<SelectAccLogModal condition={isOpenRecordView} set={setIsOpenRecordView} />}
						/>

						<RecordViewingSent condition={applicationSentModal} set={setApplicationSentModal} />
						<ChoiceSpecialistForChat
							condition={isOpenChoiceSpecialist}
							set={setIsOpenChoiceSpecialist}
							specialists={specialistsData}
							building_id={buildingData.id}
							title='Выберите менеджера для консультации'
							descr='Напишите застройщику в чат, он подробно ответит на ваши вопросы'
							toChat
						/>
						<ChoiceSpecialistForChat
							condition={isOpenChoiceSpecialistCall}
							set={setIsOpenChoiceSpecialistCall}
							specialists={specialistsData}
							building_id={buildingData.id}
							title='Выберите менеджера для консультации'
							descr='По умолчанию ваша камера будет выключена'
							toCall
						/>
						<ShareModal condition={isOpenShareModal} set={setIsOpenShareModal} />
					</BuildingContext.Provider>
				)}
			/>
			<Maybe condition={buildingDataError}>
				<main className='main'>
					<div className='main-wrapper flex flex-col'>
						<div className='white-block !py-16 text-center flex flex-col items-center flex-grow'>
							<Maybe condition={buildingDataError === 404} fallback={<ErrorLoading />}>
								<h1 className='title-2'>Объявление снято с публикации</h1>
								<a href={RoutesPath.home} className='mt-6'>
									<Button Selector='div'>Перейти на главную страницу</Button>
								</a>
							</Maybe>
						</div>
					</div>
				</main>
			</Maybe>
		</MainLayout>
	);
};

export default Building;
