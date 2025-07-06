import cn from 'classnames';

const SuggestionsCardActionLayout = ({ children, className }) => {
   return <div className={cn('grid grid-cols-[max-content_1fr] gap-2', className)}>{children}</div>;
};

export default SuggestionsCardActionLayout;
