import React, { memo, useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getIsDesktop } from "@/redux";

import DeleteBuildingModal from "../../../ModalsMain/DeleteBuildingModal";
import Sidebar from "../../../components/Sidebar";
import { PrivateRoutesPath, RoutesPath } from "../../../constants/RoutesPath";
import { ROLE_ADMIN, ROLE_BUYER } from "../../../constants/roles";
import { BuildingContext } from "../../../context";
import { BtnActionBg } from "../../../ui/ActionBtns";
import AnimatedText from "../../../ui/AnimatedText";
import Avatar from "../../../ui/Avatar";
import { IconEdit, IconTrash } from "../../../ui/Icons";
import Button from "../../../uiForm/Button";

const BuildingSidebar = memo(({ setIsOpenRecordView, controls, className = "" }) => {
	const { id, developer, city, title, goToChat, goToChatCall, userRole } = useContext(BuildingContext);
	const isDesktop = useSelector(getIsDesktop);

	const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
	const actionsRef = useRef(null);

	return (
		<Sidebar className={`!top-[68px] ${className}`}>
			{Boolean(controls && isDesktop && userRole === ROLE_ADMIN.name) && (
				<>
					<div className='white-block-small !py-2 mb-3' ref={!(userRole === ROLE_ADMIN.name) ? actionsRef : null}>
						<div className='grid grid-cols-2 gap-3'>
							<Link to={`${PrivateRoutesPath.objects.edit}${id}`} className='w-full h-full block'>
								<BtnActionBg title='Редактировать'>
									<IconEdit className='!stroke-[currentColor] !stroke-[1.5px] !fill-none' width={18} height={18} />
								</BtnActionBg>
							</Link>
							<BtnActionBg title='Удалить' onClick={() => setConfirmDeleteModal(id)}>
								<IconTrash className='fill-red' width={16} height={16} />
							</BtnActionBg>
						</div>
					</div>
				</>
			)}
			<div className='flex flex-col text-center items-center white-block-small'>
				<Avatar size={95} src={developer.avatar_url} title={developer.name} />
				<Link to={`${RoutesPath.developers.inner}${developer.id}?city=${city}`} className='font-medium mt-5 blue-link-hover text-defaultMax'>
					{developer.name}
				</Link>
				<span className='text-primary400 mt-1.5'>{developer.pos}</span>
				{(developer.underConstruction || developer.handedOver) && (
					<div className='mt-5 font-medium'>
						{developer.underConstruction && <span>{developer.underConstruction} Строиться, </span>}
						{developer.handedOver && <span>{developer.handedOver} сдано</span>}
					</div>
				)}
				{userRole === ROLE_BUYER.name && isDesktop && (
					<div className='mt-5 flex flex-col gap-2 w-full'>
						<div className='grid grid-cols-2 gap-2'>
							<Button onClick={goToChat}>Написать в чат</Button>
							<Button onClick={goToChatCall}>Позвонить</Button>
						</div>
						<Button variant='secondary' onClick={() => setIsOpenRecordView(true)}>
							<AnimatedText texts={["Записаться на просмотр", "Записаться на онлайн-показ"]} intervalTime={3000} />
						</Button>
					</div>
				)}
			</div>
			<DeleteBuildingModal
				options={{
					condition: confirmDeleteModal,
					set: setConfirmDeleteModal,
					title,
					redirectUrl: `${RoutesPath.listing}`
				}}
			/>
		</Sidebar>
	);
});

export default BuildingSidebar;
