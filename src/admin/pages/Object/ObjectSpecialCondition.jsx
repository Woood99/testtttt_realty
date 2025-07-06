import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Modal from '../../../ui/Modal';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import Button from '../../../uiForm/Button';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import { NavBtnNext, NavBtnPrev } from '../../../ui/NavBtns';
import { DragDropItems, PdfControls } from '../../../components/DragDrop/DragDropItems';
import getImagesObj, { getPdfObj } from '../../../unifComponents/getImagesObj';
import { FileDropZone } from '../../../components/DragDrop/FileDropZone';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../helpers/photosRefact';
import { BtnActionDelete } from '../../../ui/ActionBtns';

const ObjectSpecialCondition = ({ dataObject, specialCondition = [], fetchData }) => {
   const [isOpenModal, setIsOpenModal] = useState(false);
   const {
      handleSubmit,
      control,
      reset,
      setError,
      watch,
      formState: { errors },
   } = useForm();

   const [pdf, setPdf] = useState([]);
   const [images, setImages] = useState([]);

   const onSubmitHandler = currentData => {
      const resData = {
         ...currentData,
         image: images,
         pdf,
      };

      const formData = new FormData();

      if (resData.image.length > 0) {
         resData.image = refactPhotoStageOne(resData.image);
         refactPhotoStageAppend(resData.image, formData);
         resData.image = refactPhotoStageTwo(resData.image);
         resData.image = resData.image[0];
      }

      if (resData.pdf.length > 0) {
         resData.pdf = refactPhotoStageOne(resData.pdf, 'file', 'pdf');
         refactPhotoStageAppend(resData.pdf, formData, 'file', 'pdf');
         resData.pdf = refactPhotoStageTwo(resData.pdf, 'file', 'pdf');
         resData.pdf = resData.pdf[0];
      }

      formData.append('data', JSON.stringify(resData));

      console.log(resData);

      for (let pair of formData.entries()) {
         console.log(pair[0] + ': ' + pair[1]);
      }

      sendPostRequest(`/admin-api/special-condition/building/${dataObject.id}/add`, formData, { 'Content-Type': 'multipart/form-data' }).then(res => {
         setIsOpenModal(false);
         fetchData();
      });
   };

   const onClickDelete = id => {
      sendPostRequest(`/admin-api/special-condition/building/${dataObject.id}/delete/${id}`).then(res => {
         fetchData();
      });
   };

   const ModalHeaderLayout = () => {
      return (
         <ModalHeader set={setIsOpenModal} className="px-10 py-6 mb-8">
            <h2 className="title-2">Создать специальное условие</h2>
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

   return (
      <>
         <div className="white-block mt-4">
            <h2 className="title-2 mb-6">Специальные условия</h2>
            <div className="mb-8">
               {specialCondition.length ? (
                  <Swiper
                     modules={[Navigation]}
                     slidesPerView={specialCondition.length > 1 ? 1.05 : 1}
                     navigation={{
                        prevEl: '.slider-btn-prev',
                        nextEl: '.slider-btn-next',
                     }}
                     spaceBetween={16}
                     breakpoints={{
                        799: {
                           slidesPerView: 2,
                           spaceBetween: 24,
                        },
                        1222: {
                           slidesPerView: 3,
                           spaceBetween: 24,
                        },
                     }}
                     className="md1:px-4 md1:-mx-4">
                     {specialCondition.map((item, index) => {
                        return (
                           <SwiperSlide key={index} className="group">
                              <div className="relative">
                                 <BtnActionDelete
                                    onClick={() => {
                                       onClickDelete(item.id);
                                    }}
                                    variant="absolute"
                                    className="group-hover:opacity-100 group-hover:visible"
                                 />
                                 <div className="bg-primary100 p-8 rounded-xl font-medium text-defaultMax">{item.name}</div>
                              </div>
                           </SwiperSlide>
                        );
                     })}
                     <NavBtnPrev disabled className="slider-btn-prev !absolute top-[95px] left-4" />
                     <NavBtnNext className="slider-btn-next !absolute top-[95px] right-4" />
                  </Swiper>
               ) : (
                  <span className="text-primary400">Вы пока не добавили ни одного условия</span>
               )}
            </div>
            <Button type="button" className="w-full mt-8" onClick={() => setIsOpenModal(true)}>
               Создать условие
            </Button>
         </div>
         <ModalWrapper condition={isOpenModal}>
            <Modal
               set={setIsOpenModal}
               options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
               condition={isOpenModal}
               style={{
                  '--modal-space': '40px',
                  '--modal-height': 'calc(var(--vh) - 80px)',
                  '--modal-width': '1070px',
               }}
               closeBtn={false}
               ModalHeader={ModalHeaderLayout}
               ModalFooter={ModalFooterLayout}>
               <form>
                  <div className="grid grid-cols-2 gap-2">
                     <ControllerFieldInput control={control} beforeText="Название" name="name" requiredValue errors={errors} />
                     <ControllerFieldInput control={control} beforeText="Ссылка на скидку/новость" name="link" />
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
                           <PdfControls src={pdf[0].pdf || window.URL.createObjectURL(pdf[0].file)} deleteItem={() => setPdf([])} />
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
         </ModalWrapper>
      </>
   );
};

export default ObjectSpecialCondition;
