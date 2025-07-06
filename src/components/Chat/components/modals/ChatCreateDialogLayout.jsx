import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebounceEffect } from 'ahooks';
import cn from 'classnames';

import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import Avatar from '../../../../ui/Avatar';
import EmptyBlock from '../../../EmptyBlock';
import { sendPostRequest } from '../../../../api/requestsApi';
import { getCurrentCitySelector } from '../../../../redux/helpers/selectors';
import Modal from '../../../../ui/Modal';
import { capitalizeWords } from '../../../../helpers/changeString';
import Input from '../../../../uiForm/Input';
import RepeatContent from '../../../RepeatContent';
import Button from '../../../../uiForm/Button';
import { IconArrowY, IconLocation } from '../../../../ui/Icons';
import CityModal from '../../../../ModalsMain/CityModal';
import { useInfiniteScroll } from '../../../../hooks/useInfiniteScroll';
import Spinner from '../../../../ui/Spinner';
import { getSpecialistsOrganization } from '../../../../api/Building/getSpecialists';
import { useSearchParams } from 'react-router-dom';
import { ChatContext } from '../../../../context';
import { ROLE_ADMIN, ROLE_SELLER } from '../../../../constants/roles';

const ChatCreateDialogLayoutContext = createContext();

const ChatCreateDialogLayout = ({ options, condition, set }) => {
   const { setCurrentDialog, getDialog, connectToChat } = useContext(ChatContext);
   const currentCity = useSelector(getCurrentCitySelector);

   const [isLoading, setIsLoading] = useState(true);
   const [popupCityOpen, setPopupCityOpen] = useState(false);
   const modalContentRef = useRef(null);

   const [filterFields, setFilterFields] = useState({
      city: {},
      search: '',
      page: 1,
      limit: 40,
   });

   const [data, setData] = useState({
      items: [],
      total: 0,
      pages: 1,
   });

   useEffect(() => {
      if (!currentCity) return;
      setFilterFields(prev => ({ ...prev, city: { value: currentCity.id, label: currentCity.name } }));
   }, [currentCity]);

   useDebounceEffect(
      () => {
         setIsLoading(true);
         fetchData(1).then(() => {
            setIsLoading(false);
         });
      },
      [filterFields.city?.value, filterFields.search],
      { wait: 300 }
   );

   const fetchData = async (page, increase = false) => {
      try {
         await sendPostRequest(options.api, { ...filterFields, city: filterFields.city.value, page }).then(res => {
            setData(prev => ({
               total: res.data.total,
               pages: res.data.pages,
               items: increase ? [...prev.items, ...res.data.items] : res.data.items,
            }));
         });
      } catch (error) {}
   };

   const { isLoadingMore } = useInfiniteScroll({
      fetchCallback: page => fetchData(page, true),
      scrollableRef: modalContentRef,
      totalPages: data.pages,
      page: filterFields.page,
      setPage: page => setFilterFields(prev => ({ ...prev, page })),
   });

   return (
      <ChatCreateDialogLayoutContext.Provider value={{ onCloseModal: () => set(false), setCurrentDialog, getDialog, connectToChat, options }}>
         <Modal
            options={{ overlayClassNames: '_left', modalClassNames: 'mmd1:!w-[475px]', modalContentClassNames: 'md1:flex md1:flex-col !px-0' }}
            condition={condition}
            set={set}
            modalContentRef={modalContentRef}>
            <div className="flex gap-2 px-6">
               <Button
                  variant="secondary"
                  size="Small"
                  className="flex items-center gap-2"
                  onClick={() => {
                     setPopupCityOpen(true);
                  }}>
                  <IconLocation width={16} height={16} className="fill-dark" />
                  <span>{filterFields.city.label || ''}</span>
               </Button>
               <div className="flex-grow">
                  <Input
                     search
                     placeholder={options.inputPlaceholder}
                     value={filterFields.search}
                     onChange={value => {
                        setFilterFields(prev => ({ ...prev, search: value, page: 1 }));
                     }}
                  />
               </div>
            </div>
            <div className="mt-4">
               {!Boolean(!isLoading && data.items.length === 0) ? (
                  <div className="flex flex-col">
                     {isLoading ? (
                        <RepeatContent count={filterFields.limit}>
                           <div className="py-2 px-6">
                              <div className="flex items-center gap-3 w-full">
                                 <WebSkeleton className="w-[40px] h-[40px] rounded-full" />
                                 <WebSkeleton className="w-2/6 h-6 rounded-lg" />
                              </div>
                           </div>
                        </RepeatContent>
                     ) : (
                        <>{options.type === 'developers' ? <DevelopersLayout data={data.items} /> : <SpecialistsLayout data={data.items} />}</>
                     )}
                     {isLoadingMore && (
                        <div className="flex items-center my-5">
                           <Spinner className="mx-auto" />
                        </div>
                     )}
                  </div>
               ) : (
                  <EmptyBlock block={false} />
               )}
            </div>

            <CityModal
               onSubmit={city => {
                  setFilterFields(prev => ({ ...prev, city: { value: city.id, label: city.name }, page: 1 }));
                  setPopupCityOpen(false);
               }}
               currentCity={currentCity}
               condition={popupCityOpen}
               set={setPopupCityOpen}
            />
         </Modal>
      </ChatCreateDialogLayoutContext.Provider>
   );
};

