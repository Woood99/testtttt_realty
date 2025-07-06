import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDataRequest } from '../../api/requestsApi';
import { BuyerRoutesPath } from '../../constants/RoutesPath';
import { getUserInfo } from '../../redux/helpers/selectors';
import { useSelector } from 'react-redux';
import { isBuyer, isSeller } from '../../helpers/utils';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

export const usePurchaseRequest = () => {
   const params = useParams();
   const [data, setData] = useState(null);

   const userInfo = useSelector(getUserInfo);
   const userIsSeller = isSeller(userInfo);
   const userIsBuyer = isBuyer(userInfo);
   const myPurchaseRequest = !isEmptyArrObj(userInfo) ? data?.user?.id === userInfo.id : false;
   const role_id = userInfo?.role?.id;

   const navigate = useNavigate();

   useEffect(() => {
      const fetch = async () => {
         const types = await getDataRequest('/api/object-types').then(res => res.data);

         const buildingId = types.find(item => item.name === 'Новостройки')?.id;
         if (!buildingId) return;

         await getDataRequest(`/api/type/${buildingId}`).then(res => {
            const attributesAll = res.data.attributeComplex.reduce((acc, item) => {
               return [...acc, ...item.items.filter(item => item.showInFilter)];
            }, []);

            getDataRequest(`/api/purchase-orders/${params.id}`).then(res => {
               const attributes = Object.values(
                  res.data.attributes.reduce((acc, item) => {
                     if (!acc[item.name]) {
                        acc[item.name] = { name: item.name, value: [] };
                     }
                     acc[item.name].value.push(item.value);
                     return acc;
                  }, {})
               );

               const newAttributes = attributesAll.map(item2 => {
                  const correspondingItem = attributes.find(item1 => item1.name === item2.name);

                  const filteredValues = item2['available-values'].filter(value => correspondingItem?.value.includes(value));

                  return {
                     name: item2.name,
                     value: filteredValues?.length > 0 ? filteredValues : [],
                  };
               }).filter(item=>item.value.length>0);

               const dataOrder = {
                  ...res.data,
                  attributes: newAttributes,
               };
               
               setData(dataOrder);
            });
         });
      };
      fetch();
   }, []);

   const onHandlerComplain = data => {
      console.log(data);
   };

   const onHandlerDelete = async id => {
      await getDataRequest(`/buyer-api/purchase-orders/${id}/delete`);
      navigate(BuyerRoutesPath.purchase.list);
   };

   return { data, onHandlerComplain, onHandlerDelete, userIsSeller, userIsBuyer, myPurchaseRequest, role_id };
};
