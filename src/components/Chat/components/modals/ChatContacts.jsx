import { useContext } from "react";

import { ChatContext } from "@/context";

import { Modal, ModalWrapper } from "@/ui";
import { IconHouseBuilding, IconUsers2 } from "@/ui/Icons";

const ChatContacts = () => {
	const { contactsModalOpen, setContactsModalOpen, setCreateDialogWithDevelopModal, setCreateDialogWithSpecialistModal } = useContext(ChatContext);

	return (
		<ModalWrapper condition={contactsModalOpen}>
			<Modal
				condition={contactsModalOpen}
				set={setContactsModalOpen}
				options={{ overlayClassNames: "_left", modalClassNames: "mmd1:!w-[475px]", modalContentClassNames: "md1:flex md1:flex-col" }}>
				<h3 className='title-2-5 mb-8'>Меню</h3>
				<div className='flex gap-6'>
					<button
						type='button'
						className='flex flex-col gap-2 items-center  font-medium md1:px-2 py-2'
						onClick={() => {
							setCreateDialogWithDevelopModal(true);
						}}>
						<IconHouseBuilding className='fill-blue' />
						Застройщики
					</button>
					<button
						type='button'
						className='flex flex-col gap-2 items-center font-medium md1:px-2 py-2'
						onClick={() => {
							setCreateDialogWithSpecialistModal(true);
						}}>
						<IconUsers2 className='fill-blue' />
						Менеджеры
					</button>
				</div>
			</Modal>
		</ModalWrapper>
	);
};

export default ChatContacts;
