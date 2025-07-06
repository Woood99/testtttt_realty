import objByPath from '../../helpers/objByPath';

function changeFieldInputFunc(state, action) {
   const { value, name, path } = action.payload;

   if (value === '') {
      delete objByPath(state, path).value[name];
   } else {
      objByPath(state, path).value = { ...objByPath(state, path).value, [name]: value };
   }
}

export default changeFieldInputFunc;
