import React, { useState } from 'react';
import Modal from '../../../ui/Modal';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import Button from '../../../uiForm/Button';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { ControllerFieldTextarea } from '../../../uiForm/ControllerFields/ControllerFieldTextarea';
import { DragDropItems, PdfControls } from '../../../components/DragDrop/DragDropItems';
import { FileDropZone } from '../../../components/DragDrop/FileDropZone';
import { sendPostRequest } from '../../../api/requestsApi';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../helpers/photosRefact';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import getImagesObj, { getPdfObj } from '../../../unifComponents/getImagesObj';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import dayjs from 'dayjs';

const CreatePresent = ({ conditionModal, setModal, groupData, fetchData, specialists = [], developer = {}, firstPresent = {} }) => {
   const {
      handleSubmit,
      control,
      formState: { errors },
   } = useForm();

   const [images, setImages] = useState([]);
   const [pdf, setPdf] = useState([]);

   const ModalHeaderLayout = () => {
      return (
         <ModalHeader set={setModal} className="px-10 py-6 mb-8">
            <h2 className="title-2">Создать подарок</h2>
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

   const onSubmitHandler = data => {
      const resData = {
         name: data.name,
         dateStart: data.dateStart,
         dateEnd: data.dateEnd,
         descr: data.descr,
         details: data.details,
         old_price: data.old_price,
         new_price: data.new_price,
         image: images,
         pdf,
         group_id: groupData.id,
         building_id: groupData.building_id,
         author_id: data.author ? data.author.value : null,
      };

      const formData = new FormData();

      if (resData.image.length > 0) {
         resData.image = refactPhotoStageOne(resData.image);
         refactPhotoStageAppend(resData.image, formData);
         resData.image = refactPhotoStageTwo(resData.image);
         resData.image = resData.image[0];
      } else {
         resData.image = null;
      }

      if (resData.pdf.length > 0) {
         resData.pdf = refactPhotoStageOne(resData.pdf, 'file', 'pdf');
         refactPhotoStageAppend(resData.pdf, formData, 'file', 'pdf');
         resData.pdf = refactPhotoStageTwo(resData.pdf, 'file', 'pdf');
         resData.pdf = resData.pdf[0];
      } else {
         resData.pdf = null;
      }

      formData.append('data', JSON.stringify(resData));

      console.log(resData);

      for (let pair of formData.entries()) {
         console.log(pair[0] + ': ' + pair[1]);
      }

      sendPostRequest(`/admin-api/gift/create`, formData, { 'Content-Type': 'multipart/form-data' }).then(res => {
         fetchData();
      });
   };

   return (
      <Modal
         set={setModal}
         options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
         condition={conditionModal}
         style={{
            '--modal-space': '40px',
            '--modal-height': 'calc(var(--vh) - 80px)',
            '--modal-width': '1070px',
         }}
         closeBtn={false}
         ModalHeader={ModalHeaderLayout}
         ModalFooter={ModalFooterLayout}>
         <form>
            <h3 className="title-3 mb-4">Общая информация</h3>
            <div className="grid grid-cols-2 gap-2">
               <ControllerFieldInput control={control} beforeText="Название" name="name" requiredValue errors={errors} />
               <ControllerFieldSelect
                  control={control}
                  nameLabel="Автор"
                  defaultOption
                  placeholderName={developer ? `${developer.pos} ${developer.name}` : 'Не выбрано'}
                  options={specialists}
                  name="author"
                  disabled={!isEmptyArrObj(firstPresent)}
               />
               <ControllerFieldInput
                  control={control}
                  datePicker={true}
                  beforeText="Начало"
                  name="dateStart"
                  requiredValue
                  errors={errors}
                  defaultValue={!isEmptyArrObj(firstPresent) ? dayjs(firstPresent.start_date).format('DD.MM.YYYY') : ''}
                  disabled={!isEmptyArrObj(firstPresent)}
               />
               <ControllerFieldInput
                  control={control}
                  datePicker={true}
                  beforeText="Окончание"
                  name="dateEnd"
                  requiredValue
                  errors={errors}
                  defaultValue={!isEmptyArrObj(firstPresent) ? dayjs(firstPresent.end_date).format('DD.MM.YYYY') : ''}
                  disabled={!isEmptyArrObj(firstPresent)}
               />
               <ControllerFieldInput control={control} beforeText="Старая цена" name="old_price" convertNumber onlyNumber maxLength={11} />
               <ControllerFieldInput
                  control={control}
                  beforeText="Новая цена"
                  name="new_price"
                  convertNumber
                  onlyNumber
                  maxLength={11}
                  requiredValue
                  errors={errors}
               />
            </div>
            <div className="mt-6">
               <h3 className="title-3 mb-4">Описание</h3>
               <ControllerFieldTextarea control={control} maxLength={3000} name="descr" placeholder="Описание" />
            </div>
            <div className="mt-6">
               <h3 className="title-3 mb-4">Дополнительная информация</h3>
               <ControllerFieldTextarea control={control} maxLength={3000} name="details" placeholder="Введите дополнительную информацию" />
            </div>
            <div className="mt-6">
               <h3 className="title-3 mb-4">Изображение</h3>
               <DragDropItems items={images} deleteItem={() => setImages([])} />
               <FileDropZone
                  addFiles={files => setImages(getImagesObj([...files]))}
                  multiple={false}
                  className={`${images.length > 0 ? 'mt-6' : ''} mb-4`}
               />
            </div>
            <div className="mt-6">
               <h3 className="title-3 mb-4">Добавить спецификацию</h3>
               {pdf.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mb-4">
                     <PdfControls src={window.URL.createObjectURL(pdf[0].file)} deleteItem={() => setPdf([])} />
                  </div>
               )}
               <FileDropZone
                  addFiles={files => setPdf(getPdfObj([...files]))}
                  multiple={false}
                  className={`${pdf.length > 0 ? 'mt-6' : ''} mb-4`}
                  acceptType={{ 'application/pdf': [] }}
                  textBtn="Выберите PDF"
               />
            </div>
         </form>
      </Modal>
   );
};

export default CreatePresent;
