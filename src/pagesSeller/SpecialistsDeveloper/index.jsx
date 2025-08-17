import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import Specialist from '../../ui/Specialist';
import { useSelector } from 'react-redux';
import { getUserInfo } from '@/redux';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { getSpecialistsOrganization } from '../../api/Building/getSpecialists';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';

const SpecialistsDeveloper = () => {
   const [data, setData] = useState([]);
   const userInfo = useSelector(getUserInfo);
   const navigateToChat = useNavigateToChat();

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;
      if (!userInfo.organization.id) return;

      const fetch = async () => {
         const specialists = await getSpecialistsOrganization(userInfo.organization.id);
         setData(specialists);
      };

      fetch();
   }, [userInfo]);

   return (
      <SellerLayout pageTitle="Менеджеры отдела продаж">
         <h2 className="title-2 mb-4">Менеджеры отдела продаж</h2>
         <div className="grid grid-cols-4 gap-x-5 gap-y-10 md3:grid-cols-3 md4:grid-cols-2">
            {data.map(item => {
               return (
                  <Specialist
                     key={item.id}
                     {...item}
                     link
                     visibleChat
                     onClickChat={async () => {
                        await navigateToChat({ recipients_id: [item.id] });
                     }}
                  />
               );
            })}
         </div>
      </SellerLayout>
   );
};

export default SpecialistsDeveloper;
