import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ControllerFieldInput } from '../ControllerFields/ControllerFieldInput';
import { getIsDesktop } from '@/redux';
import { IconSearch } from '../../ui/Icons';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import Button from '../Button';

const InputSearch = ({ control, placeholder, name, options = {} }) => {
   const isDesktop = useSelector(getIsDesktop);
   const [isModalOpen, setIsModalOpen] = useState(false);

   if (isDesktop) {
      return <ControllerFieldInput control={control} placeholder={placeholder} name={name} />;
   }

   if (!isDesktop) {
      return (
         <>
            <button type="button" className="h-full w-hull flex-center-all bg-primary700 rounded-[10px]" onClick={() => setIsModalOpen(true)}>
               <IconSearch className="fill-gray" width={18} height={18} />
            </button>

            <ModalWrapper condition={isModalOpen}>
               <Modal
                  condition={isModalOpen}
                  set={setIsModalOpen}
                  options={{ modalClassNames: '', overlayClassNames: '_bottom _full', modalContentClassNames: '!px-4' }}>
                  <h3 className="title-3 mb-5">{options.title}</h3>
                  <ControllerFieldInput control={control} placeholder={placeholder} name={name} />
                  <Button size="Small" className="w-full mt-3" onClick={() => setIsModalOpen(false)}>
                     {options.text_show}
                  </Button>
               </Modal>
            </ModalWrapper>
         </>
      );
   }
};

export const SearchButtonChildren = ({ options = {}, children }) => {
   const isDesktop = useSelector(getIsDesktop);
   const [isModalOpen, setIsModalOpen] = useState(false);

   if (isDesktop) {
      return children;
   }

   if (!isDesktop) {
      return (
         <>
            <button type="button" className="h-full w-hull flex-center-all bg-primary700 rounded-[10px]" onClick={() => setIsModalOpen(true)}>
               <IconSearch className="fill-gray" width={18} height={18} />
            </button>

            <ModalWrapper condition={isModalOpen}>
               <Modal
                  condition={isModalOpen}
                  set={setIsModalOpen}
                  options={{ modalClassNames: '', overlayClassNames: '_bottom _full', modalContentClassNames: '!px-4' }}>
                  <h3 className="title-3 mb-5">{options.title}</h3>
                  {children}
                  <Button size="Small" className="w-full mt-3" onClick={() => setIsModalOpen(false)}>
                     {options.text_show}
                  </Button>
               </Modal>
            </ModalWrapper>
         </>
      );
   }
};

export default InputSearch;
