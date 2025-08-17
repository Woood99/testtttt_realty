import getTextLength from './getTextLength';

const hasText = html => {
   return Boolean(getTextLength(html));
};

export default hasText;
