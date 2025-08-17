import React from 'react';
import Modal from '../../ui/Modal';
import Tabs from '../../ui/Tabs';
import GalleryPhoto from '../../components/GalleryPhoto';
import { GetDescrHTML } from '../../components/BlockDescr/BlockDescr';

const GalleryModal = ({ condition, set, data, sidebar }) => {
   const dataTabs = data.map(item => {
      return {
         name: item.title,
         body: (
            <div>
               <GalleryPhoto data={item} containerClassName="!max-h-[80vh] !h-[800px]" descrVisible={false} />
               {item.description && (
                  <div className="mt-3">
                     <GetDescrHTML data={item.description} />
                  </div>
               )}
            </div>
         ),
      };
   });

   return (
      <Modal options={{ overlayClassNames: '_full', modalContentClassNames: '!p-8 !pt-14 md1:!px-0' }} set={set} condition={condition}>
         <div className="container-desktop !max-w-[1600px]">
            <Tabs
               data={dataTabs}
               navClassName="col-span-full md1:!mx-4"
               containerClassName="grid mmd1:grid-cols-[1fr_minmax(auto,350px)] gap-x-5"
               contentClassName="min-w-0">
               <div className="mt-6 md1:!mx-4">{sidebar}</div>
            </Tabs>
         </div>
      </Modal>
   );
};

export default GalleryModal;

export const GalleryModalDefault = ({ condition, set, children }) => {
   return (
      <Modal options={{ overlayClassNames: '_full', modalContentClassNames: '!p-8 !pt-14 md1:!px-0' }} set={set} condition={condition}>
         <div className="container-desktop !max-w-[1600px]">{children}</div>
      </Modal>
   );
};
