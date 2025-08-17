import React, { useContext } from "react";

import { ApartmentContext } from "../../../context";
import numberReplace from "../../../helpers/numberReplace";
import AnimatedNumber from "../../../ui/AnimatedNumber";
import AnimatedText from "../../../ui/AnimatedText";
import { Chars } from "../../../ui/Chars";
import { ElementOldPrice } from "../../../ui/Elements";
import Button from "../../../uiForm/Button";

const ApartmentPresentsSidebar = ({ selector }) => {
	const { goToChat, setIsOpenRecordView } = useContext(ApartmentContext);

	if (!(selector.selectedPresents.length > 0 || selector.defaultPresents.length > 0)) return;

	return (
		<div className='mt-11 sticky top-0 right-0'>
			<div className='flex flex-col gap-4 scrollbarPrimary overflow-y-auto max-h-[125px] pr-4'>
				{[...selector.defaultPresents, ...selector.selectedPresents].map((item, index) => {
					return (
						<div className='flex gap-4 flex-nowrap' key={index}>
							<span className='font-medium overflow-hidden w-full text-ellipsis whitespace-nowrap'>{item.title}</span>
							<div className='whitespace-nowrap'>
								<ElementOldPrice>{numberReplace(item.oldPrice || 0)} ₽</ElementOldPrice>
							</div>
							<span className='font-medium whitespace-nowrap'>{numberReplace(item.newPrice || 0)} ₽</span>
						</div>
					);
				})}
			</div>
			<div className='bg-pageColor py-1 rounded-lg mt-4'>
				<div className='my-2 px-3 flex flex-col gap-2 w-full'>
					{(selector.selectedPresents.length > 0 || selector.defaultPresents.length > 0) && (
						<Chars justifyBetween={true}>
							<span className='!text-dark !font-medium'>Подарки на сумму</span>
							<span className='!text-dark !font-medium'>
								<AnimatedNumber
									to={
										Number(selector.info.maxAmount) -
										Number(selector.info.leftPrice) +
										Number(selector.defaultPresents.reduce((acc, item) => acc + (item.oldPrice - (item.newPrice || 0)), 0))
									}
								/>
								&nbsp;₽
							</span>
						</Chars>
					)}
				</div>
			</div>
			<div className='mt-5 flex flex-col gap-2 w-full'>
				<Button size='Small' onClick={goToChat}>
					Написать в чат
				</Button>
				<Button size='Small' variant='secondary' onClick={() => setIsOpenRecordView(true)}>
					<AnimatedText texts={["Записаться на просмотр", "Записаться на онлайн-показ"]} intervalTime={3000} />
				</Button>
			</div>
		</div>
	);
};

export default ApartmentPresentsSidebar;
