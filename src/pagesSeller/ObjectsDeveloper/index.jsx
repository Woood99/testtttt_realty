import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/helpers/selectors';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { BlockCardsPrimaryContext } from '../../context';
import BlockCardsPrimary from '../../components/BlockCardsPrimary';
import { useGetObjects } from '../../hooks/useGetObjects';
import { Link } from 'react-router-dom';
import Button from '../../uiForm/Button';
import { RoutesPath } from '../../constants/RoutesPath';
import { getDataRequest } from '../../api/requestsApi';

const ObjectsDeveloper = () => {
   const [developer, setDeveloper] = useState(null);

   const { objectsOptions, setObjectsOptions } = useGetObjects(
      {
         objects_ids: developer?.objects,
         objectsCount: developer?.objects?.length,
         offset: 92,
      },
      developer
   );

   const userInfo = useSelector(getUserInfo);

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;
      if (!userInfo.organization.id) return;

      const fetch = async () => {
         const data = await getDataRequest(`/api/developers/${userInfo.organization.id}`).then(res => res.data);
         setDeveloper(data);
      };

      fetch();
   }, [userInfo]);

   return (
      <SellerLayout pageTitle="Объекты застройщика">
         <h2 className="title-2 mb-4">Объекты застройщика</h2>
         <BlockCardsPrimaryContext.Provider
            value={{
               data: { objectsCount: developer?.objects?.length },
               setOptions: setObjectsOptions,
               options: objectsOptions,
               title: '',
               skeletonCount: 6,
               EmptyBlockContent: (
                  <>
                     <h3 className="title-3 mt-4">У этого застройщика пока нету объектов</h3>
                     <Link to={RoutesPath.developers.list}>
                        <Button className="mt-6">К списку застройщиков</Button>
                     </Link>
                  </>
               ),
            }}>
            <div ref={objectsOptions.ref}>
               <BlockCardsPrimary />
            </div>
         </BlockCardsPrimaryContext.Provider>
      </SellerLayout>
   );
};

export default ObjectsDeveloper;
