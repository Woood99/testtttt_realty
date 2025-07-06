import { useContext, useEffect } from 'react';
import cn from 'classnames';
import { SuggestionsContext } from '../../context';
import { TabsNav, TabsTitle } from '../../ui/Tabs';
import { suggestionsDateRange, suggestionsStatuses } from './suggestions-types';
import { Tooltip } from '../../ui/Tooltip';
import { IconCalendar, IconSettings, IconSort } from '../../ui/Icons';
import Button from '../../uiForm/Button';
import { suggestionsCreateDateRange } from './suggestions-create-date-range';

const SuggestionsObjectsNav = ({ className }) => {
   const { suggestions_type, setFilterFields, filterFields } = useContext(SuggestionsContext);

   return (
      <div className={cn('white-block mb-3', className)}>
         <h2 className="title-2 mb-5">{suggestions_type.title}</h2>
         <div className="flex items-center mt-5 gap-4">
            <TabsNav type="second">
               {suggestionsStatuses.map(item => {
                  return (
                     <TabsTitle
                        type="second"
                        onChange={() => {
                           setFilterFields(prev => ({
                              ...prev,
                              status: item.value,
                              page: 1,
                           }));
                        }}
                        value={filterFields.status === item.value}
                        key={item.value}>
                        {item.label}
                     </TabsTitle>
                  );
               })}
            </TabsNav>

            <div className="ml-auto flex gap-3">
               <Tooltip
                  mobile
                  color="white"
                  event="click"
                  offset={[10, 5]}
                  placement="bottom-end"
                  ElementTarget={() => (
                     <button className="flex-center-all">
                        <IconSort />
                     </button>
                  )}
                  classNameContent="!pr-12"
                  classNameRoot="-mr-[60px]"
                  close>
                  <div className="flex gap-2 overflow-x-auto scrollbarWidthNone">
                     <Button
                        size="34"
                        variant="secondary"
                        onClick={() =>
                           setFilterFields(prev => ({
                              ...prev,
                              order_by_created_at: 0,
                              order_by_view_time: null,
                              page: 1,
                           }))
                        }
                        active={filterFields.order_by_created_at === 0}>
                        По дате создания
                     </Button>
                     <Button
                        size="34"
                        variant="secondary"
                        onClick={() => {
                           setFilterFields(prev => ({
                              ...prev,
                              order_by_created_at: null,
                              order_by_view_time: 0,
                              page: 1,
                           }));
                        }}
                        active={filterFields.order_by_view_time === 0}>
                        По дате просмотра
                     </Button>
                  </div>
               </Tooltip>

               {Boolean(suggestions_type.author_is_user) && (
                  <Tooltip
                     mobile
                     color="white"
                     event="click"
                     offset={[10, 5]}
                     placement="bottom-end"
                     ElementTarget={() => (
                        <button className="flex-center-all">
                           <IconSettings />
                        </button>
                     )}
                     classNameContent="!pr-12"
                     classNameRoot="-mr-[60px]"
                     close>
                     <div className="flex gap-2 overflow-x-auto scrollbarWidthNone">
                        {suggestions_type.author_is_user.map((item, index) => {
                           return (
                              <Button
                                 key={index}
                                 size="34"
                                 variant="secondary"
                                 onClick={() =>
                                    setFilterFields(prev => ({
                                       ...prev,
                                       author_is_user: item.value,
                                       page: 1,
                                    }))
                                 }
                                 active={filterFields.author_is_user === item.value}>
                                 {item.label}
                              </Button>
                           );
                        })}
                     </div>
                  </Tooltip>
               )}

               <Tooltip
                  mobile
                  color="white"
                  event="click"
                  offset={[10, 5]}
                  placement="bottom-end"
                  ElementTarget={() => (
                     <button className="flex-center-all">
                        <IconCalendar />
                     </button>
                  )}
                  classNameContent="!pr-12"
                  classNameRoot="-mr-[60px]"
                  close>
                  <div className="flex gap-2 overflow-x-auto scrollbarWidthNone">
                     {suggestionsDateRange.map(item => {
                        return (
                           <Button
                              key={item.value}
                              size="34"
                              variant="secondary"
                              onClick={() =>
                                 setFilterFields(prev => ({
                                    ...prev,
                                    dateRange: item.value,
                                    ...suggestionsCreateDateRange(item.days),
                                    page: 1,
                                 }))
                              }
                              active={filterFields.dateRange === item.value}>
                              {item.label}
                           </Button>
                        );
                     })}

                     {/* <button className="blue-link self-center">Выбор даты</button> */}
                     {/* <button className="blue-link self-center">от 02.01.2024 до 28.01.2024</button> */}
                  </div>
               </Tooltip>
            </div>
         </div>
      </div>
   );
};

export default SuggestionsObjectsNav;
