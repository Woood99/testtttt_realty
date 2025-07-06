import axios from 'axios';

const downloadImage = async url => {
   try {
      const response = await axios.get(url, {
         responseType: 'blob',
      });

      const blob = response.data;

      const file = new File([blob], 'downloaded-image.jpg', { type: blob.type });
      return file;
   } catch (err) {}
};

export default downloadImage;
