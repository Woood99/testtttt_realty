import React, { useContext } from 'react';
import { ControllerFieldInput, ControllerFieldInputPhone } from '../../uiForm/ControllerFields/ControllerFieldInput';
import { ProfileEditContext } from '../../context';
import { useForm } from 'react-hook-form';
import getImagesObj from '../../unifComponents/getImagesObj';
import Button from '../../uiForm/Button';

import DragDropImageSolo from '../../components/DragDrop/DragDropImageSolo';

import AVATAR from '../../assets/img/avatar.png';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';

const ProfileEditForm = () => {
   const { data, photo, setPhoto, onSubmitHandler, onClickLogout } = useContext(ProfileEditContext);
   const isDesktop = useSelector(getIsDesktop);

   const {
      formState: { errors },
      handleSubmit,
      control,
   } = useForm();

   return (
      <form onSubmit={handleSubmit(onSubmitHandler)} className="white-block flex flex-col gap-8">
         <div className="flex items-center gap-8 md2:flex-col md2:gap-0">
            <DragDropImageSolo
               defaultLayout={() => <img src={AVATAR} />}
               image={photo?.image}
               onChange={file => {
                  setPhoto(file ? getImagesObj(file)[0] : null);
               }}
               className="!rounded-full"
               changeAvatarChildren={!isDesktop && <div className="blue-link mt-3">Изменить аватарку</div>}
            />

            <h2 className="title-1 md1:mt-4">{data.name || data.surname ? `${data.surname || ''} ${data.name || ''} ${data.father_name || ''}` : 'ФИО'} </h2>
         </div>
         <div>
            <h3 className="title-3 mb-4">Контактные данные</h3>
            <div className="grid grid-cols-2 gap-4 md3:grid-cols-1">
               <ControllerFieldInputPhone control={control} errors={errors} size={48} defaultValue={data.phone || ''} disabled />
               {Boolean(data.is_admin) && (
                  <ControllerFieldInput control={control} beforeText="Email" name="email" size={48} defaultValue={data.email || ''} />
               )}
            </div>
         </div>
         <div>
            <h3 className="title-3 mb-4">Личные данные</h3>
            <div className="grid grid-cols-2 gap-4 md3:grid-cols-1">
               <ControllerFieldInput control={control} beforeText="Фамилия" name="surname" size={48} defaultValue={data.surname || ''} />
               <ControllerFieldInput control={control} beforeText="Имя" name="name" size={48} defaultValue={data.name || ''} />
               <ControllerFieldInput control={control} beforeText="Отчество" name="father_name" size={48} defaultValue={data.father_name || ''} />
               <ControllerFieldInput
                  control={control}
                  beforeText="Дата рождения"
                  name="date_birth"
                  datePicker={true}
                  size={48}
                  defaultValue={data.birthday || ''}
               />
            </div>
         </div>
         <div className="flex gap-4 justify-end md3:flex-col">
            <Button type="button" variant="secondary" onClick={onClickLogout}>
               Выйти из личного кабинета
            </Button>
            <Button className="min-w-[200px]">Сохранить</Button>
         </div>
      </form>
   );
};

export default ProfileEditForm;
