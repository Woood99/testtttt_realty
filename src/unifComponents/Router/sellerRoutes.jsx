import { SellerRoutesPath } from '../../constants/RoutesPath';
import PurchaseRequest from '../../pages/PurchaseRequest';
import CalendarView from '../../pagesSeller/Calendar';
import HomeSeller from '../../pagesSeller/HomeSeller';
import MyObjects from '../../pagesSeller/MyObjects';
import MyViewSeller from '../../pagesSeller/MyViewSeller';
import ObjectsDeveloper from '../../pagesSeller/ObjectsDeveloper';
import SellerPurchaseListAll from '../../pagesSeller/SellerPurchaseList/SellerPurchaseListAll';
import SellerPurchaseListBuyers from '../../pagesSeller/SellerPurchaseList/SellerPurchaseListBuyers';
import SpecialistsDeveloper from '../../pagesSeller/SpecialistsDeveloper';
import Wallet from '../../pagesSeller/Wallet';

export const sellerRoutes = [
   {
      path: SellerRoutesPath.home,
      body: <HomeSeller />,
   },
   {
      path: SellerRoutesPath.object.list,
      body: <MyObjects />,
   },
   {
      path: SellerRoutesPath.view,
      body: <MyViewSeller />,
   },
   // {
   //    path: `${SellerRoutesPath.buyer}:id/statistics`,
   //    body: <DetailedStatistics />,
   // },
   {
      path: SellerRoutesPath.purchase.list_all,
      body: <SellerPurchaseListBuyers />,
   },
   {
      path: SellerRoutesPath.purchase.list_buyers,
      body: <SellerPurchaseListAll />,
   },
   {
      path: SellerRoutesPath.specialists,
      body: <SpecialistsDeveloper />,
   },
   {
      path: SellerRoutesPath.objects_developer,
      body: <ObjectsDeveloper />,
   },
   {
      path: SellerRoutesPath.wallet,
      body: <Wallet />,
   },
   {
      path: SellerRoutesPath.calendar_view,
      body: <CalendarView />,
   },
   {
      path: `${SellerRoutesPath.purchase.inner}:id`,
      body: <PurchaseRequest />,
   },
];
