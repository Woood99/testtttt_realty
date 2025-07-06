import { EditorState, Modifier } from 'draft-js';
import { useCallback } from 'react';

export const useChatDraftInsertText = options => {
   const { editorState, setEditorState, onChangeHandler, onFocusEditor } = options;

   const insertText = useCallback(
      textToInsert => {
         const currentContent = editorState.getCurrentContent();
         let selection = editorState.getSelection();
         let newContent = currentContent;

         if (!selection.isCollapsed()) {
            newContent = Modifier.removeRange(currentContent, selection, 'backward');
            selection = newContent.getSelectionAfter();
         }

         newContent = Modifier.insertText(newContent, selection, textToInsert);

         const newEditorState = EditorState.push(EditorState.set(editorState, { currentContent: newContent }), newContent, 'insert-characters');

         setEditorState(newEditorState);
         onChangeHandler(newEditorState);
         onFocusEditor();
      },
      [editorState, onChangeHandler]
   );

   return { insertText };
};
