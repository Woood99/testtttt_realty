import { useContext } from "react";
import { useSelector } from "react-redux";

import { RoutesPath } from "@/constants";

import { ChatContext } from "@/context";

import { checkAuthUser } from "@/redux";

import { ExternalLink } from "@/ui";
import { IconCall, IconChat, IconMonitor2, IconNotebook2, IconUser1 } from "@/ui/Icons";

const ChatSidebarMenu = () => {
	const { setSidebarModalOpen, setContactsModalOpen } = useContext(ChatContext);
	const authUser = useSelector(checkAuthUser);

	if (!authUser) return;

	return (
		<div className='mmd1:w-[85px] mmd1:min-w-[85px] h-full pt-6 pb-4 border-r border-r-primary800 flex mmd1:flex-col md1:order-1 md1:!py-0 md1:items-center md1:gap-3 md1:px-2 md1:bg-white '>
			<ExternalLink
				to={RoutesPath.home}
				className='mmd1:w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2 text-primary400 transition-all hover:text-dark'>
				<IconMonitor2 className='stroke-[3px] stroke-[currentColor]' />
				Сайт
			</ExternalLink>
			<div className='mt-3 mb-1.5 w-3/4 mx-auto bg-primary800 h-[1px] md1:hidden' />
			<button
				type='button'
				className='w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2 mmd1:mt-3 text-primary400 transition-all hover:text-dark'
				onClick={() => {
					setContactsModalOpen(true);
				}}>
				<IconNotebook2 className='stroke-[3px] stroke-[currentColor]' />
				Контакты
			</button>
			<button
				type='button'
				className='w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2 mmd1:mt-4 text-primary400 transition-all hover:text-dark'
				onClick={() => {}}>
				<IconChat className='stroke-[3px] stroke-[currentColor]' />
				Чаты
			</button>
			<button
				type='button'
				className='w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2 mmd1:mt-4 text-primary400 transition-all hover:text-dark'
				onClick={() => {}}>
				<IconCall className='stroke-[3px] stroke-[currentColor]' />
				Звонки
			</button>

			<div className='mmd1:mt-auto md1:ml-auto'>
				<button
					type='button'
					className='w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2 text-primary400 transition-all hover:text-dark'
					onClick={() => {
						setSidebarModalOpen(true);
					}}>
					<IconUser1 className='stroke-[currentColor]' />
					Меню
				</button>
			</div>
		</div>
	);
};

export default ChatSidebarMenu;
