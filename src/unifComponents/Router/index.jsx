import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { defaultRoutes } from './defaultRoutes';
import { sellerRoutes } from './sellerRoutes';
import { buyerRoutes } from './buyerRoutes';
import UserPrivateRoute from '../UserPrivateRoute';
import { PrivateRoutesPath, SellerRoutesPath } from '../../constants/RoutesPath';
import AdminLogin from '../../admin/pages/AdminLogin';
import { privateRoutes } from './privateRoutes';
import AdminPrivateRoute from '../AdminPrivateRoute';
import AdminLayout from '../../layouts/AdminLayout';
import { ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';
import { authRoutes } from './authRoutes';

const Router = () => {
   return (
      <Routes>
         {defaultRoutes.map((item, index) => {
            return <Route key={index} path={item.path} element={item.body} />;
         })}
         <Route path={SellerRoutesPath.home}>
            {sellerRoutes.map((item, index) => {
               return <Route key={index} path={item.path} element={<UserPrivateRoute role_id={ROLE_SELLER.id}>{item.body}</UserPrivateRoute>} />;
            })}
         </Route>

         {buyerRoutes.map((item, index) => {
            return <Route key={index} path={item.path} element={<UserPrivateRoute role_id={ROLE_BUYER.id}>{item.body}</UserPrivateRoute>} />;
         })}
         {authRoutes.map((item, index) => {
            return <Route key={index} path={item.path} element={<UserPrivateRoute role_id="auth">{item.body}</UserPrivateRoute>} />;
         })}
         <Route path={PrivateRoutesPath.dashboardAdmin}>
            <Route path={PrivateRoutesPath.login} element={<AdminLogin />} />
            {privateRoutes.map((item, index) => {
               return (
                  <Route
                     key={index}
                     path={item.path}
                     element={<AdminPrivateRoute>{!item.main_layout_hidden ? <AdminLayout>{item.body}</AdminLayout> : item.body}</AdminPrivateRoute>}
                  />
               );
            })}
         </Route>
      </Routes>
   );
};

export default Router;
