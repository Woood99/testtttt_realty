import { useEffect, useState } from 'react';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import scrollToFirstErrorElement from '../../helpers/scrollToFirstErrorElement';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '@/redux';
import { useForm } from 'react-hook-form';

export const usePurchaseCreate = isEdit => {
   const [typeActiveId, setTypeActiveId] = useState(1);

   const params = useParams();

   const isDesktop = useSelector(getIsDesktop);

   const [attributes, setAttributes] = useState([]);

   const [coordinates, setCoordinates] = useState([]);

   const [defaultData, setDefaultData] = useState(null);

   const [modalOpen, setModalOpen] = useState(!isDesktop && !isEdit);
   const [isInitEdit, setIsInitEdit] = useState(false);

   const {
      handleSubmit,
      control,
      watch,
      setValue,
      formState: { errors },
      trigger,
   } = useForm();

   const [currentStage, setCurrentStage] = useState(0);

   const formValues = watch();

   const cityWatch = watch('city');
   const anyRegionWatch = watch('any_region');
   const calcPropsWatch = watch('calc_props');

   const [init, setInit] = useState(false);
   const [initFieldsForm, setInitFieldsForm] = useState({
      developers: false,
      complexes: false,
   });

   const [developers, setDevelopers] = useState([]);
   const [complexes, setComplexes] = useState([]);

   const [tagsAll, setTagsAll] = useState([]);
   const [tags, setTags] = useState([]);

   const [advantagesAll, setAdvantagesAll] = useState([]);
   const [advantages, setAdvantages] = useState([]);

   useEffect(() => {
      const fetch = async () => {
         if (isEdit) {
            const dataOrder = await getDataRequest(`/api/purchase-orders/${params.id}`).then(res => res.data);
            if (dataOrder) {
               setDefaultData({
                  ...dataOrder,
                  city: {
                     ...dataOrder.city,
                     geo: [dataOrder.city?.latitude, dataOrder.city?.longitude],
                  },
                  attributes: Object.values(
                     dataOrder.attributes.reduce((acc, item) => {
                        if (!acc[item.name]) {
                           acc[item.name] = { name: item.name, value: [] };
                        }
                        acc[item.name].value.push(item.value);
                        return acc;
                     }, {})
                  ).map(item => ({
                     ...item,
                     value: item.value.join(', '),
                  })),
               });
               setTypeActiveId(dataOrder.building_type_id || 1);
               setCoordinates(dataOrder.search_area || []);

               setValue(
                  'developers',
                  dataOrder.developers.map(el => ({
                     value: el.id,
                     label: el.name,
                  }))
               );

               setValue(
                  'complexes',
                  dataOrder.buildings.map(el => ({
                     value: el.id,
                     label: el.name,
                  }))
               );
               setTimeout(() => {
                  setIsInitEdit(true);
               }, 200);
            }
         }

         const types = await getDataRequest('/api/object-types').then(res => {
            return res.data;
         });

         const buildingId = types.find(item => item.name === 'Новостройки')?.id;

         await getDataRequest(`/api/type/${buildingId}`).then(res => {
            setAttributes(
               res.data.attributeComplex
                  .map(data => {
                     return {
                        ...data,
                        items: data.items.filter(item => item.showInFilter),
                     };
                  })
                  .filter(item => item.items.length)
            );
         });

         await getDataRequest('/api/tags?type=tags').then(res => {
            setTagsAll(res.data);
         });

         getDataRequest('/api/create/purchase/order/advantages').then(res => {
            setAdvantagesAll(res.data);
         });
      };

      fetch();
   }, []);

   useEffect(() => {
      if (!cityWatch) return;
      sendPostRequest('/api/developers/all', { city: cityWatch.value }).then(res => {
         const data = res.data.map(item => {
            return {
               label: item.name,
               value: item.id,
            };
         });
         setDevelopers(data);

         if (initFieldsForm.developers) {
            setValue('developers', []);
         }
         if (initFieldsForm.complexes) {
            setValue('complexes', []);
         }

         setInitFieldsForm(prev => ({ ...prev, developers: true, complexes: true }));
      });
   }, [cityWatch]);

   useEffect(() => {
      if (!formValues.developers) return;
      sendPostRequest('/api/developers/complexes', { developer_ids: formValues.developers.map(item => item.value) }).then(res => {
         setComplexes(res.data);

         if (initFieldsForm.complexes) {
            setValue('complexes', []);
         }
         setInitFieldsForm(prev => ({ ...prev, complexes: true }));
      });
   }, [formValues.developers]);

   useEffect(() => {
      if (!formValues.city) return;
      if (advantagesAll.length) {
         setAdvantages(advantagesAll.filter(item => item.city === formValues.city.label));
      }

      if (tagsAll.length) {
         setTags(tagsAll.filter(item => item.city === formValues.city.label));
      }
   }, [formValues.city, advantagesAll, tagsAll]);

   const onInvalidSubmit = errors => {
      setInit(true);
      scrollToFirstErrorElement(errors, 124);
   };

   return {
      typeActiveId,
      setTypeActiveId,
      control,
      watch,
      setValue,
      errors,
      coordinates,
      setCoordinates,
      attributes,
      formValues,
      defaultData,
      cityWatch,
      anyRegionWatch,
      init,
      trigger,
      modalOpen,
      setModalOpen,
      currentStage,
      setCurrentStage,
      calcPropsWatch,
      developers,
      complexes,
      tags,
      tagsAll,
      advantages,
      advantagesAll,
      onInvalidSubmit,
      handleSubmit,
      params,
      isInitEdit,
   };
};
