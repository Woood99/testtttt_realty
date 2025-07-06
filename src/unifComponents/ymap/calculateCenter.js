const calculateCenter = coordinates => {
   var sumLat = 0;
   var sumLng = 0;
   var numPoints = coordinates.length;

   for (var i = 0; i < numPoints; i++) {
      sumLat += coordinates[i][0];
      sumLng += coordinates[i][1];
   }

   var centerLat = sumLat / numPoints;
   var centerLng = sumLng / numPoints;

   return [centerLat, centerLng];
};

export default calculateCenter;
