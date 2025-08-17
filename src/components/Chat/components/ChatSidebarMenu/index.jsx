import { useContext } from "react";

import { RoutesPath } from "@/constants";

import { ChatContext } from "@/context";

import { ExternalLink } from "@/ui";
import { IconHouseBuilding, IconSettings, IconUsers2 } from "@/ui/Icons";

const ChatSidebarMenu = () => {
	const { setSidebarModalOpen, setContactsModalOpen } = useContext(ChatContext);

	return (
		<>
			<div className='mmd1:w-[85px] mmd1:min-w-[85px] h-full pt-6 pb-4 border-r border-r-primary800 flex mmd1:flex-col md1:order-1 md1:!py-0 md1:items-center md1:gap-3 md1:px-2 md1:bg-white '>
				<ExternalLink
					to={RoutesPath.home}
					className='mmd1:w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2'>
					<IconHouseBuilding className='fill-blue' />
					Сайт
				</ExternalLink>
				<div className='my-3 w-3/4 mx-auto bg-primary800 h-[1px] md1:hidden' />
				<button
					type='button'
					className='w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2 mmd1:mt-4'
					onClick={() => {
						setContactsModalOpen(true);
					}}>
					<IconUsers2 className='fill-blue' />
					Контакты
				</button>
				<button
					type='button'
					className='w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2 mmd1:mt-4'
					onClick={() => {}}>
					<IconUsers2 className='fill-blue' />
					Чаты
				</button>
				<button
					type='button'
					className='w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2 mmd1:mt-4'
					onClick={() => {}}>
					<IconUsers2 className='fill-blue' />
					Звонки
				</button>

				<div className='mmd1:mt-auto md1:ml-auto'>
					<button
						type='button'
						className='w-full flex flex-col gap-2 items-center text-verySmall md1:text-small font-medium md1:px-2 py-2'
						onClick={() => {
							setSidebarModalOpen(true);
						}}>
						<IconSettings className='fill-blue' />
						Меню
					</button>
				</div>
			</div>
		</>
	);
};

export default ChatSidebarMenu;
