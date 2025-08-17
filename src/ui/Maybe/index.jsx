const Maybe = ({ condition, children, fallback = null, render }) => {
   const shouldRender = Boolean(condition);

   if (shouldRender && render) return render(condition);
   if (shouldRender) return children;
   return fallback;
};

export default Maybe;
