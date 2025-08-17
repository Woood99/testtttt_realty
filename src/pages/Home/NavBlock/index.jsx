import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";

import { checkAuthUser, getIsDesktop } from "@/redux";

import { Maybe } from "@/ui";

import { openUrl } from "../../../helpers/openUrl";
import { setSelectAccLogModalOpen } from "../../../redux/slices/helpSlice";

import { HOME_NAV, HOME_NAV_MOBILE } from "./nav";

export const NavBlock = () => {
	const dispatch = useDispatch();
	const authUser = useSelector(checkAuthUser);
	const isDesktop = useSelector(getIsDesktop);

	return (
		<section className=''>
			<div className='flex gap-2 w-full md1:grid md1:grid-cols-2 md1:gap-2'>
				{(isDesktop ? HOME_NAV : HOME_NAV_MOBILE).map((item, index) => {
					return (
						<button
							onClick={() => {
								if (item.authRequired && !authUser) {
									dispatch(setSelectAccLogModalOpen(true));
								} else {
									openUrl(item.link);
								}
							}}
							key={index}
							style={{ width: `${isDesktop ? item.width || 150 : 115}px`, minWidth: `${isDesktop ? item.width || 150 : 115}px` }}
							className={cn(
								"h-[90px] border border-solid border-primary800 bg-primary100 rounded-xl relative  hover:-translate-y-1.5 transition-all flex-grow flex-shrink basis-0 md1:flex items-center md1:!w-full md1:h-[60px] md1:px-4 md1:gap-2",
								item.mobileFull && "col-span-2 justify-center"
							)}>
							<div className='mmd1:absolute bottom-0 right-0'>
								<Maybe condition={item.image}>
									<img src={item.image} width={isDesktop ? 44 : 24} height={isDesktop ? 44 : 24} />
								</Maybe>
							</div>
							<span className='text-left block mmd1:absolute top-3 left-3 z-20 font-medium'>{item.name}</span>
						</button>
					);
				})}
			</div>
		</section>
	);
};
