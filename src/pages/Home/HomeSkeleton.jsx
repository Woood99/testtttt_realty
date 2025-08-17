import { useSelector } from "react-redux";

import { getIsDesktop } from "@/redux";

import { WebSkeleton } from "@/ui";

import CardBasicSkeleton from "../../components/CardBasicSkeleton";
import { CardPrimarySkeleton } from "../../ui/CardPrimary/CardPrimarySkeleton";

const HomeSkeleton = () => {
	const isDesktop = useSelector(getIsDesktop);

	return (
		<div className='container-desktop mt-3'>
			<div className='white-block mb-3'>
				<WebSkeleton className='w-4/6 h-10 rounded-xl mb-6' />
				<div className='grid grid-cols-3 gap-6 md1:grid-cols-2 md3:grid-cols-1'>
					<CardPrimarySkeleton variant='default' />
					<CardPrimarySkeleton variant='default' />
					<CardPrimarySkeleton variant='default' />
				</div>
			</div>
			{isDesktop && (
				<div className='white-block mb-3'>
					<WebSkeleton className='w-4/6 h-10 rounded-xl mb-6' />
					<div className='grid grid-cols-2 gap-2'>
						<div>
							<WebSkeleton className='w-full h-[362px] rounded-xl mb-2' />
							<div className='flex gap-2 justify-end'>
								<WebSkeleton className='w-[240px] h-[158px] rounded-xl' />
								<WebSkeleton className='w-[290px] h-[190px] rounded-xl' />
							</div>
						</div>
						<div>
							<div className='flex gap-2 items-end'>
								<WebSkeleton className='w-[290px] h-[190px] rounded-xl' />
								<WebSkeleton className='w-[240px] h-[158px] rounded-xl' />
							</div>
							<div className='grid grid-cols-3 gap-2 mt-2'>
								<WebSkeleton className='w-full h-[310px] rounded-xl' />
								<WebSkeleton className='w-full h-[310px] rounded-xl' />
								<WebSkeleton className='w-full h-[310px] rounded-xl' />
							</div>
						</div>
					</div>
				</div>
			)}
			<div className='white-block mb-3'>
				<WebSkeleton className='w-4/6 h-10 rounded-xl mb-6' />
				<div className='grid grid-cols-3 gap-6 md1:grid-cols-2 md3:grid-cols-1'>
					<CardBasicSkeleton bg={false} />
					<CardBasicSkeleton bg={false} />
					<CardBasicSkeleton bg={false} />
				</div>
			</div>
			<div className='white-block'>
				<WebSkeleton className='w-4/6 h-10 rounded-xl mb-6' />
				<div className='grid grid-cols-3 gap-6 md1:grid-cols-2 md3:grid-cols-1'>
					<CardPrimarySkeleton variant='default' />
					<CardPrimarySkeleton variant='default' />
					<CardPrimarySkeleton variant='default' />
				</div>
			</div>
		</div>
	);
};

export default HomeSkeleton;
