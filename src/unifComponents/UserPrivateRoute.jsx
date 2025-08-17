import React from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { PrivateRoutesPath, ROLE_BUYER, ROLE_SELLER, RoutesPath } from "@/constants";

import { isEmptyArrObj } from "@/helpers";

import { getUserInfo } from "@/redux";

const UserPrivateRoute = ({ children, role_id }) => {
	const [cookies] = useCookies();
	const userInfo = useSelector(getUserInfo);

	if (!cookies.loggedIn) {
		if (role_id === ROLE_SELLER.id) {
			return <Navigate to={RoutesPath.loginPhone} />;
		}
		if (role_id === ROLE_BUYER.id || role_id === "auth") {
			return <Navigate to={RoutesPath.loginPhone} />;
		}
	} else if (userInfo && !isEmptyArrObj(userInfo)) {
		if (role_id === ROLE_SELLER.id && userInfo.role?.id !== ROLE_SELLER.id) {
			return <Navigate to={PrivateRoutesPath.login} />;
		}
		if (role_id === ROLE_BUYER.id && userInfo.role?.id !== ROLE_BUYER.id) {
			return <Navigate to={RoutesPath.loginPhone} />;
		}
	}

	return children;
};

export default UserPrivateRoute;
