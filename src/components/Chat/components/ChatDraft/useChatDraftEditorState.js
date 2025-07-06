import { useState, useCallback, useEffect } from 'react';
import { EditorState, Modifier } from 'draft-js';

export const useChatDraftEditorState = options => {
   const { onChange, initialValue = '', maxLength = 2000, getHtml, htmlToEditorState, setHasSelection, getTextLength, isEdit } = options;

   const [editorState, setEditorState] = useState(() => htmlToEditorState(initialValue));

   const [linkModal, setLinkModal] = useState({
      visible: false,
      url: '',
      selection: null,
   });

   const onChangeHandler = useCallback(
      newEditorState => {
         try {
            const content = newEditorState.getCurrentContent();
            const selection = newEditorState.getSelection();

            setHasSelection(!selection.isCollapsed());

            const block = content.getBlockForKey(selection.getStartKey());
            const html = getHtml(newEditorState);

            const currentLength = getTextLength(html);

            if (currentLength > maxLength) {
               const plainText = content.getPlainText();
               const trimmedText = plainText.substring(0, maxLength);

               const newContent = Modifier.replaceText(
                  content,
                  selection.merge({
                     anchorOffset: 0,
                     focusOffset: plainText.length,
                  }),
                  trimmedText
               );

               const trimmedEditorState = EditorState.push(editorState, newContent, 'insert-characters');

               setEditorState(trimmedEditorState);
               onChange?.(getHtml(trimmedEditorState));
               return;
            }

            onChange?.(html);

            if (block.getLength() === 0 && block.getType() !== 'unstyled') {
               const newContent = Modifier.setBlockType(content, selection, 'unstyled');
               const finalEditorState = EditorState.push(newEditorState, newContent, 'change-block-type');
               setEditorState(finalEditorState);
               return;
            }

            setEditorState(newEditorState);
         } catch (error) {
            console.error('Editor change error:', error);
         }
      },
      [onChange]
   );

   useEffect(() => {
      if (initialValue) {
         setEditorState(htmlToEditorState(initialValue));
      }
   }, [Boolean(isEdit)]);

   return { editorState, setEditorState, onChangeHandler, linkModal, setLinkModal };
};
