import { useState, useRef } from 'react';
import { useChatDraftEditorState } from './useChatDraftEditorState';
import { useChatDraftEditorUtils } from './useChatDraftEditorUtils';
import { useChatDraftEditorEvents } from './useChatDraftEditorEvents';
import { useChatDraftFormatting } from './useChatDraftFormatting';
import { useChatDraftLink } from './useChatDraftLink';
import { useChatDraftInsertText } from './useChatDraftInsertText';
import { chatDraftStyleUtils } from './chatDraftStyleUtils';

export const useChatDraft = options => {
   const [hasFocus, setHasFocus] = useState(false);
   const [hasSelection, setHasSelection] = useState(false);
   const editorRef = useRef(null);

   const optionsState = {
      ...options,
      hasFocus,
      setHasFocus,
      hasSelection,
      setHasSelection,
      editorRef,
   };

   const { htmlToEditorState, getHtml, onFocusEditor } = useChatDraftEditorUtils({
      ...optionsState,
   });

   const { editorState, setEditorState, onChangeHandler, linkModal, setLinkModal } = useChatDraftEditorState({
      ...optionsState,
      getHtml,
      htmlToEditorState,
   });

   const { handleKeyCommand, handleReturn, handleEditorFocus, handleEditorBlur, handleResetEditor } = useChatDraftEditorEvents({
      ...optionsState,
      onChangeHandler,
      setEditorState,
      editorState,
      onFocusEditor,
   });

   const { toggleInlineStyle, toggleBlockquote, toggleSpoiler, isFormattingRemovable, removeFormattingSmart } = useChatDraftFormatting({
      ...optionsState,
      editorState,
      setEditorState,
      onChangeHandler,
   });

   const { handleAddLink, confirmLink } = useChatDraftLink({
      ...optionsState,
      editorState,
      setEditorState,
      onChangeHandler,
      linkModal,
      setLinkModal,
      onFocusEditor,
   });

   const { insertText } = useChatDraftInsertText({
      ...optionsState,
      editorState,
      setEditorState,
      onChangeHandler,
      onFocusEditor,
   });

   const { draftBlockStyleFn, draftCustomStyleFn } = chatDraftStyleUtils({
      editorState,
   });

   return {
      ...optionsState,
      editorState,
      toggleInlineStyle,
      toggleBlockquote,
      onChangeHandler,
      handleKeyCommand,
      handleReturn,
      handleEditorFocus,
      handleEditorBlur,
      insertText,
      handleAddLink,
      confirmLink,
      linkModal,
      setLinkModal,
      handleResetEditor,
      isFormattingRemovable,
      removeFormattingSmart,
      onFocusEditor,
      draftCustomStyleFn,
      draftBlockStyleFn,
      toggleSpoiler,
   };
};
