import { BuyerRoutesPath } from '../../constants/RoutesPath';
import PurchaseCreate from '../../pages/PurchaseCreate';
import PurchaseRequest from '../../pages/PurchaseRequest';
import MyViewBuyer from '../../pagesBuyer/MyViewBuyer';
import MyPurchaseList from '../../pagesBuyer/MyPurchaseList';
import WalletPage from '../../pages/WalletPage';

export const buyerRoutes = [
   {
      path: BuyerRoutesPath.purchase.list,
      body: <MyPurchaseList />,
   },
   {
      path: `${BuyerRoutesPath.purchase.inner}:id`,
      body: <PurchaseRequest />,
   },
   {
      path: BuyerRoutesPath.purchase.create,
      body: <PurchaseCreate />,
   },
   {
      path: `${BuyerRoutesPath.purchase.edit}:id`,
      body: <PurchaseCreate isEdit />,
   },
   {
      path: BuyerRoutesPath.walletPage,
      body: <WalletPage />,
   },
   {
      path: BuyerRoutesPath.view,
      body: <MyViewBuyer />,
   },
];
