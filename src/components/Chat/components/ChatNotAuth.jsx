import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";

import { COOKIE_MAX_AGE, PrivateRoutesPath } from "@/constants";

import { sendPostRequest } from "@/api/requestsApi";

import { useAuth } from "@/hooks";

import { setSelectAccLogModalOpen } from "@/redux";

import { ExternalLink } from "@/ui";

import Button from "../../../uiForm/Button";

import { ChatIconDialogs } from "./ChatIconDialogs";

const ChatNotAuth = () => {
	const [cookies, setCookie] = useCookies();
	const { setAuthUser, userConnectionEcho } = useAuth();

	const dispatch = useDispatch();
	const [isLoadingHandler, setIsLoadingHandler] = useState(false);

	return (
		<div className='text-center flex flex-col items-center justify-center flex-grow h-full'>
			<ChatIconDialogs />
			<h3 className='title-3 mt-12'>Общаться с застройщиком — легко</h3>
			<p className='mt-1.5 text-primary400'>
				Для того что-бы начать общение, <br /> войдите в свой аккаунт
			</p>
			<div className='mt-5 mx-6 w-[85%]'>
				<Button
					className='w-full'
					onClick={() => {
						dispatch(setSelectAccLogModalOpen(true));
					}}>
					Войти
				</Button>
				{/* <Button
					variant='secondary'
					className='w-full mt-2'
					isLoading={isLoadingHandler}
					onClick={async () => {
						setIsLoadingHandler(true);

						const data = {
							email: "s-admin@gmail.com",
							password: "ZK||ao}7c9w~s"
						};
						await sendPostRequest("/api/login", { ...data })
							.then(res => {
								const token = res.data.result;
								setCookie("loggedIn", true, {
									maxAge: COOKIE_MAX_AGE,
									path: "/"
								});
								setCookie("access_token", token, {
									maxAge: COOKIE_MAX_AGE,
									path: "/"
								});
								setAuthUser(true).then(async user => {
									await new Promise(resolve => setTimeout(resolve, 100));
									userConnectionEcho(user, res.data.result);
									await new Promise(resolve => setTimeout(resolve, 100));
									setIsLoadingHandler(false);
								});
							})
							.catch(error => {
								console.log(error);
							});
					}}>
					Войти как админ
				</Button>

				<ExternalLink to={PrivateRoutesPath.login} className='mt-2 w-full'>
					<Button Selector='div' variant='secondary' className=''>
						Войти через логин
					</Button>
				</ExternalLink> */}
			</div>
		</div>
	);
};

export default ChatNotAuth;
