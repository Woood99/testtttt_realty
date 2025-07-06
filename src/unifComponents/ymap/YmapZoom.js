export const handleZoomIn = map => {
   map.setZoom(map.getZoom() + 1, { duration: 200 });
};

export const handleZoomOut = map => {
   map.setZoom(map.getZoom() - 1, { duration: 200 });
};
