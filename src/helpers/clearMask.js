const clearMask = value => {
   if (!value) return;
   return value
      .replace(/[$,_\-\(\)]/g, '')
      .replace(/\s+/g, '')
};

export default clearMask;
