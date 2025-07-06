import { Editor } from 'draft-js';
import cn from 'classnames';
import styles from '../../Chat.module.scss';

const ChatDraft = ({ draftOptions }) => {
   return (
      <div className={cn(styles.ChatTextarea, 'overflow-y-auto')} onClick={() => draftOptions.editorRef.current?.focus()}>
         <Editor
            ref={draftOptions.editorRef}
            editorState={draftOptions.editorState}
            onChange={draftOptions.onChangeHandler}
            handleKeyCommand={draftOptions.handleKeyCommand}
            handleReturn={draftOptions.handleReturn}
            blockStyleFn={draftOptions.draftBlockStyleFn}
            onFocus={draftOptions.handleEditorFocus}
            onBlur={draftOptions.handleEditorBlur}
            customStyleFn={draftOptions.draftCustomStyleFn}
            customStyleMap={draftOptions.draftStyleMap}
         />
      </div>
   );
};

export default ChatDraft;
