import React from 'react';
import { Navigate } from 'react-router-dom';
import { PrivateRoutesPath } from '../constants/RoutesPath';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import isEmptyArrObj from '../helpers/isEmptyArrObj';
import { ROLE_ADMIN } from '../constants/roles';
import { getUserInfo } from '../redux/helpers/selectors';

const AdminPrivateRoute = ({ children }) => {
   const [cookies] = useCookies();
    const userInfo = useSelector(getUserInfo);

   if (!cookies.loggedIn) {
      return <Navigate to={PrivateRoutesPath.login} />;
   } else if (userInfo && !isEmptyArrObj(userInfo) && userInfo.role?.id !== ROLE_ADMIN.id) {
      return <Navigate to={PrivateRoutesPath.login} />;
   }

   return children;
};

export default AdminPrivateRoute;
