import cn from "classnames";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { ProfileEditContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { Maybe } from "@/ui";

import { Button, ControllerFieldInput, ControllerFieldInputPhone } from "@/uiForm";

import AVATAR from "../../assets/img/avatar.png";
import DragDropImageSolo from "../../components/DragDrop/DragDropImageSolo";
import getImagesObj from "../../unifComponents/getImagesObj";

const ProfileEditForm = ({ className }) => {
	const { data, photo, setPhoto, onSubmitHandler, onClickLogout, isLoading } = useContext(ProfileEditContext);
	const isDesktop = useSelector(getIsDesktop);

	const {
		formState: { errors },
		handleSubmit,
		control
	} = useForm();

	return (
		<form onSubmit={handleSubmit(onSubmitHandler)} className={cn("flex flex-col gap-8", className)}>
			<div className='flex items-center gap-8 md2:flex-col md2:gap-0'>
				<DragDropImageSolo
					defaultLayout={() => <img src={AVATAR} />}
					image={photo?.image}
					onChange={file => {
						setPhoto(file ? getImagesObj(file)[0] : null);
					}}
					className='!rounded-full'
					changeAvatarChildren={!isDesktop && <div className='blue-link mt-3'>Изменить аватарку</div>}
				/>

				<h2 className='title-1 md1:mt-4'>
					{data.name || data.surname ? `${data.surname || ""} ${data.name || ""} ${data.father_name || ""}` : "ФИО"}{" "}
				</h2>
			</div>
			<div>
				<h3 className='title-3 mb-4'>Контактные данные</h3>
				<div className='grid grid-cols-2 gap-4 md3:grid-cols-1'>
					<ControllerFieldInputPhone control={control} errors={errors} size={48} defaultValue={data.phone || ""} disabled />
					{Boolean(data.is_admin) && (
						<ControllerFieldInput control={control} beforeText='Email' name='email' size={48} defaultValue={data.email || ""} />
					)}
				</div>
			</div>
			<div>
				<h3 className='title-3 mb-4'>Личные данные</h3>
				<div className='grid grid-cols-2 gap-4 md3:grid-cols-1'>
					<ControllerFieldInput control={control} beforeText='Фамилия' name='surname' size={48} defaultValue={data.surname || ""} />
					<ControllerFieldInput control={control} beforeText='Имя' name='name' size={48} defaultValue={data.name || ""} />
					<ControllerFieldInput
						control={control}
						beforeText='Отчество'
						name='father_name'
						size={48}
						defaultValue={data.father_name || ""}
					/>
					<ControllerFieldInput
						control={control}
						beforeText='Дата рождения'
						name='date_birth'
						datePicker={true}
						size={48}
						defaultValue={data.birthday || ""}
					/>
				</div>
			</div>
			<div className='flex gap-4 justify-end md3:flex-col'>
				<Maybe condition={onClickLogout}>
					<Button type='button' variant='secondary' onClick={onClickLogout}>
						Выйти из личного кабинета
					</Button>
				</Maybe>

				<Button isLoading={isLoading} className='min-w-[200px]'>
					Сохранить
				</Button>
			</div>
		</form>
	);
};

export default ProfileEditForm;
