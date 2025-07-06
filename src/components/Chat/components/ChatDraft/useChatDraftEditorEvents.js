import { EditorState, Modifier, RichUtils } from 'draft-js';
import { useCallback } from 'react';

export const useChatDraftEditorEvents = options => {
   const { setEditorState, onChangeHandler, editorState, send, setHasFocus, setHasSelection, onFocusEditor } = options;

   const handleResetEditor = useCallback(() => {
      const newEditorState = EditorState.createEmpty();
      setEditorState(newEditorState);

      onFocusEditor();
   }, [setEditorState, onFocusEditor]);

   const handleKeyCommand = useCallback(
      (command, editorState) => {
         if (command === 'split-block') {
            const selection = editorState.getSelection();
            const content = editorState.getCurrentContent();
            const block = content.getBlockForKey(selection.getStartKey());

            if (block.getType() === 'blockquote') {
               const newContent = Modifier.splitBlock(content, selection);
               const newEditorState = EditorState.push(editorState, newContent, 'split-block');
               setEditorState(newEditorState);
               return 'handled';
            }
         }

         const newState = RichUtils.handleKeyCommand(editorState, command);
         if (newState) {
            onChangeHandler(newState);
            return 'handled';
         }
         return 'not-handled';
      },

      [onChangeHandler, setEditorState]
   );

   const handleReturn = useCallback(
      e => {
         if (e.key !== 'Enter') return 'not-handled';

         const contentState = editorState.getCurrentContent();
         const hasAnyText = contentState.hasText();

         if (!hasAnyText) return 'handled';

         if (e.shiftKey) {
            const selection = editorState.getSelection();
            const block = contentState.getBlockForKey(selection.getStartKey());

            if (block.getType() === 'blockquote') {
               e.preventDefault();
               const newContent = Modifier.insertText(contentState, selection, '\n');
               setEditorState(EditorState.push(editorState, newContent, 'insert-characters'));

               return 'handled';
            }
         } else {
            e.preventDefault();
            send?.();
            handleResetEditor();

            return 'handled';
         }
         return 'not-handled';
      },
      [editorState, setEditorState, send, handleResetEditor]
   );

   const handleEditorFocus = useCallback(() => {
      setHasFocus(true);
      const selection = editorState.getSelection();
      setHasSelection(!selection.isCollapsed());
   }, [editorState, setHasFocus, setHasSelection]);

   const handleEditorBlur = useCallback(
      e => {
         const relatedTarget = e.relatedTarget;
         if (relatedTarget && relatedTarget.closest('[data-popper-draft]')) {
            return;
         }
         setHasFocus(false);
         setHasSelection(false);
      },
      [setHasFocus, setHasSelection]
   );

   return { handleKeyCommand, handleReturn, handleEditorFocus, handleEditorBlur, handleResetEditor };
};
