import React, { useState } from 'react';
import ShortCard from '../../ui/ShortCard';
import { ShortsModal } from '../../ModalsMain/VideoModal';

const BlockShorts = ({ data, onDeleteCard = () => {}, onEditCard, controlsAdmin = false, onlyImage = false, shouldPlayOnHover = false }) => {
   const [shortsModal, setShortsModal] = useState(false);

   return (
      <>
         {data.map((card, index) => {
            return (
               <ShortCard
                  data={card}
                  key={index}
                  setShortsOpen={() => setShortsModal(card.id)}
                  deleteCard={onDeleteCard}
                  controlsAdmin={controlsAdmin}
                  edit={onEditCard ? () => onEditCard(card) : null}
                  onlyImage={onlyImage}
                  shouldPlayOnHover={shouldPlayOnHover}
               />
            );
         })}
         <ShortsModal
            condition={shortsModal !== false}
            set={setShortsModal}
            data={data}
            startData={data.find(item => item.id === shortsModal)}
            startIndex={data.findIndex(item => item.id === shortsModal)}
         />
      </>
   );
};

export default BlockShorts;
