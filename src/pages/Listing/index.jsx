import React from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import ListingForm from './ListingForm';
import Header from '../../components/Header';
import TypeList from './TypeList';
import TypeMap from './TypeMap';
import { setSort, tagsToggle } from '../../redux/slices/listingSlice';
import Select from '../../uiForm/Select';
import MainLayout from '../../layouts/MainLayout';
import ListingMap from './ListingMap';
import MapLocation from './MapLocation';
import { ModalDisplay } from '../../ui/Modal';
import HeaderAdmin from '../../components/Header/HeaderAdmin';
import { TagsMoreWidthDynamic } from '../../ui/TagsMore';
import { getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import { IconSort } from '../../ui/Icons';
import { useListing } from './useListing';
import { isAdmin } from '../../helpers/utils';
import Tag from '../../ui/Tag';
import HorizontalScrollMouse from '../../ui/HorizontalScrollMouse';
import ChatBtnFixed from '../../components/ChatBtnFixed';

const sortOptions = [
   {
      label: 'Сначала дешёвые',
      value: 'price_asc',
   },
   {
      label: 'Сначала дорогие',
      value: 'price_desc',
   },
   {
      label: 'Высокий кешбэк',
      value: 'cashback_desc',
   },
];

const Listing = () => {
   const dispatch = useDispatch();
   const listingSelector = useSelector(state => state.listing);
   const isDesktop = useSelector(getIsDesktop);

   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   const { tags, titleText, options } = useListing(userIsAdmin);

   const listingTypeList = listingSelector.type === 'list';
   const listingTypeMap = listingSelector.type === 'map';

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>{titleText}</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         {userIsAdmin ? (
            <HeaderAdmin />
         ) : (
            <Header>{!isDesktop && listingTypeMap && <ListingForm options={options} shadow isAdmin={userIsAdmin} />}</Header>
         )}
         <main className="main md1:flex md1:flex-col">
            <div>
               <ModalDisplay
                  condition={options.locationModal}
                  set={options.setLocationModal}
                  options={{ overlayClassNames: '_full', modalContentClassNames: '!p-0 !pt-10' }}>
                  <MapLocation setModal={options.setLocationModal} />
               </ModalDisplay>
            </div>

            {isDesktop && (
               <>
                  {listingTypeList ? (
                     <div className="main-wrapper">
                        <TypeList options={options}>
                           <div className="white-block mb-3">
                              <div className="flex justify-between">
                                 <h1 className="title-2">{titleText}</h1>
                                 <div className="max-w-[300px] mb-4">
                                    <div className="flex items-center gap-2">
                                       <IconSort width={16} height={16} />
                                       <Select
                                          options={sortOptions}
                                          value={sortOptions.find(item => item.value === listingSelector.sortBy) || sortOptions[0]}
                                          onChange={value => dispatch(setSort(value.value))}
                                          nameLabel=""
                                          variant="second"
                                          iconArrow={false}
                                       />
                                    </div>
                                 </div>
                              </div>
                              <ListingForm options={options} isAdmin={userIsAdmin} className="mt-6 mb-8" />

                              {Boolean(tags.length) && (
                                 <div>
                                    <h3 className="title-3 mt-4 mb-3">Часто ищут</h3>
                                    <div className="flex gap-1.5 flex-wrap">
                                       {tags.map((item,index) => {
                                          const currentTag = {
                                             value: item.id,
                                             label: item.name,
                                          };

                                          return (
                                             <Tag
                                                key={index}
                                                size="medium"
                                                className="!rounded-xl"
                                                onClick={value => {
                                                   dispatch(tagsToggle({ value, option: currentTag, type: 'tags' }));
                                                }}
                                                value={listingSelector.filtersOther.tags.find(item => item === currentTag.value)}>
                                                {currentTag.label}
                                             </Tag>
                                          );
                                       })}
                                    </div>
                                    {/* <TagsMoreWidthDynamic
                                       className="flex gap-1.5"
                                       data={tags.map((item, index) => {
                                          const currentTag = {
                                             value: item.id,
                                             label: item.name,
                                          };
                                          return {
                                             id: index,
                                             value: listingSelector.filtersOther.tags.find(item => item === currentTag.value),
                                             label: currentTag.label,
                                             onClick: value => {
                                                dispatch(tagsToggle({ value, option: currentTag, type: 'tags' }));
                                             },
                                          };
                                       })}
                                    /> */}
                                 </div>
                              )}
                           </div>
                        </TypeList>
                     </div>
                  ) : (
                     <>
                        <ListingForm options={options} isAdmin={userIsAdmin} shadow />
                        <div className="bg-pageColor py-4">
                           <TypeMap options={options} />
                        </div>
                     </>
                  )}
               </>
            )}

            {!isDesktop && (
               <>
                  {listingTypeList ? (
                     <div className="mt-5">
                        <h1 className="title-2 mb-5 !px-4">{titleText}</h1>
                        <ListingForm options={options} isAdmin={userIsAdmin} className="mt-2 mb-4 !top-[52px] sticky z-[999] !px-4" />
                        <HorizontalScrollMouse widthScreen={9999} className="mb-4 !px-4">
                           <div className="flex items-center gap-1.5">
                              {tags.map(item => {
                                 const currentTag = {
                                    value: item.id,
                                    label: item.name,
                                 };

                                 return (
                                    <Tag
                                       size="medium"
                                       className="!rounded-xl"
                                       onClick={value => dispatch(tagsToggle({ value, option: currentTag, type: 'tags' }))}
                                       value={listingSelector.filtersOther.tags.find(item => item === currentTag.value)}>
                                       {currentTag.label}
                                    </Tag>
                                 );
                              })}
                           </div>
                        </HorizontalScrollMouse>
                        <TypeMap options={options} />
                     </div>
                  ) : (
                     <div className="flex-grow flex flex-col">
                        <ListingMap />
                     </div>
                  )}
               </>
            )}
         </main>
         <ChatBtnFixed />
      </MainLayout>
   );
};

export default Listing;
