import React from "react";
import { Helmet } from "react-helmet";

import { RoutesPath } from "@/constants";

import { useAuth } from "@/hooks";

import { ProfileEditContext } from "@/context";

import { MainLayout } from "@/layouts";

import { Header } from "@/components";

import ProfileEditForm from "./ProfileEditForm";
import { useProfile } from "./useProfile";

const ProfileEdit = () => {
	const { logout } = useAuth();
	const { data, photo, setPhoto, onSubmitHandler, isLoading } = useProfile();

	const onClickLogout = () => {
		logout().then(() => {
			setTimeout(() => {
				if (window.location.pathname !== RoutesPath.loginPhone) {
					window.location.href = RoutesPath.home;
				}
			}, 100);
		});
	};

	return (
		<MainLayout
			helmet={
				<Helmet>
					<title>Личный кабинет</title>
					<meta name='description' content='Добро пожаловать на сайт inrut.ru' />;
					<meta name='description' content='На inrut.ru вы можете решить любой вопрос с недвижимостью' />;
				</Helmet>
			}>
			<ProfileEditContext.Provider value={{ data, photo, setPhoto, onSubmitHandler, onClickLogout, isLoading }}>
				<Header />
				<main className='main'>
					<div className='main-wrapper'>
						<div className='container-desktop'>{data && <ProfileEditForm className='white-block' />}</div>
					</div>
				</main>
			</ProfileEditContext.Provider>
		</MainLayout>
	);
};

export default ProfileEdit;
