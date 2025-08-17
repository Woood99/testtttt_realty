import cn from 'classnames';
import { Tooltip } from '../../../../ui/Tooltip';
import { IconAdd, IconArrow, IconClearFormatting, IconFontBold, IconLink, IconQuote, IconUnderlineCh } from '../../../../ui/Icons';
import StyleButton from './StyleButton';

const isType = (editorState, type) => {
   if (!type) return;
   const selection = editorState.getSelection();
   if (selection.isCollapsed()) return false;

   const content = editorState.getCurrentContent();
   const startKey = selection.getStartKey();
   const startOffset = selection.getStartOffset();
   const block = content.getBlockForKey(startKey);
   const entityKey = block.getEntityAt(startOffset);
   return entityKey && content.getEntity(entityKey).getType() === type;
};

const ChatDraftTooltip = ({ draftOptions }) => {
   const isBold = draftOptions.editorState.getCurrentInlineStyle().has('BOLD');
   const isUnderline = draftOptions.editorState.getCurrentInlineStyle().has('UNDERLINE');
   const isStrikethrough = draftOptions.editorState.getCurrentInlineStyle().has('STRIKETHROUGH');
   const isQuote =
      draftOptions.editorState.getCurrentContent().getBlockForKey(draftOptions.editorState.getSelection().getStartKey()).getType() === 'blockquote';
   const isLink = isType(draftOptions.editorState, 'LINK');
   const isSpoiler = isType(draftOptions.editorState, 'SPOILER');

   const isActiveDisabled = draftOptions.isFormattingRemovable();
   const isVisibleTooltipDraft = draftOptions.hasSelection && draftOptions.hasFocus;
   const isVisibleTooltipLink = draftOptions.linkModal.visible;

   return (
      <>
         <Tooltip
            mobileDefault
            color="white"
            placement="top-start"
            value={isVisibleTooltipDraft}
            offset={[0, 5]}
            classNameTarget="absolute h-[54px] top-0"
            classNameContent="p-1.5"
            classNameRoot="!z-[200]">
            <div className="flex gap-1" data-popper-draft>
               <StyleButton
                  active={isBold}
                  label="Жирный"
                  style="BOLD"
                  icon={<IconFontBold className={cn(isBold && '!fill-white')} />}
                  onToggle={draftOptions.toggleInlineStyle}
               />
               <StyleButton
                  active={isUnderline}
                  label="Подчеркивание"
                  style="UNDERLINE"
                  icon={<IconUnderlineCh className={cn(isUnderline && '!fill-white')} />}
                  onToggle={draftOptions.toggleInlineStyle}
               />
               <StyleButton
                  active={isStrikethrough}
                  label="Зачёркнутый"
                  style="STRIKETHROUGH"
                  icon={<IconUnderlineCh className={cn(isStrikethrough && '!fill-white')} />}
                  onToggle={draftOptions.toggleInlineStyle}
               />
               <StyleButton
                  active={isQuote}
                  label="Цитата"
                  icon={<IconQuote width={16} height={16} className={cn(isQuote && '!fill-white')} />}
                  onToggle={draftOptions.toggleBlockquote}
               />
               <StyleButton
                  active={isLink}
                  label="Добавить ссылку"
                  icon={<IconLink width={16} height={16} className={cn(isLink && '!fill-white')} />}
                  onToggle={draftOptions.handleAddLink}
               />
               <StyleButton
                  active={isSpoiler}
                  label="Скрытый"
                  icon={<IconAdd width={16} height={16} className={cn(isSpoiler && '!fill-white')} />}
                  onToggle={draftOptions.toggleSpoiler}
               />

               <StyleButton
                  label="Очистить форматирование"
                  icon={<IconClearFormatting width={18} height={18} />}
                  onToggle={draftOptions.removeFormattingSmart}
                  disabled={!isActiveDisabled}
               />
            </div>
         </Tooltip>

         <Tooltip
            color="white"
            mobile
            placement="top-start"
            value={isVisibleTooltipLink}
            offset={[0, 5]}
            classNameTarget="absolute h-[54px] top-0"
            classNameContent="p-1.5"
            classNameRoot="!z-[200]">
            <div className="flex items-center">
               <button onClick={() => draftOptions.setLinkModal({ ...draftOptions.linkModal, visible: false })} className="flex-center-all">
                  <IconArrow className="rotate-180" width={22} height={22} />
               </button>
               <input
                  type="url"
                  value={draftOptions.linkModal.url}
                  onChange={e => draftOptions.setLinkModal({ ...draftOptions.linkModal, url: e.target.value })}
                  placeholder="Введите URL"
                  className="border p-2 flex-grow min-w-[200px]"
                  autoFocus
               />
               <button onClick={() => draftOptions.confirmLink()} className="px-4 py-2 text-blue">
                  Применить
               </button>
            </div>
         </Tooltip>
      </>
   );
};

export default ChatDraftTooltip;
