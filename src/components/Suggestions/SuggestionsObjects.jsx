import cn from 'classnames';
import SuggestionsObjectsNav from './SuggestionsObjectsNav';
import SuggestionsObjectsBody from './SuggestionsObjectsBody';

const SuggestionsObjects = ({ className }) => {
   return (
      <div className={cn(className)}>
         <SuggestionsObjectsNav />
         <SuggestionsObjectsBody />
      </div>
   );
};

export default SuggestionsObjects;
