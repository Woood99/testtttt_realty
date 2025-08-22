import cn from "classnames";
import { useState } from "react";

import { ACCEPT_TYPE_ALL } from "@/constants";

import { BtnActionDelete, BtnActionEdit, Maybe, Modal, ModalWrapper } from "@/ui";
import { IconLink } from "@/ui/Icons";

import { Button, Textarea } from "@/uiForm";

import { FilesList } from "../DragDrop/DragDropItems";
import { FileDropZone } from "../DragDrop/FileDropZone";

import CreateLink from "./CreateLink";
import { useCreateStory } from "./useCreateStory";

const CreateStory = ({ condition, set }) => {
	const { files, links, setLinks, description, setDescription, isLoading, addPhoto, deleteItem, onSubmitHandler, reset } = useCreateStory();
	const [linkCreateModal, setLinkCreateModal] = useState(false);

	return (
		<>
			<ModalWrapper condition={condition}>
				<Modal
					condition={condition}
					set={value => {
						set(value);
						reset();
					}}
					options={{
						overlayClassNames: "_center-max-content-desktop",
						modalClassNames: "mmd1:!w-[830px]",
						modalContentClassNames: "!px-10"
					}}>
					<div className={cn("flex flex-col gap-8", isLoading && "pointer-events-none opacity-60")}>
						<FileDropZone
							textBtn='Выбрать файлы'
							text='Перетащите сюда фото или видео'
							acceptType={ACCEPT_TYPE_ALL}
							addFiles={files => addPhoto(files)}
							buttonSize='Small'
						/>
						<FilesList
							files={files}
							size={130}
							deleteFile={value => {
								deleteItem(null, value);
							}}
							className='flex items-center gap-3 overflow-x-auto scrollbarPrimary py-2'
						/>
						<div>
							<h3 className='title-3'>Ссылки</h3>
							<Maybe condition={links.length}>
								<div className='mt-3 w-full flex flex-col gap-2'>
									{links.map(item => (
										<div key={item.id} className='flex items-center gap-2 bg-primary700 p-3 rounded-xl overflow-hidden'>
											<p className='cut cut-1'>{item.text}</p>
											<div className='ml-auto flex items-center gap-2'>
												<BtnActionEdit onClick={() => setLinkCreateModal({ ...item, isEdit: true })} />
												<BtnActionDelete
													onClick={() => {
														setLinks(prev => prev.filter(el => el.id !== item.id));
													}}
												/>
											</div>
										</div>
									))}
								</div>
							</Maybe>
							<Maybe condition={links.length < 4}>
								<Button variant='secondary' size='Small' className='gap-2 mt-4' onClick={() => setLinkCreateModal(true)}>
									<IconLink width={16} height={16} />
									Добавить ссылку
								</Button>
							</Maybe>
						</div>
						<div>
							<h3 className='title-3 mb-3'>Описание</h3>
							<Textarea
								value={description}
								placeholder='Введите описание'
								onChange={value => {
									setDescription(value);
								}}
							/>
						</div>
					</div>

					<Button
						className='mt-4 ml-auto mmd1:min-w-[400px] gap-3'
						disabled={!files.length}
						isLoading={isLoading}
						onClick={onSubmitHandler}
						textLoading='Загружаем...'>
						Опубликовать
					</Button>
				</Modal>
			</ModalWrapper>
			<CreateLink
				condition={linkCreateModal}
				set={setLinkCreateModal}
				onCreateHandler={value => {
					if (value.isEdit) {
						setLinks(prev => prev.map(el => (el.id === value.id ? value : el)));
					} else {
						setLinks(prev => [...prev, value]);
					}
				}}
			/>
		</>
	);
};

export default CreateStory;
