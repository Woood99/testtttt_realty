import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { BuyerRoutesPath } from '../../../constants/RoutesPath';
import { setSelectAccLogModalOpen } from '../../../redux/slices/helpSlice';
import { checkAuthUser, getIsDesktop } from '../../../redux/helpers/selectors';
import { HOME_NAV } from './nav';

export const NavBlock = () => {
   const dispatch = useDispatch();
   const authUser = useSelector(checkAuthUser);
   const isDesktop = useSelector(getIsDesktop);

   return (
      <section>
         <div className="container-desktop">
            <div className="white-block-small flex gap-2 w-full md1:grid md1:grid-cols-2 md1:gap-2">
               {HOME_NAV.map((item, index) => {
                  return (
                     <button
                        onClick={() => {
                           if (item.authRequired && !authUser) {
                              dispatch(setSelectAccLogModalOpen(true));
                           } else {
                              window.open(item.link, '_blank');
                           }
                        }}
                        key={index}
                        style={{ width: `${isDesktop ? item.width || 150 : 115}px`, minWidth: `${isDesktop ? item.width || 150 : 115}px` }}
                        className={cn(
                           'h-[90px] border border-solid border-primary800 bg-white rounded-xl relative hover:bg-primary100 hover:-translate-y-1.5 transition-all flex-grow flex-shrink basis-0 md1:flex items-center md1:!w-full md1:h-[60px] md1:px-4 md1:gap-2',
                           item.mobileFull && 'col-span-2 justify-center'
                        )}>
                        <div className="mmd1:absolute bottom-0 right-0">
                           <img src={item.image} width={isDesktop ? 44 : 24} height={isDesktop ? 44 : 24} />
                        </div>
                        <span className="text-left block mmd1:absolute top-3 left-3 z-20 font-medium">{item.name}</span>
                     </button>
                  );
               })}
            </div>
         </div>
      </section>
   );
};
