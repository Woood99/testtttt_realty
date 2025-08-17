import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import MainLayout from '../../layouts/MainLayout';
import HeaderAdmin from '../../components/Header/HeaderAdmin';
import Header from '../../components/Header';
import { ListingFlatsContext } from '../../context';
import Select from '../../uiForm/Select';
import { setSort, tagsToggle } from '../../redux/slices/listingFlatsSlice';
import { TagsMoreWidthDynamic } from '../../ui/TagsMore';
import ListingFlatsForm from './ListingFlatsForm';
import ListingFlatsContent from './ListingFlatsContent';
import ComplexCardInfo from '../../ui/ComplexCardInfo';
import { declensionWordsOffer } from '../../helpers/declensionWords';
import { CardRowPurchaseBasic } from '../../ui/CardsRow';
import { RoutesPath } from '../../constants/RoutesPath';
import { getIsDesktop, getUserInfo } from '@/redux';
import { IconSort } from '../../ui/Icons';
import { useListingFlats } from './useListingFlats';
import { isAdmin } from '../../helpers/utils';
import { sortOptionsFlats } from '@/data/selectsField';

const ListingFlats = () => {
   const isDesktop = useSelector(getIsDesktop);
   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   const {
      types,
      tags,
      advantages,
      specialists,
      filterCount,
      buildingData,
      purchaseRequest,
      isLoading,
      isLoadingMore,
      params,
      cards,
      total,
      totalPages,
      listingFlatsSelector,
   } = useListingFlats();

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Каталог</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <ListingFlatsContext.Provider
            value={{
               tags,
               advantages,
               filterCount,
               isLoading,
               params,
               cards,
               total,
               totalPages,
               isLoadingMore,
               lastTrigger: listingFlatsSelector.lastTrigger,
               buildingData,
               isAdmin: userIsAdmin,
            }}>
            {userIsAdmin ? <HeaderAdmin /> : <Header>{!isDesktop && <ListingFlatsForm />}</Header>}
            <main className="main main-headerForm">
               {isDesktop && <ListingFlatsForm />}

               <div className="main-wrapper">
                  <div className="container-desktop">
                     {Boolean(params.complex) && (
                        <div className="mb-3 md1:mb-6">{buildingData && <ComplexCardInfo data={buildingData} specialists={specialists} />}</div>
                     )}
                     {Boolean(params.purchase) && (
                        <div>
                           {purchaseRequest && (
                              <div className="mb-3 md1:mb-6">
                                 <CardRowPurchaseBasic
                                    className="mmd1:!flex"
                                    bg={true}
                                    data={{
                                       ...purchaseRequest,
                                       current_type: types.find(type => type.value === purchaseRequest.building_type_id),
                                       calc_props: purchaseRequest.pricing_attributes,
                                    }}
                                    href={`${RoutesPath.purchase.inner}${purchaseRequest.id}`}
                                 />
                              </div>
                           )}
                        </div>
                     )}
                     {isDesktop ? (
                        <div className="mb-3 white-block">
                           <div className="flex justify-between items-center">
                              <div className="flex flex-col gap-2">
                                 <h1 className="title-2">{declensionWordsOffer(total || 0)}</h1>
                              </div>
                              <div className="flex items-center gap-2">
                                 <IconSort width={16} height={16} />
                                 <Select
                                    options={sortOptionsFlats}
                                    value={sortOptionsFlats.find(item => item.value === listingFlatsSelector.filters.sortBy) || sortOptionsFlats[0]}
                                    onChange={value => dispatch(setSort(value.value))}
                                    className="max-w-[300px]"
                                    nameLabel=""
                                    variant="second"
                                    iconArrow={false}
                                 />
                              </div>
                           </div>
                           {Boolean(tags.length) && (
                              <>
                                 <h3 className="title-3 mt-4 mb-3">Поиск по тегам</h3>
                                 <TagsMoreWidthDynamic
                                    className="flex gap-1.5"
                                    data={tags.map((item, index) => {
                                       const currentTag = {
                                          value: item.id,
                                          label: item.name,
                                       };
                                       return {
                                          id: index,
                                          value: listingFlatsSelector.filters.tags.find(item => item === currentTag.value),
                                          label: currentTag.label,
                                          onClick: value => {
                                             dispatch(tagsToggle({ value, option: currentTag, type: 'tags' }));
                                          },
                                       };
                                    })}
                                 />
                              </>
                           )}
                        </div>
                     ) : (
                        <h1 className="title-2 container mb-5">{declensionWordsOffer(total || 0)}</h1>
                     )}
                  </div>
                  <ListingFlatsContent />
               </div>
            </main>
         </ListingFlatsContext.Provider>
      </MainLayout>
   );
};

export default ListingFlats;
