import React, { useState } from 'react';

import ModalWrapper from '../../ui/Modal/ModalWrapper';
import StoriesCards from './StoriesCards';
import StoriesModal from './StoriesModal';

const Stories = ({ data = [], className = '' }) => {
   const [storiesOpenId, setStoriesOpenId] = useState(false);

   // <Stories
   //    className="my-10"
   //    data={[
   //       ...mergeArraysFromObject(promoCards).map(item => ({ ...item, type: 'promo' })),
   //       ...mergeArraysFromObject(shortsCards).map(item => ({ ...item, type: 'short' })),
   //    ]}
   // />;

   return (
      <>
         <StoriesCards data={data} className={className} setStoriesOpenId={setStoriesOpenId} />
         <ModalWrapper condition={storiesOpenId}>
            <StoriesModal data={data} currentId={storiesOpenId} set={setStoriesOpenId} />
         </ModalWrapper>
      </>
   );
};

export default Stories;
