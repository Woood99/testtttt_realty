const BuildingNameLayout = ({ data }) => {
   if (!data.building) return;

   return <span className="ml-1.5">| ЖК {data.building.name}</span>;
};

export default BuildingNameLayout;
