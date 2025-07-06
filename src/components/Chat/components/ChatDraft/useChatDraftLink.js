import { EditorState, RichUtils } from 'draft-js';
import { useCallback } from 'react';

export const useChatDraftLink = options => {
   const { editorState, setEditorState, onChangeHandler, linkModal, setLinkModal, onFocusEditor } = options;

   const handleAddLink = useCallback(() => {
      const selection = editorState.getSelection();

      if (!selection.isCollapsed()) {
         const contentState = editorState.getCurrentContent();
         const startKey = selection.getStartKey();
         const entityKey = contentState.getBlockForKey(startKey).getEntityAt(selection.getStartOffset());

         let url = '';
         if (entityKey) {
            const entity = contentState.getEntity(entityKey);
            if (entity.getType() === 'LINK') {
               url = entity.getData().url;
            }
         }

         setLinkModal({
            visible: true,
            url,
            selection,
         });

         onFocusEditor();
      }
   }, [editorState]);

   const confirmLink = useCallback(() => {
      const { url, selection } = linkModal;
      let newEditorState = editorState;

      if (!url) {
         newEditorState = RichUtils.toggleLink(editorState, selection, null);
      } else {
         const contentState = editorState.getCurrentContent();
         const contentWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: url.startsWith('http') ? url : `https://${url}` });
         const entityKey = contentWithEntity.getLastCreatedEntityKey();
         newEditorState = EditorState.set(editorState, {
            currentContent: contentWithEntity,
         });
         newEditorState = RichUtils.toggleLink(newEditorState, selection, entityKey);
      }

      setEditorState(newEditorState);
      onChangeHandler(newEditorState);

      setLinkModal({ visible: false, url: '', selection: null });
   }, [editorState, linkModal, onChangeHandler]);

   return { handleAddLink, confirmLink };
};
