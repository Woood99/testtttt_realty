export const draftStyleMap = {
   LINK: {
      color: '#005bff',
      textDecoration: 'none',
      cursor: 'pointer',
   },
   BOLD: {
      fontWeight: '500',
   },
   UNDERLINE: {
      textDecoration: 'underline',
   },
   STRIKETHROUGH: {
      textDecoration: 'line-through',
   },
   SPOILER: {
      backgroundColor: 'var(--primary100)',
      padding: '2px',
   },
};

export const chatDraftStyleUtils = options => {
   const draftBlockStyleFn = contentBlock => {
      const type = contentBlock.getType();
      if (type === 'blockquote') {
         return 'custom-blockquote';
      }
      return '';
   };

   const draftCustomStyleFn = (styleSet, block) => {
      const { editorState } = options;

      const styles = {};
      styleSet.forEach(style => {
         if (draftStyleMap[style]) {
            Object.assign(styles, draftStyleMap[style]);
         }
      });

      if (block) {
         const entityKey = block.getEntityAt(0);
         if (entityKey) {
            const contentState = editorState.getCurrentContent();
            const entity = contentState.getEntity(entityKey);
            if (entity.getType() === 'LINK') {
               Object.assign(styles, draftStyleMap['LINK']);
            }
            if (entity.getType() === 'SPOILER') {
               Object.assign(styles, draftStyleMap['SPOILER']);
            }
         }
      }
      return styles;
   };

   return { draftBlockStyleFn, draftCustomStyleFn };
};
