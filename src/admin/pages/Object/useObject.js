import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useGetTags } from '../../../api/other/useGetTags';
import { useGetDevelopersAll } from '../../../api/other/useGetDevelopersAll';
import { useGetSpecialistsAll } from '../../../api/other/useGetSpecialistsAll';
import { useGetFrames } from '../../../api/other/useGetFrames';
import { getBuilding } from '../../../api/getBuilding';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import { getFormData } from './getFormData';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import { getCitiesSelector } from '@/redux';

const defaultObjectData = {
   photos: [],
   apartRenov: [],
   ecologyParks: [],
   address: '',
   complex: '',
   geo: [],
   description: '',
   minPrice: '',
   cashback: '',
   cashbackSubscribe: '',
   recommendHome: false,
   cashbackHome: false,
};

export const useObject = (params, type = 'create') => {
   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = useForm();

   const [specialCondition, setSpecialCondition] = useState([]);

   const citiesItems = useSelector(getCitiesSelector);
   const addressInputWrapperRef = useRef(null);
   const addressInputRef = useRef(null);
   const watchCity = watch('city');
   const watchAddress = watch('address');
   const buttonSubmitRef = useRef(null);

   const [isLoading, setIsLoading] = useState(true);

   const [isLoadingSend, setIsLoadingSend] = useState(false);

   const [data, setData] = useState(type === 'create' ? defaultObjectData : null);

   const [dataPhotos, setDataPhotos] = useState([]);
   const [dataRenov, setDataRenov] = useState([]);
   const [dataEcologyParks, setDataEcologyParks] = useState([]);

   const [dataGeo, setDataGeo] = useState([]);

   const { tags } = useGetTags({ type: 'tags' });
   const { tags: stickers } = useGetTags({ type: 'stickers' });
   const { tags: advantages } = useGetTags({ type: 'advantages' });
   const { tags: advantagesComplexData } = useGetTags({ type: 'advantages', building_id: params?.id });
   const { developers } = useGetDevelopersAll({ city: watchCity?.value }, 'values', watchCity?.value || false);
   const { frames } = useGetFrames(params?.id);
   const { specialists } = useGetSpecialistsAll(params?.id, 'values');

   const advantagesComplex = advantagesComplexData.filter(item => item.count);

   const [typeBuild, setTypeBuild] = useState([]);

   const [constructItems, setConstructItems] = useState([]);

   const [attributes, setAttributes] = useState(null);
   const [groupsPresent, setGroupsPresent] = useState([]);

   const fetchDataBuilding = async () => {
      if (type === 'edit') {
         await getBuilding(params.id).then(res => {
            setData(res);
            setIsLoadingSend(false);
         });
      }
   };

   const fetchDataGroupsPresents = async () => {
      await getDataRequest(`/admin-api/gift_groups/building/${params.id}`)
         .then(res => {
            setGroupsPresent(res.data);
         })
         .catch(err => {});
   };

   const fetchHistory = async () => {
      setIsLoadingSend(true);
      await getDataRequest(`/api/building/${params.id}/history`).then(res => {
         setConstructItems(res.data);
         setIsLoadingSend(false);
      });
   };

   const fetchSpecialCondition = async () => {
      await getDataRequest(`/api/special-condition/building/${params.id}`).then(res => {
         setSpecialCondition(res.data);
      });
   };

   useEffect(() => {
      if (!data) return;
      if (isEmptyArrObj(data)) return;

      if (data.gallery) {
         const dataGallery = data.gallery.map((item, index) => {
            return {
               id: index + 1,
               name: item.title,
               items:
                  item.images?.map((item, index) => {
                     return {
                        id: index + 1,
                        image: item,
                     };
                  }) || [],
            };
         });
         setDataPhotos(dataGallery);
      }
      if (data.apartmentRenov) {
         const dataApartRenov = data.apartmentRenov.map((item, index) => {
            return {
               id: index + 1,
               name: item.title,
               description: item.description,
               price: item.price,
               items:
                  item.images?.map((item, index) => {
                     return {
                        id: index + 1,
                        image: item,
                     };
                  }) || [],
            };
         });
         setDataRenov(dataApartRenov);
      }
      if (data.ecologyParks) {
         const dataEcologyParks = data.ecologyParks.map((item, index) => {
            return {
               id: index + 1,
               name: item.title,
               description: item.description,
               distance: item.distance,
               items:
                  item.images?.map((item, index) => {
                     return {
                        id: index + 1,
                        image: item,
                     };
                  }) || [],
            };
         });
         setDataEcologyParks(dataEcologyParks);
      }
   }, [data?.gallery]);

   useEffect(() => {
      const fetchData = async () => {
         await fetchDataBuilding();

         await getDataRequest('/api/object-types').then(res => {
            setTypeBuild(
               res.data.map(item => {
                  return {
                     label: item.name,
                     value: item.id,
                  };
               })
            );
            const buildingId = res.data.find(item => item.name === 'Новостройки')?.id;

            getDataRequest(`/api/type/${buildingId}`).then(res => {
               setAttributes(res.data.attributeComplex);
            });
         });

         if (type === 'edit') {
            await fetchHistory();
            await fetchDataGroupsPresents();
            await fetchSpecialCondition();
         }

         setIsLoading(false);
      };

      fetchData();
   }, []);

   useEffect(() => {
      if (isLoading) return;
      setDataGeo(data.location);
   }, [isLoading]);

   useEffect(() => {
      setData({
         ...data,
         apartRenov: dataRenov,
         photos: dataPhotos,
         ecologyParks: dataEcologyParks,
         geo: dataGeo,
      });
   }, [dataRenov, dataPhotos, dataEcologyParks, dataGeo]);

   const onSubmitHandler = async (dataForm, additionalData = { reload: true }) => {
      setIsLoadingSend(true);

      if (type === 'edit') {
         await sendPostRequest(`/admin-api/update/object/${params.id}`, getFormData({ ...data, ...additionalData.data }, dataForm, attributes), {
            'Content-Type': 'multipart/form-data',
         });
         if (additionalData.reload) {
            window.location.reload();
         } else {
            await fetchDataBuilding();
         }
         setIsLoadingSend(false);
      }
      if (type === 'create') {
         const res = await sendPostRequest(`/admin-api/create/object`, getFormData(data, dataForm, attributes), {
            'Content-Type': 'multipart/form-data',
         });
         setIsLoadingSend(false);
         window.location.href = `${PrivateRoutesPath.objects.edit}${res.data.id}`;
      }
   };

   const sendingForm = async additionalData => {
      setIsLoadingSend(true);
      await handleSubmit(onSubmitHandler)({ data: additionalData, reload: false });
   };

   return {
      data,
      isLoading,
      isLoadingSend,
      sendingForm,
      constructItems,
      groupsPresent,
      specialCondition,
      tags,
      attributes,
      typeBuild,
      stickers,
      advantages,
      advantagesComplex,
      developers,
      frames,
      specialists,
      onSubmitHandler,
      dataGeo,
      setDataGeo,
      citiesItems,
      addressInputWrapperRef,
      addressInputRef,
      watchCity,
      watchAddress,
      buttonSubmitRef,
      handleSubmit,
      control,
      setValue,
      errors,
      fetchDataGroupsPresents,
      fetchDataBuilding,
      fetchSpecialCondition,
      fetchHistory,
      setData,
      dataPhotos,
      setDataPhotos,
      dataRenov,
      setDataRenov,
      dataEcologyParks,
      setDataEcologyParks,
   };
};