const DevelopersLayout = ({ data, className }) => {
   if (!data.length) return;
   const [dropdownId, setDropdownId] = useState(null);
   const [specialists, setSpecialists] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   return (
      <div className={cn(className)}>
         {data.map(item => {
            return (
               <div>
                  <CardDeveloper
                     data={item}
                     key={item.id}
                     onDropdownClick={async () => {
                        if (dropdownId === item.id) {
                           setDropdownId(false);
                           setSpecialists([]);
                        } else {
                           setIsLoading(true);
                           setDropdownId(item.id);
                           const data = await getSpecialistsOrganization(item.id);
                           setSpecialists(data);
                           setIsLoading(false);
                        }
                     }}
                  />
                  {dropdownId === item.id && (
                     <SpecialistsLayout data={specialists} loading={isLoading} className="ml-4 mb-3 pb-3 border-bottom-lightgray" />
                  )}
               </div>
            );
         })}
      </div>
   );
};

const SpecialistsLayout = ({ data, className, loading }) => {
   const [dropdownId, setDropdownId] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [channels, setChannels] = useState([]);

   if (loading) {
      return (
         <div className={cn(className, 'mt-4 flex justify-center')}>
            <Spinner style={{ '--size': '34px' }} />
         </div>
      );
   }
   if (!data.length && !loading) {
      return <div className={cn(className, 'flex justify-center mt-4 text-primary400')}>Нет менеджеров</div>;
   }

   return (
      <div className={cn(className)}>
         <h4 className="title-4 px-6 mt-3 mb-3">Менеджеры застройщика:</h4>
         {data.map(item => {
            return (
               <div>
                  <CardSpecialist
                     data={item}
                     key={item.id}
                     onDropdownClick={async () => {
                        if (dropdownId === item.id) {
                           setDropdownId(false);
                           setChannels([]);
                        } else {
                           setIsLoading(true);
                           setDropdownId(item.id);
                           const {
                              data: { result },
                           } = await sendPostRequest('/api/channels', { user_id: item.id });
                           setChannels(result);
                           setIsLoading(false);
                        }
                     }}
                  />
                  {dropdownId === item.id && (
                     <ChannelsLayout loading={isLoading} data={channels} className="ml-4 mb-3 pb-3 border-bottom-lightgray" />
                  )}
               </div>
            );
         })}
      </div>
   );
};

const CardDeveloper = ({ data, onDropdownClick }) => {
   const { options } = useContext(ChatCreateDialogLayoutContext);

   return (
      <div
         onClick={() => {
            options.onSubmitDeveloper(data);
         }}
         className="relative py-2 px-6 flex gap-3 items-center hover:bg-pageColor cursor-pointer">
         <Avatar size={40} src={data.photo || data.image} title={data.name} />
         <h3 className="title-4 text-left">{data.name}</h3>
         <button
            type="button"
            className="ml-auto flex-center-all h-10 w-10"
            onClick={async e => {
               e.stopPropagation();
               onDropdownClick?.();
            }}>
            <IconArrowY className="fill-dark" width={24} height={24} />
         </button>
      </div>
   );
};

const CardSpecialist = ({ data, onDropdownClick }) => {
   const { options } = useContext(ChatCreateDialogLayoutContext);

   return (
      <div
         onClick={() => {
            options.onSubmitSpecialist(data);
         }}
         className="relative py-2 px-6 flex gap-3 items-center hover:bg-pageColor cursor-pointer">
         <Avatar size={40} src={data.photo || data.image} title={data.name} />
         <h3 className="title-4 text-left">{capitalizeWords(data.name, data.surname)}</h3>
         <button
            type="button"
            className="ml-auto flex-center-all h-10 w-10"
            onClick={async e => {
               e.stopPropagation();
               onDropdownClick?.();
            }}>
            <IconArrowY className="fill-dark" width={24} height={24} />
         </button>
      </div>
   );
};

const ChannelsLayout = ({ data, className, loading }) => {
   if (loading) {
      return (
         <div className={cn(className, 'mt-4 flex justify-center')}>
            <Spinner style={{ '--size': '34px' }} />
         </div>
      );
   }
   if (!data.length && !loading) {
      return <div className={cn(className, 'flex justify-center mt-4 text-primary400')}>Нет каналов</div>;
   }

   return (
      <div className={cn(className)}>
         <h4 className="title-4 px-6 mt-3 mb-3">Каналы менеджера:</h4>
         {data.map(item => {
            return (
               <div>
                  <CardChannel data={item} key={item.id} />
               </div>
            );
         })}
      </div>
   );
};

const CardChannel = ({ data }) => {
   const { setCurrentDialog, getDialog, connectToChat, onCloseModal } = useContext(ChatCreateDialogLayoutContext);
   const [_, setSearchParams] = useSearchParams();

   return (
      <div
         onClick={async () => {
            onCloseModal();
            if (data.is_member) {
               setSearchParams({ dialog: data.id });
               return;
            }
            const { data: res } = await sendPostRequest(`/api/dialogs/${data.id}`, { limit: 1, page: 1 });
            const owner = res.owners?.find(owner => owner.role === ROLE_SELLER.id) || res.owners?.find(owner => owner.role === ROLE_ADMIN.id);

            setCurrentDialog({ ...res, is_fake: true, is_member: data.is_member, id: data.id, owner });
            await getDialog(data.id);
            connectToChat(data.id);
         }}
         className="relative py-2 px-6 flex gap-3 items-center hover:bg-pageColor cursor-pointer">
         <Avatar size={40} src={data.photo} title={data.name} />
         <h3 className="title-4 text-left">{data.name}</h3>
      </div>
   );
};

export default ChatCreateDialogLayout;
