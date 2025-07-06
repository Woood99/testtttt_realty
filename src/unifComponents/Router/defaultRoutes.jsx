import { ROLE_BUYER } from '../../constants/roles';
import { RoutesPath } from '../../constants/RoutesPath';
import Apartment from '../../pages/Apartment';
import Building from '../../pages/Building';
import CashbackConditions from '../../pages/CashbackConditions';
import Comparison from '../../pages/Comparison';
import DeveloperPage from '../../pages/Developers/DeveloperPage';
import DevelopersList from '../../pages/Developers/DevelopersList';
import EmptyPage from '../../pages/EmptyPage';
import Favorites from '../../pages/Favorites';
import FeedPromo from '../../pages/Feed/FeedPromo';
import FeedVideos from '../../pages/Feed/FeedVideos';
import FeedPage from '../../pages/FeedPage';
import Home from '../../pages/Home';
import Listing from '../../pages/Listing';
import ListingFlats from '../../pages/ListingFlats';
import { LoginPhone } from '../../pages/LoginPhone';
import ShortsPage from '../../pages/PlayerPage/ShortsPage';
import VideoPage from '../../pages/PlayerPage/VideoPage';
import PrivacyPolicy from '../../pages/PrivacyPolicy';
import Promo from '../../pages/Promo';
import PurchaseList from '../../pages/PurchaseList';
import PurchaseRequest from '../../pages/PurchaseRequest';
import SpecialistPage from '../../pages/Specialists/SpecialistPage';
import SpecialistsList from '../../pages/Specialists/SpecialistsList';

export const defaultRoutes = [
   {
      path: RoutesPath.home,
      body: <Home />,
   },
   {
      path: '/home',
      body: <Home />,
   },
   {
      path: `${RoutesPath.building}:id`,
      body: <Building />,
   },
   {
      path: `${RoutesPath.apartment}:id`,
      body: <Apartment />,
   },
   {
      path: RoutesPath.feed,
      body: <FeedPage />,
   },
   {
      path: RoutesPath.feedPromos,
      body: <FeedPromo />,
   },
   {
      path: RoutesPath.feedVideos,
      body: <FeedVideos />,
   },
   {
      path: RoutesPath.loginPhone,
      body: <LoginPhone />,
   },
   {
      path: RoutesPath.comparison,
      body: <Comparison />,
   },
   {
      path: RoutesPath.favorites,
      body: <Favorites />,
   },
   {
      path: RoutesPath.privacyPolicy,
      body: <PrivacyPolicy />,
   },
   {
      path: RoutesPath.cashbackConditions,
      body: <CashbackConditions />,
   },
   {
      path: `${RoutesPath.promo}:id`,
      body: <Promo />,
   },

   {
      path: RoutesPath.specialists.list,
      body: <SpecialistsList />,
   },
   {
      path: `${RoutesPath.specialists.inner}:id`,
      body: <SpecialistPage />,
   },
   {
      path: RoutesPath.developers.list,
      body: <DevelopersList />,
   },
   {
      path: `${RoutesPath.developers.inner}:id`,
      body: <DeveloperPage />,
   },

   {
      path: RoutesPath.purchase.list,
      body: <PurchaseList role_id={ROLE_BUYER.id} />,
   },
   {
      path: `${RoutesPath.purchase.inner}:id`,
      body: <PurchaseRequest />,
   },
   {
      path: RoutesPath.listing,
      body: <Listing />,
   },
   {
      path: RoutesPath.listingFlats,
      body: <ListingFlats />,
   },
   {
      path: `${RoutesPath.videosPage.videoPage}:id`,
      body: <VideoPage />,
   },
   {
      path: `${RoutesPath.videosPage.shortPage}:id`,
      body: <ShortsPage />,
   },
   {
      path: '*',
      body: <EmptyPage />,
   },
];
