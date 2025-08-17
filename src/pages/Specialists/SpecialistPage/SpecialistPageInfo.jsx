import React, { useContext } from 'react';
import Avatar from '../../../ui/Avatar';
import { SpecialistPageContext } from '../../../context';
import UserInfo from '../../../ui/UserInfo';
import { capitalizeWords } from '../../../helpers/changeString';
import { declensionWordsYear } from '../../../helpers/declensionWords';
import { CharsColItems } from '../../../ui/Chars';
import { RoutesPath } from '../../../constants/RoutesPath';
import { useSelector } from 'react-redux';
import { BlockDescrMore } from '../../../components/BlockDescr/BlockDescr';
import { getIsDesktop } from '@/redux';
import { TabsNav, TabsTitle } from '../../../ui/Tabs';
import Button from '../../../uiForm/Button';

const SpecialistPageInfo = () => {
   const isDesktop = useSelector(getIsDesktop);
   const { data, tabActiveValue, setTabActiveValue, tabsItems } = useContext(SpecialistPageContext);

   const charsData = [
      {
         name: 'Стаж',
         value: declensionWordsYear(data.experience),
         className: 'items-center',
      },
      {
         name: 'В работе',
         value: `${data.objectsCount} ЖК`,
         className: 'items-center',
      },
   ];

   return (
      <section className="white-block !pb-0 md1:!rounded-t-none">
         <div className={`flex gap-8 md1:flex-col flex-grow md1:gap-6 md1:mb-6`}>
            <div className="gap-4 items-center md1:flex">
               <Avatar size={isDesktop ? 140 : 90} src={data.photoUrl} title={data.name} />
               {!isDesktop && (
                  <div className="flex flex-col">
                     <h3 className="title-3">{capitalizeWords(data.name, data.surname)}</h3>
                     <p className="text-primary400 mt-1">Менеджер отдела продаж</p>
                  </div>
               )}
            </div>
            <div className="min-w-0">
               <div className="flex gap-4 justify-between items-start">
                  {isDesktop && <h2 className="title-2">{capitalizeWords(data.name, data.surname)}</h2>}
               </div>
               <UserInfo
                  avatar={data.developer.avatar_url}
                  name={data.developer.name}
                  pos="Застройщик"
                  className="mmd1:mt-4"
                  centered
                  nameHref={`${RoutesPath.developers.inner}${data.developer.id}`}
               />
               <CharsColItems data={charsData} className="mt-4 md4:flex-col !gap-y-5" classNameValue="text-defaultMax" />
               {Boolean(data.description) && <BlockDescrMore descr={data.description} lines={2} className="cut-2-imp mt-8" />}
            </div>
         </div>

         <div className="mmd1:pt-8 w-max">
            <TabsNav>
               {tabsItems.map(item => {
                  return (
                     <TabsTitle
                        border
                        onChange={() => {
                           setTabActiveValue(item.value);
                        }}
                        value={tabActiveValue === item.value}
                        key={item.value}>
                        {item.name}
                     </TabsTitle>
                  );
               })}
            </TabsNav>
         </div>
      </section>
   );
};

export default SpecialistPageInfo;
