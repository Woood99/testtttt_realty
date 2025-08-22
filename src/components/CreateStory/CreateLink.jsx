import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { normalizeUrl } from "@/helpers";

import { Modal, ModalWrapper } from "@/ui";

import { Button, ControllerFieldInput } from "@/uiForm";

const CreateLink = ({ condition, set, onCreateHandler }) => {
	const {
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm();

	const onSubmitHandler = data => {
		const id = condition?.isEdit ? condition.id : uuidv4();
		onCreateHandler({ ...data, id, isEdit: !!condition?.isEdit });
		set(false);
		setTimeout(() => {
			reset();
		}, 1);
	};

	return (
		<ModalWrapper condition={condition}>
			<Modal
				condition={condition}
				set={value => {
					reset();
					set(value);
				}}
				options={{
					overlayClassNames: "_center-max-content-desktop",
					modalClassNames: "mmd1:!w-[500px]",
					modalContentClassNames: "!px-10"
				}}>
				<form onSubmit={handleSubmit(onSubmitHandler)}>
					<h2 className='title-2 mb-4'>Добавить ссылку</h2>
					<div className='flex flex-col gap-2'>
						<ControllerFieldInput
							control={control}
							beforeText='Ссылка'
							name='url'
							errors={errors}
							defaultValue={condition?.url || ""}
							requiredValue='Введите ссылку'
							requiredFn={value => {
								return !Boolean(normalizeUrl(value)) ? "Некорректная ссылка" : true;
							}}
							maxLength={100}
						/>
						<ControllerFieldInput
							control={control}
							beforeText='Текст ссылки'
							name='text'
							errors={errors}
							requiredValue='Введите текст ссылки'
							defaultValue={condition?.text || ""}
							maxLength={100}
						/>
					</div>
				</form>
				<div className='mt-4 flex gap-2 justify-end'>
					<Button
						variant='secondary'
						size='Small'
						onClick={() => {
							reset();
							set(false);
						}}>
						Отмена
					</Button>
					<Button size='Small' onClick={handleSubmit(onSubmitHandler)}>
						Добавить
					</Button>
				</div>
			</Modal>
		</ModalWrapper>
	);
};

export default CreateLink;
