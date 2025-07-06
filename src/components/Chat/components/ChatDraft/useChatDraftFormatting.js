import { EditorState, Modifier, RichUtils } from 'draft-js';
import { useCallback } from 'react';

export const useChatDraftFormatting = options => {
   const { editorState, setEditorState, onChangeHandler } = options;

   const toggleInlineStyle = useCallback(
      inlineStyle => {
         const selection = editorState.getSelection();

         const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);

         const withSelection = EditorState.forceSelection(newState, selection);

         onChangeHandler(withSelection);
      },
      [editorState, onChangeHandler]
   );

   const toggleBlockquote = useCallback(() => {
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();

      if (selection.isCollapsed()) {
         const block = contentState.getBlockForKey(selection.getStartKey());
         const isBlockquote = block.getType() === 'blockquote';

         const inlineStyles = block.getInlineStyleAt(selection.getStartOffset());

         let newContentState = Modifier.setBlockType(contentState, selection, isBlockquote ? 'unstyled' : 'blockquote');

         if (!isBlockquote) {
            newContentState = Modifier.applyInlineStyle(newContentState, selection, inlineStyles);
         }

         const newEditorState = EditorState.push(editorState, newContentState, 'change-block-type');

         setEditorState(newEditorState);
         onChangeHandler(newEditorState);
         return;
      }

      const startKey = selection.getStartKey();
      const endKey = selection.getEndKey();

      const firstBlock = contentState.getBlockForKey(startKey);
      const isInsideBlockquote = firstBlock.getType() === 'blockquote' && contentState.getBlockForKey(endKey).getType() === 'blockquote';

      if (isInsideBlockquote) {
         let newContentState = contentState;

         let currentKey = startKey;
         while (currentKey) {
            const block = contentState.getBlockForKey(currentKey);
            const blockSelection = selection.merge({
               anchorKey: currentKey,
               anchorOffset: 0,
               focusKey: currentKey,
               focusOffset: block.getLength(),
            });

            newContentState = Modifier.setBlockType(newContentState, blockSelection, 'unstyled');

            if (currentKey === endKey) break;
            currentKey = contentState.getBlockAfter(currentKey)?.getKey();
         }

         setEditorState(EditorState.push(editorState, newContentState, 'change-block-type'));
         return;
      }

      const inlineStyles = [];
      let currentKey = startKey;
      while (currentKey) {
         const block = contentState.getBlockForKey(currentKey);
         const startOffset = currentKey === startKey ? selection.getStartOffset() : 0;
         const endOffset = currentKey === endKey ? selection.getEndOffset() : block.getLength();

         for (let i = startOffset; i <= endOffset; i++) {
            const styles = block.getInlineStyleAt(i);
            if (styles && styles.size > 0) {
               inlineStyles.push(...styles.toArray());
            }
         }

         if (currentKey === endKey) break;
         currentKey = contentState.getBlockAfter(currentKey)?.getKey();
      }

      let textToInsert = '';
      currentKey = startKey;

      while (currentKey) {
         const block = contentState.getBlockForKey(currentKey);
         let blockText = block.getText();

         if (currentKey === startKey) {
            blockText = blockText.slice(selection.getStartOffset());
         }

         if (currentKey === endKey) {
            blockText = blockText.slice(0, selection.getEndOffset());
         }

         textToInsert += blockText;

         if (currentKey === endKey) break;
         currentKey = contentState.getBlockAfter(currentKey)?.getKey();
         if (currentKey) textToInsert += '\n';
      }

      let newContentState = Modifier.removeRange(contentState, selection, 'backward');

      const newBlockSelection = newContentState.getSelectionAfter();
      newContentState = Modifier.insertText(newContentState, newBlockSelection, textToInsert);

      newContentState = Modifier.setBlockType(newContentState, newContentState.getSelectionAfter(), 'blockquote');

      const uniqueStyles = [...new Set(inlineStyles)];
      uniqueStyles.forEach(style => {
         newContentState = Modifier.applyInlineStyle(newContentState, newContentState.getSelectionAfter(), style);
      });

      const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
      setEditorState(newEditorState);
      onChangeHandler(newEditorState);
   }, [editorState]);

   const isFormattingRemovable = useCallback(() => {
      const selection = editorState.getSelection();
      if (selection.isCollapsed()) return false;

      const contentState = editorState.getCurrentContent();
      const startKey = selection.getStartKey();
      const endKey = selection.getEndKey();
      const startBlock = contentState.getBlockForKey(startKey);
      const endBlock = contentState.getBlockForKey(endKey);

      const isPartialBlockquote =
         (startBlock.getType() === 'blockquote' || endBlock.getType() === 'blockquote') &&
         !(selection.getStartOffset() === 0 && selection.getEndOffset() === endBlock.getLength());

      if (isPartialBlockquote) return false;

      let currentKey = startKey;
      let linkEntityKey = null;
      let linkStart = null;
      let linkEnd = null;

      while (currentKey) {
         const block = contentState.getBlockForKey(currentKey);
         const startOffset = currentKey === startKey ? selection.getStartOffset() : 0;
         const endOffset = currentKey === endKey ? selection.getEndOffset() : block.getLength();

         block.findEntityRanges(
            char => {
               const entityKey = char.getEntity();
               return entityKey && contentState.getEntity(entityKey).getType() === 'LINK';
            },
            (start, end) => {
               if (start < endOffset && end > startOffset) {
                  if (!linkEntityKey) {
                     linkEntityKey = block.getEntityAt(start);
                     linkStart = start;
                     linkEnd = end;
                  }
               }
            }
         );

         if (currentKey === endKey) break;
         currentKey = contentState.getBlockAfter(currentKey)?.getKey();
      }

      if (linkEntityKey) {
         const isFullLinkSelected =
            selection.getStartKey() === startKey &&
            selection.getStartOffset() <= linkStart &&
            selection.getEndKey() === endKey &&
            selection.getEndOffset() >= linkEnd;

         if (!isFullLinkSelected) return false;
      }

      return true;
   }, [editorState]);

   const removeFormattingSmart = useCallback(() => {
      if (!isFormattingRemovable()) return;

      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const startKey = selection.getStartKey();
      const startBlock = contentState.getBlockForKey(startKey);

      let newEditorState;

      if (startBlock.getType() === 'blockquote') {
         const newContent = Modifier.setBlockType(contentState, selection, 'unstyled');
         newEditorState = EditorState.push(editorState, newContent, 'change-block-type');
      } else if (startBlock.getEntityAt(selection.getStartOffset())) {
         newEditorState = RichUtils.toggleLink(editorState, selection, null);
      } else {
         const inlineStyles = editorState.getCurrentInlineStyle();
         let newContent = contentState;

         inlineStyles.forEach(style => {
            newContent = Modifier.removeInlineStyle(newContent, selection, style);
         });

         newEditorState = EditorState.push(editorState, newContent, 'change-inline-style');
      }

      newEditorState = EditorState.forceSelection(newEditorState, selection);

      setEditorState(newEditorState);
      onChangeHandler(newEditorState);
   }, [editorState, isFormattingRemovable, onChangeHandler]);

   const toggleSpoiler = useCallback(() => {
      const selection = editorState.getSelection();
      if (selection.isCollapsed()) return;

      const contentState = editorState.getCurrentContent();
      const contentWithEntity = contentState.createEntity('SPOILER', 'IMMUTABLE', {});
      const entityKey = contentWithEntity.getLastCreatedEntityKey();

      let newEditorState = EditorState.set(editorState, {
         currentContent: contentWithEntity,
      });

      newEditorState = RichUtils.toggleLink(newEditorState, selection, entityKey);
      setEditorState(newEditorState);
      onChangeHandler(newEditorState);
   }, [editorState, onChangeHandler]);

   return { toggleInlineStyle, toggleBlockquote, isFormattingRemovable, removeFormattingSmart, toggleSpoiler };
};
