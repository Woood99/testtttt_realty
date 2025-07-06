import { useSelector } from 'react-redux';
import CardBasicRowSkeleton from '../../components/CardBasicRowSkeleton';
import EmptyBlock from '../../components/EmptyBlock';
import PaginationPage from '../../components/Pagination';
import RepeatContent from '../../components/RepeatContent';
import { ROLE_SELLER } from '../../constants/roles';
import { RoutesPath, SellerRoutesPath } from '../../constants/RoutesPath';
import { PurchaseListContext } from '../../context';
import SellerLayout from '../../layouts/SellerLayout';
import PurchaseList from '../../pages/PurchaseList';
import PurchaseListForm from '../../pages/PurchaseList/PurchaseListForm';
import { usePurchaseList } from '../../pages/PurchaseList/usePurchaseList';
import { CardRowPurchaseBasic } from '../../ui/CardsRow';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { getCitiesValuesSelector } from '../../redux/helpers/selectors';
import { useEffect } from 'react';
import { sendPostRequest } from '../../api/requestsApi';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

const SellerPurchaseList = ({ pageTitle, namePage }) => {
   const cities = useSelector(getCitiesValuesSelector);

   const {
      data,
      filterCount,
      isOpenMoreFilter,
      setIsOpenMoreFilter,
      currentCity,
      control,
      reset,
      types,
      setDevelopers,
      developers,
      complexes,
      setComplexes,
      setValue,
      watchedValues,
      initFieldsForm,
      setInitFieldsForm,
      userIsSeller,
      isLoading,
      currentPage,
      setCurrentPage,
      userInfo,
   } = usePurchaseList(ROLE_SELLER.id, namePage);

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;
      sendPostRequest('/api/developers/complexes', { developer_ids: [userInfo.organization.id] }).then(res => {
         const data = res.data.filter(item => userInfo.associated_objects.includes(item.value));
         setComplexes(data);
      });
   }, [userInfo]);

   return (
      <SellerLayout pageTitle={pageTitle} classNameContent="!p-0 bg-transparent-imp !shadow-none min-w-0">
         <PurchaseListContext.Provider
            value={{
               filterCount,
               isOpenMoreFilter,
               setIsOpenMoreFilter,
               currentCity,
               cities,
               control,
               reset,
               types,
               setDevelopers,
               developers,
               complexes,
               setComplexes,
               setValue,
               watchedValues,
               initFieldsForm,
               setInitFieldsForm,
               variant: 'seller',
               sellerData: {},
            }}>
            <div className="white-block-small">
               <h2 className="title-2 mb-4">{pageTitle}</h2>
               <PurchaseListForm />
            </div>
            <div className="mt-3">
               <div className="flex flex-col white-block !px-0 !py-5 md1:!py-3">
                  {isLoading ? (
                     <RepeatContent count={8}>
                        <CardBasicRowSkeleton className="grid-cols-[700px_160px] h-[135px] !shadow-none mmd1:justify-between  md1:flex md1:flex-col md1:gap-3 md1:items-start">
                           <WebSkeleton className="h-10 md1:w-3/4 rounded-lg" />
                           <WebSkeleton className="h-10 md1:w-3/4 rounded-lg" />
                        </CardBasicRowSkeleton>
                     </RepeatContent>
                  ) : (
                     <>
                        {data.items?.length ? (
                           <>
                              {data.items.map((item, index) => (
                                 <CardRowPurchaseBasic
                                    classNameContent="mmd1:grid mmd1:grid-cols-[650px_max-content]"
                                    className="py-5 px-8"
                                    data={{ ...item, current_type: types.find(type => type.value === item.type) }}
                                    key={index}
                                    href={`${userIsSeller ? `${SellerRoutesPath.purchase.inner}` : `${RoutesPath.purchase.inner}`}${item.id}`}
                                 />
                              ))}
                           </>
                        ) : (
                           <EmptyBlock block={false} />
                        )}
                     </>
                  )}
               </div>
               <PaginationPage className="mt-8" currentPage={currentPage} setCurrentPage={value => setCurrentPage(value)} total={data.pages} />
            </div>
         </PurchaseListContext.Provider>
      </SellerLayout>
   );
};

export default SellerPurchaseList;
