import cn from "classnames";
import { useSelector } from "react-redux";

import { getIsDesktop } from "@/redux";

import { BodyAndSidebar } from "@/components";

import { WebSkeleton } from "@/ui";

const ApartmentSkeleton = () => {
	const isDesktop = useSelector(getIsDesktop);

	return (
		<main className={cn("main", !isDesktop && "!pb-[120px]")}>
			<div className='main-wrapper md1:pt-0'>
				<div className='container-desktop'>
					<BodyAndSidebar>
						<div className='flex flex-col gap-3 min-w-0'>
							<div className='bg-white shadow-primary rounded-[20px] p-[10px] h-[440px]'>
								<WebSkeleton className='w-full h-full rounded-[20px]' />
							</div>
							<div className='white-block-small'>
								<WebSkeleton className='w-full rounded-xl h-[250px]' />
							</div>
							<div className='white-block-small'>
								<WebSkeleton className='w-full rounded-xl h-[250px]' />
							</div>
							<div className='white-block-small'>
								<WebSkeleton className='w-full rounded-xl h-[250px]' />
							</div>
						</div>
						<div>
							<div className='white-block-small flex flex-col gap-3'>
								<WebSkeleton className='w-full h-[120px] rounded-xl' />
								<WebSkeleton className='w-full h-[120px] rounded-xl' />
								<WebSkeleton className='w-full h-[120px] rounded-xl' />
								<WebSkeleton className='w-full h-[120px] rounded-xl' />
							</div>
						</div>
					</BodyAndSidebar>
				</div>
			</div>
		</main>
	);
};

export default ApartmentSkeleton;
