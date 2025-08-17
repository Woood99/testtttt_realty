export const appendParams = (state, name, value, type = 'array') => {
   state.delete(name);
   if (!value) return;

   if (type === 'array') {
      value.forEach(item => {
         state.append(name, item);
      });
   }

   if (type === 'array-csv') {
      if (!value?.length) return;

      if (Array.isArray(value)) {
         state.set(name, value.join(','));
      } else if (typeof value === 'string') {
         state.set(name, value);
      }
   }

   if (type === 'number') {
      state.append(name, value.replace(/\s+/g, ''));
   }

   if (type === 'string') {
      state.append(name, value);
   }
   if (type === 'bool') {
      state.append(name, 1);
   }
};
