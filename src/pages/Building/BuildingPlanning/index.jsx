import React from 'react';
import CardScheme from '../../../ui/CardScheme';

const BuildingPlanning = ({ data, onClick, room, active }) => {
   return <CardScheme data={data} onClick={e => onClick(e, data.minArea)} room={room} active={active} />;
};

export default BuildingPlanning;
