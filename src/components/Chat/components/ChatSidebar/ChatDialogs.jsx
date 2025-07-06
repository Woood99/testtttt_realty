import React, { memo, useContext, useState } from 'react';
import cn from 'classnames';

import SimpleScrollbar from '../../../../ui/Scrollbar';
import { ChatContext } from '../../../../context';
import RepeatContent from '../../../RepeatContent';
import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import ChatDialogButton from './ChatDialogButton';

const ChatDialogs = memo(({ sidebarMini = false }) => {
   const { isLoadingDialogs, dialogs, resizeSidebarOptions, isLoadingDialog } = useContext(ChatContext);
   const { sidebarWidth, sidebarOptions } = resizeSidebarOptions;

   const [showPopper, setShowPopper] = useState(false);

   return (
      <SimpleScrollbar className="overflow-y-auto mmd1:px-2" variant="custom">
         <div className={cn('flex flex-col gap-1', !isLoadingDialogs && isLoadingDialog && 'opacity-85 pointer-events-none')}>
            {isLoadingDialogs ? (
               <RepeatContent count={12}>
                  <div className="flex gap-3 items-center p-3">
                     <WebSkeleton className="w-[54px] h-[54px] rounded-full aspect-square" />
                     {sidebarWidth > sidebarOptions.min_width && <WebSkeleton className="w-[150px] h-6 rounded-lg" />}
                  </div>
               </RepeatContent>
            ) : (
               <>
                  {dialogs.map(item => {
                     return <ChatDialogButton key={item.id} data={item} options={{ sidebarMini, showPopper, setShowPopper }} />;
                  })}
               </>
            )}
         </div>
      </SimpleScrollbar>
   );
});

export default ChatDialogs;
