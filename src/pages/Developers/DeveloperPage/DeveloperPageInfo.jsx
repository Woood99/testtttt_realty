import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import Avatar from '../../../ui/Avatar';
import { DeveloperPageContext } from '../../../context';
import { CharsColItems } from '../../../ui/Chars';
import { getIsDesktop } from '@/redux';
import DeveloperPageCities from './DeveloperPageCities';
import { TabsNav, TabsTitle } from '../../../ui/Tabs';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import { BtnActionBg } from '../../../ui/ActionBtns';
import { IconEdit, IconTrash } from '../../../ui/Icons';
import { ExternalLink } from '../../../ui/ExternalLink';
import DeveloperPageChat from './DeveloperPageChat';
import { declensionWordsHouse } from '../../../helpers/declensionWords';
import DeveloperPageSlider from './DeveloperPageSlider';

const DeveloperPageInfo = () => {
   const isDesktop = useSelector(getIsDesktop);
   const { data, tabActiveValue, setTabActiveValue, userIsAdmin, setConfirmDeleteModal } = useContext(DeveloperPageContext);

   const charsData = [
      {
         name: 'Год основания',
         value: `${data.year ? `${data.year} г.` : ''}`,
         className: 'items-center',
      },
      {
         name: 'Строиться',
         value: data.building_houses ? `${declensionWordsHouse(data.building_houses)}` : 'Нет строящихся домов',
         className: 'items-center',
      },
      {
         name: 'Сдано',
         value: data.ready_houses ? `${declensionWordsHouse(data.ready_houses)}` : 'Нет строящихся домов',
         className: 'items-center',
      },
   ];

   return (
      <section className="rounded-[20px] relative">
         <div className="w-full relative">
            <DeveloperPageSlider />
            {userIsAdmin && (
               <div className="flex gap-2 absolute top-4 right-4 z-30">
                  <ExternalLink to={`${PrivateRoutesPath.developers.edit}${data.id}`} className="w-10 min-w-10">
                     <BtnActionBg title="Редактировать">
                        <IconEdit className="!stroke-[currentColor] !fill-none" width={18} height={18} />
                     </BtnActionBg>
                  </ExternalLink>
                  <BtnActionBg className="w-10 min-w-10" title="Удалить" onClick={() => setConfirmDeleteModal(data.id)}>
                     <IconTrash className="stroke-red" width={16} height={16} />
                  </BtnActionBg>
               </div>
            )}
         </div>
         <div className="rounded-[20px] bg-white relative shadow-primary">
            <div className="flex gap-4 flex-col p-5 !px-8 md1:!px-4">
               <div className="gap-4 mmd1:items-end flex mmd1:justify-between md1:flex-col">
                  <Avatar size={105} src={data.photoUrl} title={data.name} />
                  {!isDesktop && <h3 className="title-2-5 mb-2">{data.name}</h3>}
               </div>
               <div className="flex-grow flex justify-between md1:flex-col md1:justify-start">
                  <div className="w-full">
                     {isDesktop && (
                        <div className="flex justify-between gap-4 w-full mb-4">
                           <h3 className="title-2">Застройщик {data.name}</h3>
                           <DeveloperPageChat />
                        </div>
                     )}
                     <CharsColItems data={charsData} className="md4:flex-col !gap-y-5" classNameValue="text-defaultMax" />
                     <DeveloperPageCities />
                  </div>
               </div>
            </div>

            <div className="px-6 mmd1:pt-3">
               <TabsNav>
                  {data.tabsData.map((item, index) => {
                     return (
                        <TabsTitle
                           border
                           onChange={() => {
                              setTabActiveValue(index);
                           }}
                           value={tabActiveValue === index}
                           key={index}
                           count={item.data.length}>
                           {item.name}
                        </TabsTitle>
                     );
                  })}
               </TabsNav>
            </div>
         </div>
      </section>
   );
};

export default DeveloperPageInfo;
