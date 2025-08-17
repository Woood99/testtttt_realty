import { HomeContext } from "..";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

import { getIsDesktop, getUserInfo } from "@/redux";

import { isAdmin } from "../../../helpers/utils";
import ListingForm from "../../Listing/ListingForm";
import { useListing } from "../../Listing/useListing";

const HomeFilters = () => {
	const isDesktop = useSelector(getIsDesktop);
	const { setStickers } = useContext(HomeContext);

	const userInfo = useSelector(getUserInfo);
	const userIsAdmin = isAdmin(userInfo);

	if (!isDesktop) return;

	const { titleText, options, stickers } = useListing(userIsAdmin, true);

	useEffect(() => {
		if (!stickers.length) return;
		setStickers(stickers);
	}, [JSON.stringify(stickers)]);

	return (
		<div>
			<h3 className='title-1 mt-12 mb-8 text-center'>{titleText}</h3>
			<ListingForm options={options} isAdmin={userIsAdmin} className='mt-6 mb-8' />
		</div>
	);
};

export default HomeFilters;
