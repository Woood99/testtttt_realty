import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUserInfo } from "@/redux";

import { EmptyBlock } from "@/components";

import { sendPostRequest } from "../../api/requestsApi";
import Header from "../../components/Header";
import RepeatContent from "../../components/RepeatContent";
import { RoutesPath, SellerRoutesPath } from "../../constants/RoutesPath";
import getSrcImage from "../../helpers/getSrcImage";
import { isSeller } from "../../helpers/utils";
import MainLayout from "../../layouts/MainLayout";
import { CardPrimarySkeleton } from "../../ui/CardPrimary/CardPrimarySkeleton";
import { ExternalLink } from "../../ui/ExternalLink";
import Tag from "../../ui/Tag";
import { TagsMoreWidthDynamic } from "../../ui/TagsMore";
import Button from "../../uiForm/Button";

const StreamList = () => {
	const tags = ["#тег 1", "#тег 2", "#тег 3"];

	const [data, setData] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const userInfo = useSelector(getUserInfo);
	const userIsSeller = isSeller(userInfo);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const { data: result } = await sendPostRequest("/api/stream/all", { page: 1, per_page: 100 });

				setData({
					pages: result.pages,
					streams: result.streams.data,
					total: result.total
				});
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<MainLayout
			helmet={
				<Helmet>
					<title>Стримы</title>
					<meta name='description' content='Добро пожаловать на сайт inrut.ru' />;
					<meta name='description' content='На inrut.ru вы можете решить любой вопрос с недвижимостью' />;
				</Helmet>
			}>
			<Header />
			<main className='main'>
				<div className='main-wrapper'>
					<div className='container'>
						{userIsSeller && (
							<div className='white-block mb-3'>
								<div className='flex justify-between gap-4'>
									<h2 className='title-2 mb-6'>Стримы</h2>
									<Button size='Small' onClick={() => navigate(SellerRoutesPath.stream.create)}>
										Новый стрим
									</Button>
								</div>
							</div>
						)}

						<div className='white-block'>
							{isLoading && (
								<div className='grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1'>
									<RepeatContent count={3}>
										<CardPrimarySkeleton className='!p-0' />
									</RepeatContent>
								</div>
							)}
							{Boolean(!isLoading && !data.streams.length) && <EmptyBlock block={false} />}
							{Boolean(!isLoading && data.streams.length) && (
								<div className='grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1'>
									{data.streams.map(item => {
										return (
											<div key={item.id} className='rounded-xl relative overflow-hidden bg-[#f5f7fa]'>
												<button
													type='button'
													className='z-30 relative'
													onClick={() => {
														sendPostRequest(`/seller-api/stream/${item.id}/delete`);
													}}>
													delete
												</button>
												<ExternalLink to={`${RoutesPath.stream.view}${item.id}`} className='CardLinkElement z-20' />
												<div className='pb-[56%] rounded-xl overflow-hidden w-full ibg'>
													<img src={getSrcImage(item.image)} className='rounded-xl' alt='' />
												</div>
												<div className='p-6'>
													<h2 className='title-2-5 mb-4 h-14'>{item.title}</h2>
													<Tag
														size='small'
														color={item.status === "live" ? "red" : item.status === "scheduled" ? "green" : "blue"}
														className=''>
														{item.status === "live" ? "В эфире" : item.status === "scheduled" ? "Скоро" : "Запись"}
													</Tag>
													{Boolean(item.scheduled_start) && (
														<div className='mt-4 text-defaultMax'>
															{dayjs(item.scheduled_start).format("D MMMM YYYY")}
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</MainLayout>
	);
};

export default StreamList;
