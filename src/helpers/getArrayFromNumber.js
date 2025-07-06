const getArrayFromNumber = number => {
   return Array.from({ length: number }, (_, i) => i);
};

export default getArrayFromNumber;
