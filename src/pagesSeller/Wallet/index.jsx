import SellerLayout from '../../layouts/SellerLayout';
import WalletHistory from '../../pages/WalletPage/WalletHistory';
import WalletInfoSeller from '../../pages/WalletPage/WalletInfoSeller';

const Wallet = () => {
   return (
      <SellerLayout pageTitle="Кошелёк" classNameContent="!p-0 bg-transparent-imp !shadow-none min-w-0">
         <div className="flex flex-col gap-3">
            <WalletInfoSeller summ={0} className="white-block-small" />
            <WalletHistory className="white-block-small" />
         </div>
      </SellerLayout>
   );
};

export default Wallet;
