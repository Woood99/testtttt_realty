import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPresent, deletePresent, initPresents, setMainPresents } from '../../../redux/slices/apartmentSlice';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';

export const useApartmentPresents = ({ secondGift, mainGift, data }) => {
   const dispatch = useDispatch();
   const selector = useSelector(state => state.apartment);

   useEffect(() => {
      dispatch(
         initPresents({
            type: data.count ? 'count' : 'sum',
            maxAmount: (data.count ? data.sum : data.max_sum) || 0,
            leftPrice: (data.count ? data.sum : data.max_sum) || 0,
            maxCount: data.count || 0,
         })
      );
      if (mainGift && !isEmptyArrObj(mainGift)) {
         dispatch(
            setMainPresents(
               mainGift.map(item => {
                  return {
                     id: item.id,
                     title: item.title,
                     oldPrice: item.oldPrice,
                     newPrice: item.newPrice,
                  };
               })
            )
         );
      }
   }, []);

   const onChangeHandler = (value, id) => {
      if (value) {
         const currentItem = secondGift.find(item => item.id === id);
         dispatch(
            addPresent({
               id: currentItem.id,
               title: currentItem.title,
               oldPrice: currentItem.oldPrice,
               newPrice: currentItem.newPrice,
            })
         );
      } else {
         dispatch(deletePresent(id));
      }
   };

   return { onChangeHandler, selector };
};
