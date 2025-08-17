import { Maybe } from "..";
import cn from "classnames";

import { getSrcImage } from "@/helpers";

const CardInfo = ({ image = "", title = "", descr = "", isActive, isError, onClick, sizeImage = 60 }) => {
	return (
		<article
			className={cn(
				"flex gap-4 relative cursor-pointer p-1.5 rounded-xl border border-solid border-primary700 transition-all",
				isActive && "!border-blue",
				isError && "!border-red"
			)}
			onClick={onClick}>
			<img
				src={getSrcImage(image)}
				className='rounded-xl'
				width={sizeImage}
				height={sizeImage}
				style={{ width: sizeImage, height: sizeImage }}
				alt=''
			/>
			<Maybe condition={title || descr}>
				<div className='flex flex-col gap-1 mt-1'>
					<Maybe condition={title}>
						<p className='cut cut-1 font-medium'>{title}</p>
					</Maybe>
					<Maybe condition={descr}>
						<p className='cut cut-1 text-primary400'>{descr}</p>
					</Maybe>
				</div>
			</Maybe>
		</article>
	);
};

export default CardInfo;
