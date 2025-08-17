import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { authLoadingSelector, getCurrentCitySelector, getUserInfo } from "@/redux";

import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from "../../constants/roles";
import { isAdmin, isSeller } from "../../helpers/utils";

export const useSellerLayout = () => {
	const city = useSelector(getCurrentCitySelector);

	const [userRole, setUserRole] = useState(ROLE_BUYER.name);
	const userInfo = useSelector(getUserInfo);
	const authLoading = useSelector(authLoadingSelector);

	useEffect(() => {
		if (!city.id) return;
	}, [city.id]);

	useEffect(() => {
		if (isAdmin(userInfo)) {
			setUserRole(ROLE_ADMIN.name);
		} else if (isSeller(userInfo)) {
			setUserRole(ROLE_SELLER.name);
		} else {
			setUserRole(ROLE_BUYER.name);
		}
	}, [userInfo]);

	return { userInfo, userRole, authLoading };
};
