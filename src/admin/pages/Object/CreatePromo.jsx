import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Modal from '../../../ui/Modal';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../uiForm/Button';
import { ControllerFieldTextarea } from '../../../uiForm/ControllerFields/ControllerFieldTextarea';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { DragDropItems } from '../../../components/DragDrop/DragDropItems';
import { FileDropZone } from '../../../components/DragDrop/FileDropZone';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import { ControllerFieldCheckbox } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import getImagesObj from '../../../unifComponents/getImagesObj';
import ControllerFieldTags from '../../../uiForm/ControllerFields/ControllerFieldTags';
import ChoiceApartmentsFilter from '../../../components/ChoiceApartmentsFilter';
import { getDataRequest } from '../../../api/requestsApi';
import { choiceApartmentsFilterOptions } from '../../../data/selectsField';

const CreatePromo = ({ conditionModal, setModal, specialists, options = {}, type = 'create', values = {}, dataObject, frames, authorDefault }) => {
   const [images, setImages] = useState([]);
   const [bannerImages, setBannerImages] = useState([]);
   const [selectedApartments, setSelectedApartments] = useState([]);
   const defaultValues = {
      id: values.id,
      name: values.name || '',
      start: values.start ? dayjs(values.start * 1000).format('DD.MM.YYYY') : '',
      end: values.end ? dayjs(values.end * 1000).format('DD.MM.YYYY') : '',
      image: [values.image],
      descr: values.descr || '',
      show_on_homepage: Boolean(values.show_on_homepage),
      is_banner: Boolean(values.is_banner),
      author: values.author || null,
      tags: values.tags || [],
      apartments_ids: [],
      filterFields: values?.filters_info ? JSON.parse(values?.filters_info) : choiceApartmentsFilterOptions,
   };
   const [defaultApartmentIds, setDefaultApartmentsIds] = useState([]);

   useEffect(() => {
      if (type === 'edit') {
         setImages(
            values.image
               ? [values.image].map((item, index) => {
                    return {
                       id: index + 1,
                       image: item,
                    };
                 })
               : []
         );
         setBannerImages(
            values.banner_image
               ? [values.banner_image].map((item, index) => {
                    return {
                       id: index + 1,
                       image: item,
                    };
                 })
               : []
         );

         getDataRequest(`/api/promo/${defaultValues.id}/apartments`).then(res => {
            setDefaultApartmentsIds(res.data);
         });
      }
   }, [values]);

   const {
      handleSubmit,
      control,
      reset,
      watch,
      formState: { errors },
   } = useForm();

   const [filterFields, setFilterFields] = useState(defaultValues.filterFields);

   const watchBanner = watch('is_banner');

   const ModalHeaderLayout = () => {
      return (
         <ModalHeader set={setModal} className="px-10 py-6 mb-8">
            <h2 className="title-2">{options.title}</h2>
         </ModalHeader>
      );
   };

   const ModalFooterLayout = () => {
      return (
         <div className="px-14 py-6">
            <Button onClick={handleSubmit(onSubmitHandler)} className="w-full">
               Сохранить
            </Button>
         </div>
      );
   };

   const addPhoto = (files, set) => {
      const newData = getImagesObj([...files]);
      set(newData);
   };

   const deleteItem = (idImage, data, set) => {
      const newData = data
         .filter(item => item.id !== idImage)
         .map((item, index) => {
            return { ...item, id: index + 1 };
         });

      set(newData);
   };

   const onSubmitHandler = data => {
      const resData = {
         ...data,
         author_id: data.author ? data.author.value : null,
         image: images,
         apartments_ids: selectedApartments.map(item => item.value),
         filtersInfo: JSON.stringify(filterFields),
      };
      if (resData.is_banner) {
         resData.banner_image = bannerImages;
      } else {
         delete resData.banner_image;
      }

      const resetForm = () => {
         reset();
      };
      options.onSubmitForm(resData, resetForm, type, defaultValues.id || null);
   };

   return (
      <Modal
         set={setModal}
         options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
         condition={conditionModal}
         style={{
            '--modal-space': '40px',
            '--modal-height': 'calc(var(--vh) - 80px)',
            '--modal-width': '1150px',
         }}
         closeBtn={false}
         ModalHeader={ModalHeaderLayout}
         ModalFooter={ModalFooterLayout}>
         <form>
            <div className="grid grid-cols-2 gap-2">
               <ControllerFieldInput
                  control={control}
                  beforeText="Название"
                  name="name"
                  defaultValue={defaultValues.name}
               />
               <ControllerFieldSelect
                  control={control}
                  nameLabel="Автор"
                  defaultOption
                  placeholderName={dataObject.developer ? `${dataObject.developer.pos} ${dataObject.developer.name}` : 'Не выбрано'}
                  options={specialists}
                  name="author"
                  defaultValue={specialists?.find(item => item.value === defaultValues.author?.id || item.value === authorDefault)}
                  disabled={authorDefault}
               />
               <ControllerFieldInput
                  control={control}
                  datePicker={true}
                  beforeText="Начало"
                  name="dateStart"
                  defaultValue={defaultValues.start}
                  requiredValue
                  errors={errors}
               />
               <ControllerFieldInput
                  control={control}
                  datePicker={true}
                  beforeText="Окончание"
                  name="dateEnd"
                  defaultValue={defaultValues.end}
                  requiredValue
                  errors={errors}
               />
            </div>
            <div className="mt-6">
               <h3 className="title-3 mb-4">Описание</h3>
               <ControllerFieldTextarea
                  control={control}
                  maxLength={3000}
                  name="descr"
                  placeholder="Расскажите об скидках и спецпредложениях"
                  requiredValue
                  defaultValue={defaultValues.descr}
                  errors={errors}
               />
            </div>
            <div className="mt-6">
               <h3 className="title-3 mb-4">Основная фотография</h3>
               <DragDropItems items={images} deleteItem={(_, id) => deleteItem(id, images, setImages)} />
               <FileDropZone addFiles={files => addPhoto(files, setImages)} multiple={false} className={`${images.length > 0 ? 'mt-6' : ''} mb-4`} />
            </div>
            {watchBanner && (
               <div className="mt-6">
                  <h3 className="title-3 mb-4">Баннер</h3>
                  <DragDropItems items={bannerImages} deleteItem={(_, id) => deleteItem(id, bannerImages, setBannerImages)} />
                  <FileDropZone
                     addFiles={files => addPhoto(files, setBannerImages)}
                     multiple={false}
                     className={`${bannerImages.length > 0 ? 'mt-6' : ''} mb-4`}
                  />
               </div>
            )}

            {Boolean(dataObject.tags && dataObject.tags.length) && (
               <div className="mt-8">
                  <h3 className="title-3 mb-4">Теги</h3>
                  <ControllerFieldTags
                     className="w-full"
                     control={control}
                     options={dataObject.tags.map(item => ({
                        value: item.id,
                        label: item.name,
                     }))}
                     defaultValue={defaultValues.tags.map(item => item.id)}
                     name="tags"
                     type="multiple"
                  />
               </div>
            )}

            <div className="mt-8 flex items-center gap-8">
               <ControllerFieldCheckbox
                  control={control}
                  option={{ value: 'show_on_homepage', label: 'Показать на главной' }}
                  name="show_on_homepage"
                  defaultValue={defaultValues.show_on_homepage}
               />
               <ControllerFieldCheckbox
                  control={control}
                  option={{ value: 'is_banner', label: 'Баннер' }}
                  name="is_banner"
                  defaultValue={defaultValues.is_banner}
               />
               <ControllerFieldCheckbox
                  control={control}
                  option={{ value: 'show_on_stories', label: 'Показать в stories' }}
                  name="show_on_stories"
                  defaultValue={defaultValues.show_on_stories}
               />
            </div>
            <div className="mt-8">
               <ChoiceApartmentsFilter
                  building_id={dataObject.id}
                  frames={frames}
                  setData={setSelectedApartments}
                  defaultValue={defaultApartmentIds}
                  filterFields={filterFields}
                  setFilterFields={setFilterFields}
               />
            </div>
         </form>
      </Modal>
   );
};

export default CreatePromo;
