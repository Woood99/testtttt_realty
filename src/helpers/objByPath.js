function objByPath(obj, path) {
   return path.split('.').reduce((acc, part) => (acc === undefined ? undefined : acc[part]), obj);
}

export default objByPath;
