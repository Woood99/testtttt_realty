import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ROLE_SELLER, SellerRoutesPath } from "@/constants";

import { getIsDesktop } from "@/redux";

import { Header } from "@/components";

import { Maybe } from "@/ui";

import HelmetHome from "../../Helmets/HelmetHome";
import ChatBtnFixed from "../../components/ChatBtnFixed";
import MainLayout from "../../layouts/MainLayout";

import Cashback from "./Cashback";
import styles from "./Home.module.scss";
import HomeFilters from "./HomeFilters";
import HomeSkeleton from "./HomeSkeleton";
import { NavBlock } from "./NavBlock";
import Recommend from "./Recommend";
import ShowcaseVideos from "./ShowcaseVideos";
import Stocks from "./Stocks";
import Videos from "./Videos";
import { useHomeData } from "./useHomeData";

// import INRUT_APP from "../../assets/inrut-app.apk";

export const HomeContext = createContext();

const Home = () => {
	const homeData = useHomeData();
	const { userRole, videoCards, shortsCards, cashbackCards, recommendedCards } = homeData;
	const navigate = useNavigate();
	const isDesktop = useSelector(getIsDesktop);
	const [stickers, setStickers] = useState([]);

	useEffect(() => {
		if (userRole === ROLE_SELLER.name) {
			navigate(SellerRoutesPath.home);
		}
	}, [userRole]);

	return (
		<MainLayout helmet={<HelmetHome />}>
			<Header />

			<main className='main'>
				<h1 className='visually-hidden'>На inrut.ru вы можете решить любой вопрос с недвижимостью</h1>
				<div className='main-wrapper'>
					<HomeContext.Provider value={{ ...homeData, stickers, setStickers }}>
						<div className='container-desktop'>
							{/* <a href={INRUT_APP} download='inrut-app.apk'>
								Download link
							</a> */}
							<div className={styles.HomeFilterContainer}>
								<NavBlock />
								<HomeFilters />
							</div>
						</div>
						<Maybe
							condition={videoCards.loading || shortsCards.loading || cashbackCards.loading || recommendedCards.loading}
							render={() => <HomeSkeleton />}
							fallback={
								<>
									<Recommend />
									{isDesktop && <ShowcaseVideos />}
									{!isDesktop && <Videos />}
									<Stocks />
									<Cashback />
								</>
							}
						/>
					</HomeContext.Provider>
				</div>
			</main>
			<ChatBtnFixed />
		</MainLayout>
	);
};

export default Home;
