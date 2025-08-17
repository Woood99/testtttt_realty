import { ProfileEditContext } from "@/context";

import { Modal, ModalWrapper } from "@/ui";

import ProfileEditForm from "./ProfileEditForm";
import { useProfile } from "./useProfile";

const ProfileEditModal = ({ condition, set }) => {
	const { data, photo, setPhoto, onSubmitHandler, isLoading } = useProfile();

	return (
		<ModalWrapper condition={condition}>
			<Modal condition={condition} set={set} options={{ overlayClassNames: "_center-max-content-desktop", modalClassNames: "mmd1:!w-[900px]" }}>
				<ProfileEditContext.Provider value={{ data, photo, setPhoto, onSubmitHandler, isLoading }}>
					<ProfileEditForm />
				</ProfileEditContext.Provider>
			</Modal>
		</ModalWrapper>
	);
};

export default ProfileEditModal;
