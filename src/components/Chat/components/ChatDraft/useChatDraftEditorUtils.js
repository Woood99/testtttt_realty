import { convertToHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';

export const useChatDraftEditorUtils = options => {
   const { editorRef } = options;

   const htmlToEditorState = html => {
      try {
         return EditorState.createWithContent(stateFromHTML(html));
      } catch (error) {
         console.error('HTML conversion error:', error);
         return EditorState.createEmpty();
      }
   };

   const getHtml = editorState => {
      const html = convertToHTML({
         styleToHTML: style => {
            if (style === 'BOLD') {
               return {
                  element: 'strong',
                  start: '<strong class="font-medium">',
                  end: '</strong>',
               };
            }
            if (style === 'STRIKETHROUGH') {
               return {
                  element: 'span',
                  start: '<span class="line-through">',
                  end: '</span>',
               };
            }

            return undefined;
         },
         blockToHTML: block => {
            if (block.type === 'blockquote') {
               return {
                  element: 'blockquote',
                  start: '<blockquote class="custom-blockquote">',
                  end: '</blockquote>',
               };
            }
            if (block.text === '' && block.type === 'unstyled') {
               return {
                  start: '<p>&nbsp;</p>',
                  end: '',
               };
            }
            return null;
         },
         entityToHTML: (entity, originalText) => {
            if (entity.type === 'LINK') {
               return {
                  element: 'a',
                  start: `<a href="${entity.data.url}"  target="_blank" rel="noopener noreferrer" class="text-blue block hover:underline">`,
                  end: '</a>',
               };
            }
            if (entity.type === 'SPOILER') {
               return {
                  element: 'span',
                  start: '<span data-draft-spoiler class="draft-spoiler">',
                  end: '</span>',
               };
            }
            return originalText;
         },
      })(editorState.getCurrentContent());

      return html;
   };

   const getTextLength = html => {
      if (!html) return;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      return textContent.replace(/\s+/g, ' ').trim().length;
   };

   const hasText = html => {
      return Boolean(getTextLength(html));
   };

   const onFocusEditor = () => {
      if (!editorRef.current) return;
      setTimeout(() => editorRef.current?.focus(), 0);
   };

   return { htmlToEditorState, getHtml, getTextLength, hasText, onFocusEditor };
};
